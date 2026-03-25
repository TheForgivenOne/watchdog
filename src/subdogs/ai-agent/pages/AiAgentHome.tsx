import { useState } from 'react';
import { AiChatBox } from '../components/AiChatBox';
import { useAiAgent } from '../hooks/useAiAgent';
import { AVAILABLE_TOOLS } from '../services/toolExecutor';

export function AiAgentHome() {
  const {
    conversations,
    messages,
    isProcessing,
    startNewConversation,
    selectConversation,
    processUserMessage,
  } = useAiAgent();

  const [activeTab, setActiveTab] = useState<'chat' | 'tools'>('chat');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
        <p className="text-slate-400">Your personal AI assistant for accessing dashboard data</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <button
                onClick={() => startNewConversation()}
                className="w-full px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Chat
              </button>
            </div>
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recent Chats
              </h3>
              {conversations.length === 0 ? (
                <p className="px-3 py-4 text-sm text-slate-500 text-center">
                  No conversations yet
                </p>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv: any) => (
                    <button
                      key={conv._id}
                      onClick={() => selectConversation(conv._id)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition-colors group"
                    >
                      <div className="text-sm text-slate-200 truncate">{conv.title}</div>
                      <div className="text-xs text-slate-500 truncate">{conv.preview || 'New conversation'}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'chat'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'tools'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Available Tools
            </button>
          </div>

          {activeTab === 'chat' ? (
            <div className="flex-1">
              <AiChatBox
                messages={messages}
                onSendMessage={processUserMessage}
                isProcessing={isProcessing}
                title="AI Assistant"
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Available Tools</h2>
              <p className="text-slate-400 mb-6">
                The AI assistant has access to the following tools to help you interact with your dashboard data.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {AVAILABLE_TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-violet-500 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          tool.category === 'news'
                            ? 'bg-blue-500/20 text-blue-400'
                            : tool.category === 'weather'
                            ? 'bg-sky-500/20 text-sky-400'
                            : tool.category === 'bookmarks'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : tool.category === 'locations'
                            ? 'bg-green-500/20 text-green-400'
                            : tool.category === 'preferences'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {tool.category}
                      </span>
                      <h3 className="font-mono text-sm text-violet-400">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400">{tool.description}</p>
                    {tool.parameters.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-slate-500 mb-1">Parameters:</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.parameters.map((param) => (
                            <span
                              key={param.name}
                              className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded font-mono"
                            >
                              {param.name}
                              {param.required ? '*' : ''}: {param.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
