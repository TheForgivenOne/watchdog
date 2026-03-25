import { FloatingAiButton } from './FloatingAiButton';
import { AiChatModal } from './AiChatModal';
import { useAiAgent } from '../hooks/useAiAgent';

export function AiAgent() {
  const {
    isModalOpen,
    isMinimized,
    messages,
    isProcessing,
    openModal,
    closeModal,
    toggleMinimize,
    processUserMessage,
  } = useAiAgent();

  return (
    <>
      <FloatingAiButton onClick={openModal} />
      <AiChatModal
        isOpen={isModalOpen}
        isMinimized={isMinimized}
        messages={messages}
        onClose={closeModal}
        onMinimize={toggleMinimize}
        onSendMessage={processUserMessage}
        isProcessing={isProcessing}
      />
    </>
  );
}
