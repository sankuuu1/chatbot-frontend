import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Mic, Camera, ChevronRight, Info, Settings, Home, MessageSquare, ArrowLeft, Volume2 } from 'lucide-react';
import RichResponseCard from '../components/RichResponseCard';

const ChatInterface = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state?.category || 'general';

    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [viewState, setViewState] = useState('IDLE'); // IDLE, LISTENING, THINKING, RESPONSE
    const [richData, setRichData] = useState(null);
    const [recognitionRef, setRecognitionRef] = useState(null);
    const [transcriptAccumulated, setTranscriptAccumulated] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, viewState, richData]);

    // Handle autoListen or query from navigation state
    useEffect(() => {
        if (location.state?.autoListen) {
            startListening();
        } else if (location.state?.query) {
            handleSend(location.state.query);
        }
    }, [location.state]);

    const handleSend = async (text = input) => {
        if (!text || !text.trim()) return;

        const userText = text.trim();
        const userMsg = { sender: 'user', text: userText };
        setHistory(prev => [...prev, userMsg]);
        setInput('');
        setViewState('THINKING');
        setRichData(null);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, category: category })
            });
            const data = await response.json();

            const aiMsg = { sender: 'ai', text: data.response };
            setHistory(prev => [...prev, aiMsg]);
            if (data.rich_data) {
                setRichData(data.rich_data);
            }
        } catch (error) {
            console.error(error);
            setHistory(prev => [...prev, { sender: 'ai', text: `⚠️ एरर: ${error.message}. (Backend not connected?)` }]);
        } finally {
            setViewState('IDLE');
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("तुमच्या ब्राऊजरमध्ये आवाजाची सुविधा उपलब्ध नाही. कृपया क्रोम ब्राऊजर वापरा.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'mr-IN'; // Marathi
        recognition.continuous = true;
        recognition.interimResults = true;

        setViewState('LISTENING');
        setTranscriptAccumulated('');
        setRecognitionRef(recognition);

        recognition.onstart = () => {
            console.log("Voice recognition started...");
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            const currentText = finalTranscript || interimTranscript;
            if (currentText) {
                setTranscriptAccumulated(currentText);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
        };

        recognition.onend = () => {
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Error starting recognition:", e);
        }
    };

    const stopListening = () => {
        if (recognitionRef) {
            try {
                recognitionRef.stop();
            } catch (e) {
                console.error(e);
            }
            setRecognitionRef(null);
        }
        setViewState('IDLE');
        if (transcriptAccumulated && transcriptAccumulated.trim()) {
            handleSend(transcriptAccumulated.trim());
        }
    };

    return (
        <div style={{
            backgroundColor: '#FFFDF9',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
        }}>

            {/* --- ANIMATED VOICE LISTENING OVERLAY --- */}
            {viewState === 'LISTENING' && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'linear-gradient(180deg, #FFF8F0 0%, #FFFDF9 100%)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '40px 20px 60px'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <span style={{
                            background: '#FFE0B2',
                            color: '#E65100',
                            fontSize: '12px',
                            fontWeight: '800',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            display: 'inline-block',
                            marginBottom: '12px'
                        }}>
                            🎙️ मायक्रोफोन सुरू आहे
                        </span>
                        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#111827', margin: 0 }}>
                            बंधू ऐकत आहेत...
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px', fontWeight: '500' }}>
                            तुमचा प्रश्न स्पष्टपणे बोला
                        </p>
                    </div>

                    {/* Center Animated Mic Pulse */}
                    <div style={{
                        position: 'relative',
                        width: '160px',
                        height: '160px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '20px 0'
                    }}>
                        <div className="voice-wave-ring voice-wave-1"></div>
                        <div className="voice-wave-ring voice-wave-2"></div>
                        <div className="voice-wave-ring voice-wave-3"></div>

                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                            border: '5px solid white',
                            boxShadow: '0 12px 30px rgba(230,81,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            zIndex: 10
                        }}>
                            <Mic size={48} strokeWidth={2.2} />
                        </div>
                    </div>

                    {/* Real-time Equalizer Waveform & Live Transcript */}
                    <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
                        <div style={{
                            display: 'flex',
                            gap: '6px',
                            height: '40px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} style={{
                                    width: '6px',
                                    background: '#E65100',
                                    borderRadius: '3px',
                                    animation: `wave 1s infinite ${i * 0.12}s`
                                }}></div>
                            ))}
                        </div>

                        {/* Transcript Preview Box */}
                        <div style={{
                            background: 'white',
                            border: '1px solid #FFE0B2',
                            borderRadius: '18px',
                            padding: '16px 20px',
                            minHeight: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(230,81,0,0.06)'
                        }}>
                            <p style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: transcriptAccumulated ? '#111827' : '#9CA3AF',
                                margin: 0,
                                lineHeight: '1.4'
                            }}>
                                {transcriptAccumulated || "बोलत राहा..."}
                            </p>
                        </div>
                    </div>

                    {/* Done Speaking Action Button */}
                    <button
                        onClick={stopListening}
                        style={{
                            background: '#E65100',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '16px 48px',
                            fontSize: '17px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(230,81,0,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <span>बोलणे पूर्ण झाले (Done)</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}


            {/* --- MAIN CHAT HEADER --- */}
            <div style={{
                padding: '15px 20px',
                background: '#E65100',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(230,81,0,0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/home')}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', padding: '2px', overflow: 'hidden' }}>
                        <img src="https://ui-avatars.com/api/?name=Bandhu&background=random" alt="Bandhu Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>बंधू (Bandhu) 🙏</h3>
                        <p style={{ fontSize: '11px', opacity: 0.9, margin: 0 }}>
                            {category === 'education' ? 'वैयक्तिक शिक्षक' :
                                category === 'farming' ? 'कृषी मित्र' :
                                    category === 'health' ? 'आरोग्य सल्लागार' : 'नेहमी सोबत'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/home')}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                    <X size={18} />
                </button>
            </div>


            {/* --- CONTENT / CHAT STREAM AREA --- */}
            <div style={{
                padding: '20px',
                paddingBottom: '110px',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Empty State Welcome */}
                {history.length === 0 && !richData && (
                    <div style={{ textAlign: 'center', marginTop: '60px', color: '#6B7280' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: '#FFF3E0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <MessageSquare size={32} color="#E65100" />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                            नमस्कार! मी बंधू.
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '280px', margin: '0 auto', lineHeight: '1.4' }}>
                            खालील प्रश्न निवडा किंवा मायक्रोफोन बटण दाबून बोला.
                        </p>
                    </div>
                )}

                {/* Chat History Stream */}
                {history.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? '#FFE0B2' : 'white',
                        color: '#111827',
                        padding: '12px 18px',
                        borderRadius: '18px',
                        borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                        borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px',
                        marginBottom: '12px',
                        maxWidth: '85%',
                        marginLeft: msg.sender === 'user' ? 'auto' : 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        fontWeight: '500'
                    }}>
                        {msg.text}
                    </div>
                ))}

                {/* IN-CHAT WHATSAPP-STYLE TYPING INDICATOR BUBBLE */}
                {viewState === 'THINKING' && (
                    <div style={{
                        alignSelf: 'flex-start',
                        background: 'white',
                        padding: '12px 18px',
                        borderRadius: '18px',
                        borderBottomLeftRadius: '4px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                            बंधू टाईप करत आहेत
                        </span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}

                {/* Rich Response Component Display */}
                {richData && (
                    <div className="ani-fade-in" style={{ marginBottom: '16px' }}>
                        <RichResponseCard data={richData} />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>


            {/* --- BOTTOM CHAT INPUT BAR & NAVIGATION --- */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '420px',
                background: '#FFFDF9',
                borderTop: '1px solid #F3F4F6',
                zIndex: 30
            }}>
                {/* Suggestion Chips */}
                <div style={{ display: 'flex', gap: '8px', padding: '10px 16px 6px', overflowX: 'auto' }}>
                    <SuggestionPill text="आज पाऊस पडेल का?" onClick={() => handleSend("आज पाऊस पडेल का?")} />
                    <SuggestionPill text="कापसाचा बाजारभाव?" onClick={() => handleSend("कापसाचा बाजारभाव?")} />
                    <SuggestionPill text="सरकारी योजना?" onClick={() => handleSend("सरकारी योजना?")} />
                </div>

                {/* Input Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px 10px' }}>
                    {/* Voice Mic Button */}
                    <button
                        onClick={startListening}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: '#FFF3E0',
                            border: '1px solid #FFE0B2',
                            color: '#E65100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: 'pointer'
                        }}
                    >
                        <Mic size={22} strokeWidth={2.2} />
                    </button>

                    {/* Text Input Box */}
                    <div style={{
                        flex: 1,
                        background: 'white',
                        borderRadius: '24px',
                        padding: '10px 18px',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="इथे प्रश्न लिहा..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
                            }}
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                fontSize: '15px',
                                fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
                            }}
                            disabled={viewState === 'THINKING'}
                        />
                    </div>

                    {/* Send Button */}
                    {input.trim() && (
                        <button
                            onClick={() => handleSend()}
                            disabled={viewState === 'THINKING'}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: '#E65100',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                boxShadow: '0 3px 10px rgba(230,81,0,0.3)'
                            }}
                        >
                            <ChevronRight size={22} />
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

const SuggestionPill = ({ text, onClick }) => (
    <button onClick={onClick} style={{
        background: 'white',
        border: '1px solid #E5E7EB',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#4B5563',
        whiteSpace: 'nowrap',
        cursor: 'pointer'
    }}>
        {text}
    </button>
);

export default ChatInterface;
