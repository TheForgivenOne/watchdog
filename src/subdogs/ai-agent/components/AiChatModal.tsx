import { useEffect, useRef } from 'react';
import { AiChatBox } from './AiChatBox';
import type { AiMessage } from '../types';

interface AiChatModalProps {
  isOpen: boolean;
  isMinimized: boolean;
  messages: AiMessage[];
  onClose: () => void;
  onMinimize: () => void;
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export function AiChatModal({
  isOpen,
  isMinimized,
  messages,
  onClose,
  onMinimize,
  onSendMessage,
  isProcessing,
}: AiChatModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div
        ref={modalRef}
        className={`pointer-events-auto transition-all duration-300 ${
          isMinimized
            ? 'w-80 h-16'
            : 'w-full max-w-md h-[600px] sm:h-[500px]'
        }`}
        style={{
          transform: isMinimized ? 'translateY(calc(100% - 64px))' : 'translateY(0)',
        }}
      >
        <div className="h-full flex flex-col shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 cursor-pointer" onClick={onMinimize}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5 text-white"
                >
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/70">Click to {isMinimized ? 'expand' : 'minimize'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-white"
                >
                  {isMinimized ? (
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  ) : (
                    <path d="M4 14h6v6M14 4h6v6M21 3l-7 7M3 21l7-7" />
                  )}
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-white"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <AiChatBox
                messages={messages}
                onSendMessage={onSendMessage}
                isProcessing={isProcessing}
                showHeader={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
