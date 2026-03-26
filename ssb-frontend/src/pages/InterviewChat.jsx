import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPIQ } from '../utils/piqStorage.js';
import { api } from '../utils/api.js';

/**
 * Returns a delay (ms) proportional to the response length,
 * simulating the IO "thinking" before answering.
 *   short  (<80 chars)  → 1000–1800ms
 *   medium (<200 chars) → 1800–2600ms
 *   long   (≥200 chars) → 2600–3600ms
 */
function thinkingDelay(text) {
  const len = text?.length ?? 0;
  if (len < 80)  return 1000 + Math.random() * 800;
  if (len < 200) return 1800 + Math.random() * 800;
  return 2600 + Math.random() * 1000;
}

function InterviewChat() {
  const navigate = useNavigate();
  const [piq, setPiq]           = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  // ── Auto-scroll whenever messages or loading state changes ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Load PIQ on mount; redirect if missing ──
  useEffect(() => {
    const savedPiq = getPIQ();
    if (!savedPiq) {
      navigate('/interview/start');
      return;
    }
    setPiq(savedPiq);
    fireFirstMessage(savedPiq);
  }, []);

  // ── Fires an empty userMessage so the IO produces the opening question ──
  const fireFirstMessage = async (piqData) => {
    setIsLoading(true);
    try {
      const res = await fetch(api.interviewChat(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piq: piqData, messages: [], userMessage: '' }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      // Apply a small thinking delay even for the first message
      await new Promise((r) => setTimeout(r, thinkingDelay(data.reply)));
      setMessages([{ role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([{
        role: 'assistant',
        content: 'Good morning. I am the Interviewing Officer. Please introduce yourself.',
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── Send a user message ──
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading || !piq) return;

    const userMsg = { role: 'user', content: text };
    // Snapshot history *before* appending user msg (service appends it server-side)
    const historyBeforeSend = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(api.interviewChat(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          piq,
          messages: historyBeforeSend,
          userMessage: text,
        }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      // Dynamic delay before revealing the reply — feels like real thinking
      await new Promise((r) => setTimeout(r, thinkingDelay(data.reply)));
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Unable to get response. Please try again.', isError: true },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends; Shift+Enter inserts a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page">

      {/* ── Header ── */}
      <div className="chat-header">
        <div className="chat-header-left">
          <button
            className="btn btn-ghost chat-back-btn"
            onClick={() => navigate('/interview/start')}
          >
            ←
          </button>
        </div>
        <div className="chat-header-center">
          <div className="chat-header-title">SSB Interview Simulation</div>
          <div className="chat-header-sub">
            {isLoading ? 'Interviewing Officer is thinking…' : 'Interviewing Officer'}
          </div>
        </div>
        <div className="chat-header-right" />
      </div>

      {/* ── Chat Area ── */}
      <div className="chat-messages">

        {/* Typing indicator — initial load (no messages yet) */}
        {messages.length === 0 && isLoading && (
          <div className="chat-bubble-row chat-bubble-row--io">
            <div className="chat-avatar">IO</div>
            <div className="chat-bubble chat-bubble--io chat-thinking">
              <span className="chat-dot" />
              <span className="chat-dot" />
              <span className="chat-dot" />
            </div>
          </div>
        )}

        {/* All messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble-row ${msg.role === 'user' ? 'chat-bubble-row--user' : 'chat-bubble-row--io'}`}
          >
            {msg.role === 'assistant' && <div className="chat-avatar">IO</div>}
            <div
              className={[
                'chat-bubble',
                msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--io',
                msg.isError ? 'chat-bubble--error' : '',
              ].join(' ')}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator — waiting for reply after user message */}
        {isLoading && messages.length > 0 && (
          <div className="chat-bubble-row chat-bubble-row--io">
            <div className="chat-avatar">IO</div>
            <div className="chat-bubble chat-bubble--io chat-thinking">
              <span className="chat-dot" />
              <span className="chat-dot" />
              <span className="chat-dot" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="chat-input-bar">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder={isLoading ? 'Interviewing Officer is thinking…' : 'Type your response… (Enter to send, Shift+Enter for new line)'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading || !piq}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading || !piq}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default InterviewChat;
