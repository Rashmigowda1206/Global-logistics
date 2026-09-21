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
  Layers,
  ChevronRight
} from 'lucide-react';
import { useLogisticsFilter } from '../../context/FilterContext';
import { useActions } from '../../context/ActionContext';
import { usePlatform } from '../../context/PlatformContext';
import { generateBankingAiResponse } from '../../services/bankingAiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: { label: string; url?: string; actionId?: string }[];
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
  const { mode } = usePlatform();
  const { allShipments, kpis, updateFilter } = useLogisticsFilter();

  const isBanking = mode === 'banking';

  const initialWelcomeText = isBanking
    ? `### Hello! How can I help you today?

I am your **EuroBank Retention AI Copilot**, powered by the **10,000 customer European banking empirical study** across France, Germany, and Spain.

Current baseline observed churn is **20.37%**, with **€185.6 Million** in liquid capital at risk.

Feel free to ask me any specific question about:
- 🇩🇪 **Regional Risk**: *"Why is Germany churn so high (32.44%)?"*
- 💰 **Deposit Flight**: *"What is the €110.8M capital exposure for high-balance accounts?"*
- 👥 **Demographic Hotspots**: *"Why do customers aged 46–60 churn at 67.33% in Germany?"*
- 📦 **The Product Paradox**: *"Why do 3 products have an 82.7% churn rate?"*
- 🔍 **Customer Dossiers**: *"Look up customer 15634602"* or *"Search Hargrave"*
- 🎛️ **What-If Simulation**: *"How much capital can we protect with a +0.50% interest bonus?"*`
    : `### Hello! How can I help you today?

I am **TransitAI**, your autonomous global logistics operations copilot.

I am monitoring all **${allShipments.length} active shipments** and **128 worldwide terminals**. Currently tracking **${kpis.delayedCount} delayed orders** with an overall on-time delivery SLA of **${kpis.onTimeRate}%**.

Ask me to track any order ID, diagnose route delays, or project alternative transport corridors!`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: initialWelcomeText,
      timestamp: 'Just now',
      actions: isBanking
        ? [
            { label: 'View Germany Risk Radar', url: '/banking/geography' },
            { label: 'Deposit Flight Exposure', url: '/banking/financial-exposure' },
            { label: 'Launch What-If Simulator', url: '/banking/simulator' }
          ]
        : [
            { label: 'View Delayed Shipments', url: '/shipments' },
            { label: 'Open What-If Simulator', url: '/simulator' }
          ],
      suggestedFollowUps: isBanking
        ? [
            'Why is Germany churn so high?',
            'What is the capital at risk for high-value customers?',
            'Explain the product holdings paradox'
          ]
        : [
            'Why are deliveries delayed in Asia?',
            'Track shipment SO-44321',
            'Compare Air vs Sea modes'
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
        text: isBanking
          ? `Conversation cleared. Ready for your next inquiry about European banking churn, customer segmentation, or retention simulations!`
          : `Logistics conversation reset. Telemetry streams active. Ready for new shipment queries!`,
        timestamp: 'Just now',
        suggestedFollowUps: isBanking
          ? [
              'Why is Germany churn so high?',
              'What is the capital at risk for high-value customers?',
              'Explain the product holdings paradox'
            ]
          : [
              'Why are deliveries delayed in Asia?',
              'Track shipment SO-44321'
            ]
      }
    ]);
  };

  const handleSendMessage = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toTimeString().slice(0, 5) + ' UTC'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResult: { text: string; actions?: { label: string; url?: string }[]; suggestedFollowUps?: string[] };

      if (isBanking) {
        aiResult = generateBankingAiResponse(query);
      } else {
        // Logistics fallback logic
        const q = query.toLowerCase();
        if (q.includes('hi') || q.includes('hello')) {
          aiResult = {
            text: `### Hello! How can I help you today?

I'm your **TransitAI** logistics copilot. You can ask me to:
- Track any order (e.g. \`SO-44321\` or \`ORD-45821\`)
- Check regional delay bottlenecks (Malacca Strait, Suez Canal, Rotterdam)
- Compare shipping modes (Air vs. Sea vs. Road vs. Rail)
- Run delay simulation scenarios`,
            actions: [
              { label: 'Command Center', url: '/command-center' },
              { label: 'Live Network', url: '/network' }
            ],
            suggestedFollowUps: ['Track shipment SO-44321', 'Why are deliveries delayed in Asia?']
          };
        } else if (q.includes('so-') || q.includes('ord-')) {
          const match = query.match(/(so-\d+|ord-\d+)/i);
          const orderId = match ? match[1].toUpperCase() : 'SO-44321';
          aiResult = {
            text: `### 📦 Shipment Telemetry Dossier: \`${orderId}\`

| Metric | Status |
| :--- | :--- |
| **Current Status** | 🔴 **DELAYED (+38.5 hrs)** |
| **Origin / Dest** | Shanghai Yangshan ➔ Rotterdam Gateway |
| **Mode / Carrier** | Ocean Container • Maersk Triple-E |
| **Bottleneck** | Malacca Strait Monsoon Congestion + Rotterdam Berth Queue (4.2 days) |
| **Cargo SLA** | Express SLA Breached • High Customer Impact |`,
            actions: [
              { label: 'Open Shipment Explorer', url: '/shipments' },
              { label: 'Simulate Fast-Track Air', url: '/simulator' }
            ],
            suggestedFollowUps: ['What if we move Sea shipments to Air?', 'Which port has the highest delay?']
          };
        } else {
          aiResult = {
            text: `### Telemetry Analysis: *"${query}"*

Network operations report **128 active global terminals**. Currently tracking **${kpis.delayedCount} delayed shipments** with **${kpis.onTimeRate}% SLA compliance**.

Would you like to inspect high-risk shipments, examine port bottlenecks, or run a freight corridor simulation?`,
            actions: [
              { label: 'Delay Intelligence', url: '/delay-intelligence' },
              { label: 'Launch Simulator', url: '/simulator' }
            ],
            suggestedFollowUps: ['Which shipping mode has highest delay?', 'Track shipment SO-44321']
          };
        }
      }

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
    }, 500);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* Floating ChatGPT-Style AI Badge Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 px-4 py-3 rounded-full bg-gradient-to-r from-slate-900 via-[#0B1533] to-slate-900 border border-cyan-500/50 hover:border-cyan-400 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
        >
          {/* Animated AI Glowing Logo */}
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/40 group-hover:rotate-12 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-[#070B19] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>

          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-xs font-bold tracking-wide text-slate-100">
                {isBanking ? 'EuroBank AI' : 'TransitAI'}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                GPT-4o
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {isBanking ? 'Retail Retention Copilot' : 'Logistics Intelligence'}
            </p>
          </div>
        </button>
      )}

      {/* Expanded ChatGPT-Like Modern Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#080D21]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'fixed inset-4 md:inset-10 z-50'
              : 'w-[94vw] sm:w-[480px] md:w-[520px] h-[640px]'
          }`}
        >
          {/* ChatGPT-Style Sleek Header */}
          <div className="p-3.5 px-4 bg-gradient-to-r from-[#0B1533] via-[#091129] to-[#0D1B3E] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              {/* Logo Badge */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 p-[1.5px] shadow-hud">
                <div className="w-full h-full rounded-[10px] bg-[#070B19] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-100 tracking-tight">
                    {isBanking ? 'EuroBank Retention AI' : 'TransitAI Dispatcher'}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isBanking ? '10,000 Retail Accounts • Churn Intelligence' : 'Global Supply Chain Operations'}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] relative group shadow-md transition-all ${
                      isUser
                        ? 'bg-blue-600/90 text-white rounded-tr-none font-sans'
                        : 'bg-[#0D1530] text-slate-200 border border-slate-700/60 rounded-tl-none'
                    }`}
                  >
                    {/* Render Content */}
                    {isUser ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    ) : (
                      <MarkdownRenderer content={m.text} />
                    )}

                    {/* Action Buttons if provided */}
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

                    {/* Footer Actions (Copy, Like, Timestamp) */}
                    {!isUser && (
                      <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60">
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
                <span className="text-slate-400 text-[11px]">Synthesizing empirical dataset...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Follow-up Prompts Carousel */}
          {messages.length > 0 && messages[messages.length - 1].suggestedFollowUps && (
            <div className="p-2 px-3 bg-[#060A1A] border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto custom-scrollbar no-scrollbar flex-shrink-0">
              <span className="text-[10px] font-mono text-slate-500 flex items-center flex-shrink-0">
                <Sparkles className="w-3 h-3 mr-1 text-cyan-400" /> Suggested:
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

          {/* ChatGPT-Style Modern Rounded Input Bar */}
          <div className="p-3 bg-[#070B1A] border-t border-slate-800 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center space-x-2 bg-[#0C1530] border border-slate-700/80 focus-within:border-cyan-500 rounded-xl px-3 py-1.5 shadow-inner transition-colors"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isBanking
                    ? "Ask about churn, Germany risk, high-value deposits, or customer ID..."
                    : "Ask about port congestion, delays, or shipment SO-44321..."
                }
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none font-sans"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 text-slate-950 transition-all font-bold shadow-sm"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1 mt-1.5">
              <span>Press <strong>Enter</strong> to send</span>
              <span>10,000 empirical accounts loaded</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
