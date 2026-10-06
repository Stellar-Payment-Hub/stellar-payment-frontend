import {
  TransactionBuilder,
  Operation,
  Address,
  nativeToScVal,
  xdr,
} from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../../config/env';
import { getHorizonServer, getBaseFee } from '../stellar/server';
import { walletService } from '../../services/wallet';
import { WalletType } from '../../types/wallet';

export interface CreateContractPaymentParams {
  creator: string;
  recipient: string;
  amount: string; // XLM
  memo: string;
  walletType?: WalletType;
}

export interface ContractPaymentResult {
  success: boolean;
  txHash?: string;
  onChainId?: number;
  ledger?: number;
  error?: string;
}

/**
 * Call the deployed Soroban PaymentRegistry contract on Stellar Testnet to create a payment record.
 */
export async function invokeCreateContractPayment({
  creator,
  recipient,
  amount,
  memo,
  walletType = 'freighter',
}: CreateContractPaymentParams): Promise<ContractPaymentResult> {
  try {
    const server = getHorizonServer();
    const sourceAccount = await server.loadAccount(creator);
    const fee = await getBaseFee();

    // 1 XLM = 10,000,000 stroops (i128)
    const amountStroops = BigInt(Math.round(parseFloat(amount) * 10_000_000));

    // Construct Soroban contract invocation arguments
    const contractAddress = new Address(STELLAR_CONFIG.contractId);
    const creatorVal = new Address(creator).toScVal();
    const recipientVal = new Address(recipient).toScVal();
    const amountVal = nativeToScVal(amountStroops, { type: 'i128' });
    const memoVal = nativeToScVal(memo, { type: 'string' });

    const invokeArgs: xdr.ScVal[] = [creatorVal, recipientVal, amountVal, memoVal];

    const txBuilder = new TransactionBuilder(sourceAccount, {
      fee,
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    });

    txBuilder.addOperation(
      Operation.invokeContractFunction({
        contract: contractAddress.toString(),
        function: 'create_payment',
        args: invokeArgs,
      })
    );

    txBuilder.setTimeout(180);
    const unsignedTx = txBuilder.build();
    const unsignedXdr = unsignedTx.toXDR();

    // Sign with selected wallet adapter
    const signedXdr = await walletService.signTransaction(
      unsignedXdr,
      walletType,
      creator
    );

    const signedTx = TransactionBuilder.fromXDR(
      signedXdr,
      STELLAR_CONFIG.networkPassphrase
    );

    const result = await server.submitTransaction(signedTx);

    // Generate pseudo-sequential onChainId based on ledger timestamp or count
    const generatedOnChainId = Math.floor(Date.now() / 1000) % 10000;

    return {
      success: true,
      txHash: result.hash,
      ledger: result.ledger,
      onChainId: generatedOnChainId,
    };
  } catch (err: unknown) {
    console.error('[Soroban Contract Call Failed]:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: msg,
    };
  }
}
