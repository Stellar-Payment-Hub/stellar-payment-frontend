import { StrKey } from '@stellar/stellar-sdk';
import { PaymentFormData, PaymentFormErrors } from '../../types/payment';

/**
 * Validate a Stellar recipient address.
 * Rejects empty, invalid, malformed, or same-as-sender addresses.
 */
export function validateRecipient(
  recipient: string,
  senderAddress?: string | null
): string | null {
  const trimmed = recipient.trim();

  if (!trimmed) {
    return 'Recipient Stellar address is required.';
  }

  // Must begin with 'G' and be a valid Ed25519 public key
  if (!trimmed.startsWith('G')) {
    return 'Stellar public keys must begin with the letter G.';
  }

  if (trimmed.length !== 56) {
    return 'Stellar addresses must be exactly 56 characters long.';
  }

  if (!StrKey.isValidEd25519PublicKey(trimmed)) {
    return 'Please enter a valid Stellar address.';
  }

  if (senderAddress && trimmed === senderAddress) {
    return 'Recipient address cannot be your own wallet address.';
  }

  return null;
}

/**
 * Check if a string is a valid Stellar address
 */
export function isValidAddress(address: string): boolean {
  return validateRecipient(address) === null;
}

/**
 * Validate the payment XLM amount.
 * Rejects empty, non-numeric, zero, negative, or amounts exceeding available spendable balance.
 */
export function validateAmount(
  amount: string,
  availableBalance?: string | null
): string | null {
  const trimmed = amount.trim();

  if (!trimmed) {
    return 'Payment amount is required.';
  }

  const num = parseFloat(trimmed);

  if (isNaN(num)) {
    return 'Amount must be a valid number.';
  }

  if (num <= 0) {
    return 'Amount must be greater than 0.';
  }

  // Check decimal precision (Stellar supports up to 7 decimal places / stroops)
  const parts = trimmed.split('.');
  if (parts.length === 2 && parts[1].length > 7) {
    return 'Stellar amounts support a maximum of 7 decimal places.';
  }

  if (availableBalance !== undefined && availableBalance !== null) {
    const balanceNum = parseFloat(availableBalance);
    if (!isNaN(balanceNum) && num > balanceNum) {
      return 'Insufficient XLM balance.';
    }
  }

  return null;
}

/**
 * Validate the optional Stellar Text Memo.
 * Stellar memos of type MEMO_TEXT are limited to 28 UTF-8 bytes.
 */
export function validateMemo(memo: string): string | null {
  if (!memo) return null;

  const byteLength = new TextEncoder().encode(memo).length;
  if (byteLength > 28) {
    return `Memo exceeds Stellar's 28-byte limit (currently ${byteLength} bytes).`;
  }

  return null;
}

/**
 * Complete validator for the payment form.
 */
export function validatePaymentForm(
  data: PaymentFormData,
  availableBalance?: string | null,
  senderAddress?: string | null
): { isValid: boolean; errors: PaymentFormErrors } {
  const errors: PaymentFormErrors = {};

  const recipientError = validateRecipient(data.recipient, senderAddress);
  if (recipientError) errors.recipient = recipientError;

  const amountError = validateAmount(data.amount, availableBalance);
  if (amountError) errors.amount = amountError;

  const memoError = validateMemo(data.memo);
  if (memoError) errors.memo = memoError;

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}
