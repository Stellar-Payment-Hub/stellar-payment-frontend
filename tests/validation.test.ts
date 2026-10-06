import { describe, it, expect } from 'vitest';
import {
  validateRecipient,
  validateAmount,
  validateMemo,
  validatePaymentForm,
} from '../src/lib/validation/payment';

describe('Payment Validation', () => {
  const validStellarAddress =
    'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
  const anotherValidAddress =
    'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

  describe('validateRecipient', () => {
    it('rejects empty address', () => {
      expect(validateRecipient('')).toBe('Recipient Stellar address is required.');
      expect(validateRecipient('   ')).toBe('Recipient Stellar address is required.');
    });

    it('rejects addresses not starting with G', () => {
      expect(
        validateRecipient(
          'SBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
        )
      ).toBe('Stellar public keys must begin with the letter G.');
    });

    it('rejects addresses with invalid length', () => {
      expect(validateRecipient('GBBD47IF6LWK7P7M')).toBe(
        'Stellar addresses must be exactly 56 characters long.'
      );
    });

    it('rejects malformed Stellar checksum addresses', () => {
      // 56 chars but invalid checksum
      const badChecksum =
        'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLAA';
      expect(validateRecipient(badChecksum)).toBe(
        'Please enter a valid Stellar address.'
      );
    });

    it('rejects sending to own wallet address', () => {
      expect(
        validateRecipient(validStellarAddress, validStellarAddress)
      ).toBe('Recipient address cannot be your own wallet address.');
    });

    it('accepts valid Stellar public key', () => {
      expect(validateRecipient(validStellarAddress)).toBeNull();
    });
  });

  describe('validateAmount', () => {
    it('rejects empty amount', () => {
      expect(validateAmount('')).toBe('Payment amount is required.');
      expect(validateAmount('   ')).toBe('Payment amount is required.');
    });

    it('rejects non-numeric values', () => {
      expect(validateAmount('abc')).toBe('Amount must be a valid number.');
    });

    it('rejects zero or negative amounts', () => {
      expect(validateAmount('0')).toBe('Amount must be greater than 0.');
      expect(validateAmount('-5.5')).toBe('Amount must be greater than 0.');
    });

    it('rejects precision beyond 7 decimal places', () => {
      expect(validateAmount('1.12345678')).toBe(
        'Stellar amounts support a maximum of 7 decimal places.'
      );
    });

    it('rejects amounts exceeding available balance', () => {
      expect(validateAmount('150.00', '100.00')).toBe(
        'Insufficient XLM balance.'
      );
    });

    it('accepts valid amounts within balance', () => {
      expect(validateAmount('25.50', '100.00')).toBeNull();
      expect(validateAmount('100.00', '100.00')).toBeNull();
    });
  });

  describe('validateMemo', () => {
    it('accepts empty memo', () => {
      expect(validateMemo('')).toBeNull();
    });

    it('accepts memo within 28 bytes', () => {
      expect(validateMemo('Invoice #1042')).toBeNull();
    });

    it('rejects memo exceeding 28 bytes', () => {
      const longMemo = 'This memo is definitely way longer than 28 bytes total!';
      expect(validateMemo(longMemo)).toContain('exceeds Stellar');
    });
  });

  describe('validatePaymentForm', () => {
    it('returns valid when all fields satisfy criteria', () => {
      const result = validatePaymentForm(
        {
          recipient: validStellarAddress,
          amount: '10.5',
          memo: 'Gift',
        },
        '50.00',
        anotherValidAddress
      );
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns errors map when fields are invalid', () => {
      const result = validatePaymentForm(
        {
          recipient: 'invalid',
          amount: '-1',
          memo: 'A'.repeat(30),
        },
        '50.00',
        anotherValidAddress
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.recipient).toBeDefined();
      expect(result.errors.amount).toBeDefined();
      expect(result.errors.memo).toBeDefined();
    });
  });
});
