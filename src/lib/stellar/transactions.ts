import {
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  Horizon,
} from '@stellar/stellar-sdk';
import { getHorizonServer, getBaseFee } from './server';
import { STELLAR_CONFIG } from '../../config/env';
import { signTransactionWithFreighter } from '../wallet/freighter';
import { PaymentSubmissionResult } from '../../types/payment';

export interface BuildPaymentParams {
  sender: string;
  recipient: string;
  amount: string;
  memo?: string;
}

/**
 * Check if a recipient account exists on Stellar Testnet.
 */
export async function accountExists(publicKey: string): Promise<boolean> {
  try {
    const server = getHorizonServer();
    await server.loadAccount(publicKey);
    return true;
  } catch (err: unknown) {
    const errorObj = err as { response?: { status?: number } };
    if (errorObj.response && errorObj.response.status === 404) {
      return false;
    }
    // If other network error, assume true to let submission validate
    return true;
  }
}

/**
 * Build an unsigned Stellar Testnet Payment transaction XDR.
 */
export async function buildPaymentTransaction({
  sender,
  recipient,
  amount,
  memo,
}: BuildPaymentParams): Promise<string> {
  const server = getHorizonServer();

  // 1. Fetch current sequence of source account
  let sourceAccount: Horizon.AccountResponse;
  try {
    sourceAccount = await server.loadAccount(sender);
  } catch (err: unknown) {
    const errorObj = err as { response?: { status?: number } };
    if (errorObj.response && errorObj.response.status === 404) {
      throw new Error(
        'Your wallet account is not yet funded on Stellar Testnet. Please fund it with Friendbot first.'
      );
    }
    throw new Error('Failed to load source account from Stellar Testnet.');
  }

  // 2. Fetch fee
  const fee = await getBaseFee();

  // 3. Build TransactionBuilder
  const builder = new TransactionBuilder(sourceAccount, {
    fee,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  });

  // 4. Check if recipient exists; if not, use createAccount or payment
  const recipientExists = await accountExists(recipient);

  if (!recipientExists) {
    const amountNum = parseFloat(amount);
    if (amountNum < 1.0) {
      throw new Error(
        'Recipient account is new and requires at least 1.0 XLM minimum reserve to be created on Stellar.'
      );
    }
    // New account creation on Stellar requires createAccount operation
    builder.addOperation(
      Operation.createAccount({
        destination: recipient,
        startingBalance: amount,
      })
    );
  } else {
    // Standard native XLM payment operation
    builder.addOperation(
      Operation.payment({
        destination: recipient,
        asset: Asset.native(),
        amount,
      })
    );
  }

  // 5. Add optional Memo
  if (memo && memo.trim().length > 0) {
    builder.addMemo(Memo.text(memo.trim()));
  }

  // 6. Set timeout (180 seconds)
  builder.setTimeout(180);

  const transaction = builder.build();
  return transaction.toXDR();
}

/**
 * Execute the end-to-end payment workflow:
 * 1. Build unsigned transaction XDR
 * 2. Request signature from Freighter
 * 3. Submit signed transaction to Stellar Testnet Horizon
 */
export async function executeStellarPayment({
  sender,
  recipient,
  amount,
  memo,
  onStatusChange,
}: BuildPaymentParams & {
  onStatusChange?: (status: 'preparing' | 'awaiting_signature' | 'submitting') => void;
}): Promise<PaymentSubmissionResult> {
  try {
    // Step 1: Preparing transaction
    onStatusChange?.('preparing');
    const unsignedXdr = await buildPaymentTransaction({
      sender,
      recipient,
      amount,
      memo,
    });

    // Step 2: Request Freighter signature
    onStatusChange?.('awaiting_signature');
    const signedXdr = await signTransactionWithFreighter(unsignedXdr, sender);

    // Step 3: Submitting to Testnet
    onStatusChange?.('submitting');
    const server = getHorizonServer();
    const signedTx = TransactionBuilder.fromXDR(
      signedXdr,
      STELLAR_CONFIG.networkPassphrase
    );

    const horizonResult = await server.submitTransaction(signedTx);

    return {
      status: 'success',
      hash: horizonResult.hash,
      ledger: horizonResult.ledger,
      recipient,
      amount,
      memo,
      timestamp: Date.now(),
    };
  } catch (err: unknown) {
    console.error('[Stellar Payment Error]:', err);

    let errorMessage = 'Payment submission failed.';

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    // Parse Horizon submission errors if available
    const horizonError = err as {
      response?: {
        data?: {
          extras?: {
            result_codes?: {
              transaction?: string;
              operations?: string[];
            };
          };
        };
      };
    };

    if (horizonError.response?.data?.extras?.result_codes) {
      const codes = horizonError.response.data.extras.result_codes;
      const opCodes = codes.operations ? codes.operations.join(', ') : '';

      if (opCodes.includes('op_underfunded')) {
        errorMessage = 'Transaction rejected: Insufficient funds to cover payment and network reserve.';
      } else if (opCodes.includes('op_no_destination')) {
        errorMessage = 'Recipient account does not exist on Stellar Testnet and requires at least 1.0 XLM to activate.';
      } else if (codes.transaction === 'tx_bad_seq') {
        errorMessage = 'Sequence number mismatch. Please refresh and try again.';
      } else if (codes.transaction === 'tx_too_late') {
        errorMessage = 'Transaction expired before being included in a ledger. Please retry.';
      } else {
        errorMessage = `Stellar Network Error: ${codes.transaction || 'tx_failed'} (${opCodes || 'unknown operation code'})`;
      }
    }

    return {
      status: 'failed',
      error: errorMessage,
      recipient,
      amount,
      memo,
      timestamp: Date.now(),
    };
  }
}
