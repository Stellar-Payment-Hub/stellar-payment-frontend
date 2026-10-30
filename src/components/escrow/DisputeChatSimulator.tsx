import React, { useState } from 'react';

export const DisputeChatSimulator: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: 'Buyer', text: 'Deliverable missing unit tests for the Soroban client.' },
    { sender: 'Seller', text: 'Tests were pushed in commit 3e23cab, checking now.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3" data-testid="dispute-chat-simulator">
      <div className="text-xs font-bold text-slate-900 dark:text-white">Pre-Arbitration Discussion</div>
      <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{m.sender}: </span>
            <span className="text-slate-800 dark:text-slate-200">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Propose resolution..."
          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
        />
        <button onClick={send} className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
          Send
        </button>
      </div>
    </div>
  );
};
