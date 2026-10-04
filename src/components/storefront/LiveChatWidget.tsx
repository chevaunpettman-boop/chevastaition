import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, X, Send, ChefHat } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'concierge';
  text: string;
  time: string;
}

export const LiveChatWidget: React.FC = () => {
  const { isChatOpen, setIsChatOpen } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'concierge',
      text: 'Sawasdee khrup! Welcome to SiamHarvest. I am Chef Somchai, your Thai Culinary Concierge. How can I assist you with authentic Thai recipes, spice levels, or cold-chain air freight today?',
      time: '10:40 AM',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'How spicy is Nam Prik Pao?',
    'How does cold-chain keep lemongrass fresh?',
    'How to brew ChaTraMue Thai Tea?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('nam prik') || lower.includes('spicy') || lower.includes('chili')) {
        botResponse =
          'Nam Prik Pao (Roasted Chili Paste) sits at Level 2 (Medium). It has a warm, sweet, and smoky roasted shallot profile rather than incendiary burn. If you want maximum authentic fire, choose our Stone-Ground Green Curry Paste (Level 4 - Thai Spicy 🌶️🌶️🌶️🌶️)!';
      } else if (lower.includes('cold') || lower.includes('fresh') || lower.includes('lemongrass')) {
        botResponse =
          'Our fresh Tom Yum kits and fresh herbs are packed at Bangkok Suvarnabhumi with food-grade dry ice and insulated thermal liners. Monitored by Sensitech IoT loggers at 2°C–5°C throughout the Thai Airways flight, arriving crisp and fragrant in your kitchen!';
      } else if (lower.includes('tea') || lower.includes('chatramue') || lower.includes('brew')) {
        botResponse =
          'To make authentic Cha Yen: Steep 2 tablespoons of ChaTraMue black tea in 200ml boiling water for 4 minutes. Strain, stir in 2 tbsp sweetened condensed milk and 2 tbsp evaporated milk. Pour over crushed ice and top with a splash of fresh half-and-half!';
      } else {
        botResponse =
          'Thank you for asking! Every order is inspected by the Thai Department of Agriculture and dispatched directly via daily Bangkok wide-body air cargo. Let me know if you would like pairing suggestions with our jasmine rice or coconut milk!';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'concierge',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  return (
    <>
      {/* Floating Toggle Button - Earthy Khaki Green */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] rounded-full shadow-2xl transition-transform hover:scale-105 flex items-center justify-center border border-[#727B5A]/40 cursor-pointer"
        aria-label="Open Culinary Concierge"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-sm bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header - Deep Khaki */}
          <div className="p-4 bg-[#373E28] text-[#F7F5F0] flex items-center justify-between border-b border-[#4A5335]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4A5335] border border-[#727B5A]/40 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-[#EDF0E8]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#F7F5F0]">Thai Culinary Concierge</h3>
                <span className="text-[10px] text-[#EDF0E8] flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#727B5A] animate-pulse" />
                  Live from Bangkok (GMT+7)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 text-[#EFECE6]/80 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F5F0] text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#4A5335] text-[#F7F5F0] rounded-br-none'
                      : 'bg-[#F3EFE6] border border-[#E2DDD5] text-[#1F241A] rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-[#63685E] font-mono mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Prompt Chips */}
          <div className="px-3 py-2 bg-[#F3EFE6] border-t border-[#E2DDD5] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#1F241A] border border-[#E2DDD5] px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#F7F5F0] border-t border-[#E2DDD5] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Chef Somchai about spices or recipes..."
              className="flex-1 text-xs bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl px-3 py-2 text-[#1F241A] focus:outline-none focus:border-[#4A5335]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] rounded-xl transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
