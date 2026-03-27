import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPIQ } from '../utils/piqStorage.js';
import { api } from '../utils/api.js';

const MAX_QUESTIONS = 20;

const CLOSING_MESSAGE =
  'Alright, that will be all for today. It was good speaking with you. Thank you for your time — you may leave now.';

/**
 * Dynamic thinking delay based on response length.
 *   short  (<80 chars)  → 1.0–1.8s
 *   medium (<200 chars) → 1.8–2.6s
 *   long   (≥200 chars) → 2.6–3.6s
 */
function thinkingDelay(text) {
  const len = text?.length ?? 0;
  if (len < 80)  return 1000 + Math.random() * 800;
  if (len < 200) return 1800 + Math.random() * 800;
  return 2600 + Math.random() * 1000;
}

function InterviewChat() {
  const navigate = useNavigate();
  const [piq, setPiq]                     = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [questionCount, setQuestionCount] = useState(0); 
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);

  const chatEndRef       = useRef(null);
  const inputRef         = useRef(null);
  // Ref keeps the count in sync for immediate reads (avoids stale closure)
  const questionCountRef = useRef(0); 
  // Guards against React Strict Mode double-invoking the mount effect
  const hasFetchedRef    = useRef(false);
  // Snapshot of the conversation to send to feedback API
  const feedbackSnapshotRef = useRef([]);

  // ── Auto-scroll on any state change ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isInterviewEnded]);

  // ── Load PIQ on mount; redirect to start if missing ──
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const savedPiq = getPIQ();
    if (!savedPiq) {
      navigate('/interview/start');
      return;
    }
    setPiq(savedPiq);
    fireFirstMessage(savedPiq);
  }, []);

  // ── Appends an assistant message and increments question count ──
  // Returns the NEW count so callers can check the limit immediately.
  const appendAssistantMessage = (content, isError = false) => {
    setMessages((prev) => [...prev, { role: 'assistant', content, isError }]);
    if (!isError) {
      questionCountRef.current += 1;
      setQuestionCount(questionCountRef.current);
      return questionCountRef.current;
    }
    return questionCountRef.current;
  };

  // ── Fires empty userMessage so IO produces opening question ──
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
      await new Promise((r) => setTimeout(r, thinkingDelay(data.reply)));
      appendAssistantMessage(data.reply);
    } catch {
      appendAssistantMessage(
        'Good morning. I am the Interviewing Officer. Please introduce yourself.',
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── End the interview: append ONLY the closing message, lock input ──
  // Does NOT call backend, does NOT navigate automatically.
  const endInterview = (conversationSnapshot) => {
    feedbackSnapshotRef.current = conversationSnapshot;
    setIsInterviewEnded(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: CLOSING_MESSAGE }]);
  };

  // ── "View Preparation Advice" button handler ──
  // Calls /interview/feedback on demand, then navigates.
  const handleViewFeedback = async () => {
    setIsFetchingFeedback(true);
    try {
      const res = await fetch(api.interviewFeedback(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          piq,
          conversation: feedbackSnapshotRef.current,
        }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      navigate('/interview/complete', { state: { feedback: data.advice } });
    } catch {
      navigate('/interview/complete', {
        state: {
          feedback:
            '**Topics Covered**\nThe interview covered various aspects of your background and experience.\n\n**Areas to Reflect On**\nWe were unable to generate detailed feedback at this time.\n\n**Preparation Suggestions**\nReview your PIQ answers, practice structured responses, and prepare specific examples for each topic.',
        },
      });
    }
    // isFetchingFeedback stays true — we navigate away anyway
  };

  // ── Send a user message ──
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading || !piq || isInterviewEnded) return;

    const historyBeforeSend = [...messages];
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    // ── FINAL TURN CHECK ──
    // If this is the last allowed user message, skip the LLM call entirely.
    // Show the closing message directly — no extra AI question generated.
    if (questionCountRef.current >= MAX_QUESTIONS - 1) {
      const snapshot = [
        ...historyBeforeSend,
        { role: 'user', content: text },
      ];
      endInterview(snapshot);
      return;
    }

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

      await new Promise((r) => setTimeout(r, thinkingDelay(data.reply)));
      appendAssistantMessage(data.reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Unable to get response. Please try again.', isError: true },
      ]);
    } finally {
      setIsLoading(false);
      if (!isInterviewEnded) inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const inputDisabled = isLoading || !piq || isInterviewEnded;

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
            {isInterviewEnded
              ? 'Interview Complete'
              : isLoading
              ? 'Interviewing Officer is thinking…'
              : `Interviewing Officer · Q ${questionCount}/${MAX_QUESTIONS}`}
          </div>
        </div>
        <div className="chat-header-right" />
      </div>

      {/* ── Chat Area ── */}
      <div className="chat-messages">

        {/* Typing indicator — initial load */}
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

        {/* Typing indicator — waiting for reply */}
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

        {/* End-of-interview block — divider + action button */}
        {isInterviewEnded && (
          <div className="chat-end-block">
            <div className="chat-end-notice">Interview session ended</div>
            <button
              className="btn btn-primary chat-feedback-btn"
              onClick={handleViewFeedback}
              disabled={isFetchingFeedback}
            >
              {isFetchingFeedback ? 'Generating advice…' : 'View Preparation Advice →'}
            </button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="chat-input-bar">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder={
            isInterviewEnded
              ? 'Interview has ended'
              : isLoading
              ? 'Interviewing Officer is thinking…'
              : 'Type your response… (Enter to send, Shift+Enter for new line)'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={inputDisabled}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || inputDisabled}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default InterviewChat;
