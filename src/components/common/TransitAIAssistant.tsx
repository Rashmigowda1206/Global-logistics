import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  X,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  User,
  Bot,
  Zap,
  Radio,
  Clock,
  Compass
} from 'lucide-react';
import { useLogisticsFilter } from '../../context/FilterContext';
import { generateLogisticsAiResponse } from '../../services/logisticsAiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: { label: string; url?: string }[];
  suggestedFollowUps?: string[];
}

export const TransitAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, 'up' | 'down'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { shipments, allShipments, kpis } = useLogisticsFilter();

  const initialWelcomeText = `### Hello! How can I help you today?

I am **TransitAI**, your autonomous global logistics operations copilot.

I am actively monitoring **${allShipments.length} global shipments** across **128 worldwide terminals**. Currently tracking **${kpis.delayedCount} delayed orders** with an overall network on-time delivery rate of **${kpis.onTimeRate}%**.

You can ask me anything about our logistics network, including:
• 🇪🇸 **Spain Hubs & Corridors:** *"Tell me about Spain operations"*
• ⚠️ **Delay Root Causes:** *"Why are shipments delayed in Asia?"*
• 📦 **Live Consignment Tracking:** *"Track shipment SO-44321"*
• 🚢 **Shipping Mode Benchmarks:** *"Compare Air vs Sea modes"*
• 🎛️ **Scenario Simulations:** *"How can we reduce delay risk by 40%?"*`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: initialWelcomeText,
      timestamp: 'Just now',
      actions: [
        { label: 'Command Center', url: '/command-center' },
        { label: 'Live Network Feed', url: '/network' },
        { label: 'Launch Simulator', url: '/simulator' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain',
        'Why are shipments delayed?',
        'Track shipment SO-44321',
        'Compare Air vs Ocean'
      ]
    }
  ]);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: `Logistics chat reset. Telemetry streams connected across 128 global hubs. Hello! How can I help you today?`,
        timestamp: 'Just now',
        suggestedFollowUps: [
          'Tell me about Spain',
          'Why are shipments delayed?',
          'Track shipment SO-44321'
        ]
      }
    ]);
  };

  const handleSendMessage = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toTimeString().slice(0, 5) + ' UTC'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const activeData = shipments.length > 0 ? shipments : allShipments;
      const aiResult = generateLogisticsAiResponse(trimmed, activeData, kpis);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.text,
        timestamp: new Date().toTimeString().slice(0, 5) + ' UTC',
        actions: aiResult.actions,
        suggestedFollowUps: aiResult.suggestedFollowUps
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* Floating ChatGPT-Style AI Badge Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 px-4 py-3 rounded-full bg-gradient-to-r from-[#070D1E] via-[#0C1635] to-[#070D1E] border border-cyan-500/50 hover:border-cyan-400 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
        >
          {/* Animated Futuristic AI Logo */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-teal-400 p-[1.5px] shadow-lg shadow-cyan-500/40 group-hover:rotate-12 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-[#050917] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>

          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-xs font-bold text-slate-100 tracking-wide">
                Transit<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                GPT-4o Copilot
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Online • Ready to assist</span>
            </p>
          </div>
        </button>
      )}

      {/* Interactive ChatGPT-Style Modal Container */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#070B19]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 md:inset-16 w-auto h-auto max-w-none z-50'
              : 'w-[92vw] sm:w-[460px] md:w-[500px] h-[640px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-[#040817] border-b border-command-border/40 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              {/* Sleek AI Logo */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-sm">
                <div className="w-full h-full rounded-full bg-[#050917] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-sm font-bold text-slate-100">
                    Transit<span className="text-cyan-400">AI</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Autonomous Logistics Operations Copilot
                </p>
              </div>
            </div>

            {/* Actions: Clear, Expand, Close */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050917]/70">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${
                      isUser
                        ? 'bg-blue-600 text-white font-bold text-xs'
                        : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] relative group shadow-md transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-sans'
                        : 'bg-[#0C142E] text-slate-200 border border-slate-700/60 rounded-tl-none'
                    }`}
                  >
                    {/* Render Content */}
                    {isUser ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    ) : (
                      <MarkdownRenderer content={m.text} />
                    )}

                    {/* Action Quick Links */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {m.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => act.url && navigate(act.url)}
                            className="flex items-center space-x-1 text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions (Copy, Feedback, Timestamp) */}
                    {!isUser && (
                      <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60">
                        <span className="font-mono text-slate-500">{m.timestamp}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(m.id, m.text)}
                            className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
                            title="Copy response"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-mono">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setLikedMap(prev => ({ ...prev, [m.id]: 'up' }))}
                            className={`hover:text-cyan-300 transition-colors ${likedMap[m.id] === 'up' ? 'text-cyan-400' : ''}`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setLikedMap(prev => ({ ...prev, [m.id]: 'down' }))}
                            className={`hover:text-rose-300 transition-colors ${likedMap[m.id] === 'down' ? 'text-rose-400' : ''}`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono p-2 pl-9">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-slate-400 text-[11px]">TransitAI is analyzing live telemetry...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Follow-up Prompts Carousel */}
          {messages.length > 0 && messages[messages.length - 1].suggestedFollowUps && (
            <div className="p-2 px-3 bg-[#060A1A] border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto custom-scrollbar no-scrollbar flex-shrink-0">
              <span className="text-[10px] font-mono text-slate-500 flex items-center flex-shrink-0">
                <Sparkles className="w-3 h-3 mr-1 text-cyan-400" /> Suggestions:
              </span>
              {messages[messages.length - 1].suggestedFollowUps?.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#0B1533] hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-[#040817] border-t border-command-border/40 flex items-center space-x-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask TransitAI about Spain, delay risks, or enter SO-44321..."
              className="flex-1 bg-[#0A1226] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-hud"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
