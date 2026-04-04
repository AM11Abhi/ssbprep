import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPIQ } from '../utils/piqStorage.js';
import { getInterviewMode } from '../utils/interviewMode.js';
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

/** Returns true if the browser's Web Speech API is available. */
function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function InterviewChat() {
  const navigate = useNavigate();

  // ── Core state ──
  const [piq, setPiq]                     = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);

  // ── Voice state ──
  const [isVoiceMode]    = useState(() => getInterviewMode() === 'voice');
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [voiceSupported] = useState(isSpeechSupported);
  const [ttsSupported]   = useState(() => !!window.speechSynthesis);
  const recognitionRef   = useRef(null);
  const silenceTimerRef  = useRef(null);  // resets on each speech result
  const speakTimeoutRef  = useRef(null);  // tracks TTS delay

  // ── Refs ──
  const chatEndRef       = useRef(null);
  const inputRef         = useRef(null);
  const questionCountRef = useRef(0);
  const hasFetchedRef    = useRef(false);
  const feedbackSnapshotRef = useRef([]);

  // ── Auto-scroll ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isInterviewEnded]);

  // ── Load PIQ on mount; redirect if missing ──
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

  // ── Cleanup recognition AND speech on unmount ──
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      clearTimeout(speakTimeoutRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // ── Pre-load TTS voices ──
  useEffect(() => {
    if (ttsSupported) {
      // Trigger voice load
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, [ttsSupported]);

  // ── Text-to-Speech ──
  // Only fires in voice mode. Cancels any ongoing speech first.
  const speakText = (text) => {
    if (!isVoiceMode || !ttsSupported || !text) return;
    
    window.speechSynthesis.cancel();
    clearTimeout(speakTimeoutRef.current);

    // Small delay makes the IO feel more natural
    speakTimeoutRef.current = setTimeout(() => {
      window.speechSynthesis.cancel(); // safety cancel
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => 
        v.lang.includes("en") && v.name.toLowerCase().includes("male")
      ) || voices.find(v => v.lang.includes("en"));
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Fallback/override language spec
      utterance.lang  = 'en-IN';
      utterance.rate  = 1.15;
      utterance.pitch = 0.95;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }, 250);
  };

  // ── Speech recognition setup ──
  const startListening = () => {
    if (!voiceSupported || isListening || isLoading || isInterviewEnded) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // continuous keeps the session alive through natural pauses;
    // interimResults lets us reset the silence timer on partial speech.
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = 'en-IN';

    recognition.onresult = (event) => {
      // Collect only the new final results from this event batch
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        // Append to existing text instead of replacing it
        setInput((prev) => (prev ? prev + ' ' + finalTranscript : finalTranscript));
      }

      // Reset the silence timer on any result (final or interim)
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 2500);
    };

    recognition.onend = () => {
      clearTimeout(silenceTimerRef.current);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      // 'no-speech' is normal after silence timeout — ignore it
      if (event.error !== 'no-speech') {
        console.warn('[Speech] error:', event.error);
      }
      clearTimeout(silenceTimerRef.current);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ── Appends an assistant message, increments question count ──
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

  // ── Fires the first IO question on mount ──
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
      speakText(data.reply);
    } catch {
      const fallback = 'Good morning. I am the Interviewing Officer. Please introduce yourself.';
      appendAssistantMessage(fallback);
      speakText(fallback);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── End interview: append closing, lock input, speak closing ──
  const endInterview = (conversationSnapshot) => {
    feedbackSnapshotRef.current = conversationSnapshot;
    setIsInterviewEnded(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: CLOSING_MESSAGE }]);
    speakText(CLOSING_MESSAGE);
  };

  // ── View Preparation Advice button ──
  const handleViewFeedback = async () => {
    setIsFetchingFeedback(true);
    try {
      const res = await fetch(api.interviewFeedback(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piq, conversation: feedbackSnapshotRef.current }),
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
  };

  // ── Send a user message ──
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading || !piq || isInterviewEnded) return;

    // Stop any ongoing TTS when user sends — avoids overlap
    if (isVoiceMode && ttsSupported) {
      clearTimeout(speakTimeoutRef.current);
      window.speechSynthesis.cancel();
    }

    const historyBeforeSend = [...messages];
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    // Final turn: skip LLM, show closing message directly
    if (questionCountRef.current >= MAX_QUESTIONS - 1) {
      endInterview([...historyBeforeSend, { role: 'user', content: text }]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(api.interviewChat(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piq, messages: historyBeforeSend, userMessage: text }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      await new Promise((r) => setTimeout(r, thinkingDelay(data.reply)));
      appendAssistantMessage(data.reply);
      speakText(data.reply);   // speak IO response in voice mode
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

  // Auto-grow textarea — resets then expands to content height, CSS caps at max-height
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  // Also auto-grow when voice input sets text via state update
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [input]);

  const inputDisabled = isLoading || !piq || isInterviewEnded;

  // Derive header mode badge
  const modeBadge = isVoiceMode ? '🎙️ Voice' : '💬 Chat';

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
              : isSpeaking
              ? '🔊 Speaking…'
              : isListening
              ? '🔴 Listening…'
              : isLoading
              ? 'Interviewing Officer is thinking…'
              : `Interviewing Officer · Q ${questionCount}/${MAX_QUESTIONS} · ${modeBadge}`}
          </div>
        </div>
        <div className="chat-header-right" />
      </div>

      {/* ── Voice unsupported banner (voice mode, bad browser) ── */}
      {isVoiceMode && !voiceSupported && (
        <div className="voice-unsupported-banner">
          ⚠️ Voice mode is not supported in your browser. Please use Chrome or Edge, or switch to Chat Mode.
        </div>
      )}

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
            {msg.role === 'assistant' && (
              <div className={`chat-avatar ${isSpeaking && isVoiceMode ? 'chat-avatar--speaking' : ''}`}>
                IO
              </div>
            )}
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

        {/* Typing indicator — waiting for IO reply */}
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

        {/* End-of-interview block */}
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
            isInterviewEnded  ? 'Interview has ended' :
            isListening       ? 'Listening… speak now' :
            isLoading         ? 'Interviewing Officer is thinking…' :
            isVoiceMode       ? 'Tap 🎙️ to speak, or type here…' :
                                'Type your response… (Enter to send, Shift+Enter for new line)'
          }
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={inputDisabled}  /* listening keeps textarea editable so voice text appears */
        />

        {/* Mic button — only in voice mode */}
        {isVoiceMode && voiceSupported && (
          <button
            className={`mic-btn ${isListening ? 'mic-btn--listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={inputDisabled}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? '⏹' : '🎙️'}
          </button>
        )}

        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || inputDisabled || isListening}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default InterviewChat;
