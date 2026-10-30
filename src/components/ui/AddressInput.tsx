import React, { useState } from 'react';
import { StrKey } from '@stellar/stellar-sdk';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = 'G... or C...',
  label = 'Stellar Address or Contract ID',
}) => {
  const [touched, setTouched] = useState(false);

  const isValidKey = StrKey.isValidEd25519PublicKey(value);
  const isValidContract = StrKey.isValidContract(value);
  const isValid = isValidKey || isValidContract;

  return (
    <div className="flex flex-col gap-1.5 my-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">{label}</label>
        {touched && value && (
          <span className={`text-xs flex items-center gap-1 ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isValid ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>{isValidContract ? 'Valid Contract' : 'Valid Public Key'}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                <span>Invalid Format</span>
              </>
            )}
          </span>
        )}
      </div>
      <input
        data-testid="stellar-address-input"
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value.trim());
          setTouched(true);
        }}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        className={`bg-slate-800 border rounded-lg px-3 py-2 text-sm text-white font-mono outline-none ${
          touched && value && !isValid ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
        }`}
      />
    </div>
  );
};
