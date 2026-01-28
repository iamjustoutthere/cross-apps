import { useState } from 'react';
import { X, Wallet, ArrowRight, Check } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { supportedChains } from '../mock/terminalData';

export function DepositModal() {
  const { activeModal, closeModal, deposit, portfolio } = useTerminalStore();
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  if (activeModal !== 'deposit') return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const handleDeposit = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setStep('confirm');

    // Simulate deposit
    setTimeout(() => {
      deposit(parsedAmount);
      setStep('success');
    }, 1500);
  };

  const handleClose = () => {
    setStep('select');
    setAmount('');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md border border-terminal-border bg-terminal-bg-secondary">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-terminal-accent" />
            <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
              DEPOSIT
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-terminal-bg-tertiary"
          >
            <X size={16} className="text-terminal-text-muted" />
          </button>
        </div>

        {step === 'select' && (
          <>
            {/* Chain Selection */}
            <div className="p-4 border-b border-terminal-border">
              <label className="block text-micro text-terminal-text-muted uppercase mb-2">
                SELECT SOURCE CHAIN
              </label>
              <div className="grid grid-cols-3 gap-2">
                {supportedChains.map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain.id)}
                    className={`px-3 py-2 text-caption border ${
                      selectedChain === chain.id
                        ? 'bg-terminal-accent text-white border-terminal-accent'
                        : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-text-muted'
                    }`}
                  >
                    {chain.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="p-4">
              <label className="block text-micro text-terminal-text-muted uppercase mb-2">
                AMOUNT (USD)
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-terminal-bg-primary border-b border-terminal-border text-body text-terminal-text-primary placeholder:text-terminal-text-muted outline-none focus:border-terminal-accent"
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                {[1000, 5000, 10000, 25000].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-2 text-micro border border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary hover:border-terminal-text-muted"
                  >
                    ${val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="px-4 pb-4">
              <div className="p-4 bg-terminal-bg-primary border border-terminal-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-caption text-terminal-text-muted">CURRENT BALANCE</span>
                  <span className="text-caption text-terminal-text-primary">
                    {formatCurrency(portfolio.availableBalance)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-terminal-text-muted">AFTER DEPOSIT</span>
                  <span className="text-caption text-terminal-positive">
                    {formatCurrency(portfolio.availableBalance + (parseFloat(amount) || 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 border-t border-terminal-border">
              <button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-4 text-body font-bold uppercase bg-terminal-accent text-white hover:opacity-90 disabled:bg-terminal-text-muted disabled:cursor-not-allowed"
              >
                DEPOSIT {amount ? formatCurrency(parseFloat(amount)) : ''}
              </button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <ArrowRight size={48} className="mx-auto mb-4 text-terminal-accent" />
              <div className="text-caption text-terminal-text-primary">
                PROCESSING DEPOSIT...
              </div>
              <div className="text-micro text-terminal-text-muted mt-2">
                Settling via Fast parallel layer
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <Check size={48} className="mx-auto mb-4 text-terminal-positive" />
            <div className="text-title font-bold text-terminal-text-primary mb-2">
              DEPOSIT COMPLETE
            </div>
            <div className="text-caption text-terminal-text-secondary mb-4">
              {formatCurrency(parseFloat(amount))} has been added to your balance
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 text-caption font-bold uppercase border border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-white"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
