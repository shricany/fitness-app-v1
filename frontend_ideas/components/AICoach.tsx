
import React, { useState, useRef, useEffect } from 'react';
import { getAICoachResponse } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon } from './icons';

interface Message {
  text: string;
  isUser: boolean;
}

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm SyncFit AI, your personal fitness coach. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAICoachResponse(input);
      const aiMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { text: "Sorry, something went wrong.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl flex flex-col h-full max-h-[80vh]">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <SparklesIcon className="w-6 h-6 text-cyan-400 mr-3"/>
        <h2 className="text-xl font-bold">AI Fitness Coach</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${msg.isUser ? 'bg-cyan-600 text-white' : 'bg-gray-700'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end justify-start">
               <div className="px-4 py-2 rounded-lg bg-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a fitness question..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-3 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
   