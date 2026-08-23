import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Mic, Camera, ChevronRight, Info, ChevronDown } from 'lucide-react';
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
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, viewState, richData]);

    // Initial Greeting based on Category
    useEffect(() => {
        let greeting = "नमस्कार! मी बंधू, तुम्हाला कशी मदत करू शकतो?";
        if (category === 'education') greeting = "नमस्कार! शिक्षणाबद्दल काय जाणून घ्यायचे आहे?";
        if (category === 'farming') greeting = "नमस्कार! शेतीविषयक काय समस्या आहे?";

        // Only add if history is empty
        if (history.length === 0) {
            // We can uncomment this if we want an initial AI message
            // setHistory([{sender: 'ai', text: greeting}]);
        }
    }, [category]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = { sender: 'user', text: text };
        setHistory(prev => [...prev, userMsg]);
        setInput('');
        setViewState('THINKING');
        setRichData(null); // Clear previous rich data

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, category: category })
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

    const [recognitionRef, setRecognitionRef] = useState(null);
    const [transcriptAccumulated, setTranscriptAccumulated] = useState('');

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support voice recognition. Try Chrome.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'mr-IN'; // Marathi
        recognition.continuous = true; // Enable continuous listening
        recognition.interimResults = true; // Show interim results if needed

        setViewState('LISTENING');
        setTranscriptAccumulated('');
        setRecognitionRef(recognition);

        recognition.onstart = () => {
            console.log("Voice recognition started...");
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscriptAccumulated(prev => prev + ' ' + finalTranscript);
                console.log("Accumulated:", finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
        };

        recognition.onend = () => {
        };

        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef) {
            recognitionRef.stop();
            setRecognitionRef(null);
        }
        setViewState('IDLE');
        if (transcriptAccumulated.trim()) {
            handleSend(transcriptAccumulated.trim());
        }
    };

    return (
        <div style={{ backgroundColor: '#FFFBF2', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

            {/* --- LISTENING OVERLAY --- */}
            {viewState === 'LISTENING' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,251,242,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e67e22', marginBottom: '20px' }}>
                        "{category === 'education' ? 'त्रिकोणाचे क्षेत्रफळ कसे...' : 'बोलत रहा, आम्ही ऐकत आहोत'}"
                    </p>
                    {/* Animated Waveform Placeholder */}
                    <div style={{ display: 'flex', gap: '5px', height: '60px', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ width: '8px', background: '#e67e22', borderRadius: '4px', animation: `wave 1s infinite ${i * 0.1}s` }} className="wave-bar"></div>
                        ))}
                    </div>
                    <div style={{ padding: '0 20px', textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                        {transcriptAccumulated || "ऐकत आहे..."}
                    </div>
                    <button onClick={stopListening} style={{ marginTop: '20px', background: '#e67e22', color: 'white', padding: '15px 40px', borderRadius: '30px', border: 'none', fontSize: '18px', cursor: 'pointer' }}>बोलणे पूर्ण झाले (Done)</button>
                </div>
            )}


            {/* --- MAIN HEADER --- */}
            <div style={{ padding: '15px', background: '#e67e22', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#ddd', overflow: 'hidden' }}>
                        <img src="https://ui-avatars.com/api/?name=Bandhu&background=random" alt="Bandhu Profile" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                        <p style={{ fontSize: '10px', opacity: 0.9 }}>
                            {category === 'education' ? 'तुमचे वैयक्तिक शिक्षक' :
                                category === 'farming' ? 'तुमचा कृषी मित्र' :
                                    category === 'health' ? 'तुमचा आरोग्य सल्लागार' : 'तुमचा सहाय्यक'}
                        </p>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>बंधू 🙏</h3>
                        {category !== 'general' && (
                            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px' }}>
                                {category === 'education' ? 'शिक्षण' :
                                    category === 'farming' ? 'शेती' :
                                        category === 'health' ? 'आरोग्य' :
                                            category === 'help' ? 'मदत' : ''}
                            </span>
                        )}
                    </div>
                </div>
                <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <X size={20} />
                </button>
            </div>

            {/* --- CONTENT AREA --- */}
            <div style={{ padding: '20px', paddingBottom: '100px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                {/* Chat History */}
                {history.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? '#FFE0B2' : 'white',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        marginBottom: '10px',
                        maxWidth: '90%',
                        marginLeft: msg.sender === 'user' ? 'auto' : 0,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        fontSize: '15px',
                        lineHeight: '1.5'
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
                        borderRadius: '16px',
                        borderBottomLeftRadius: '4px',
                        marginBottom: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                            बंधू टाईप करत आहेत
                        </span>
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}

                {/* RICH CARD DISPLAY */}
                {richData && (
                    <div className="ani-fade-in">
                        <RichResponseCard data={richData} />
                    </div>
                )}

                {/* Initial Suggestion for empty state */}
                {history.length === 0 && !richData && (
                    <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                        <p>विचारा, मी ऐकत आहे...</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* --- BOTTOM INPUT --- */}
            <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '420px', background: '#FFFBF2', padding: '15px', paddingBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                    <SuggestionPill text="औषधांची नावे?" onClick={() => handleSend("औषधांची नावे?")} />
                    <SuggestionPill text="हवामान अंदाज?" onClick={() => handleSend("हवामान अंदाज?")} />
                    <SuggestionPill text="कापसाचा भाव?" onClick={() => handleSend("कापसाचा भाव?")} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={startListening} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', border: '1px solid #e67e22', color: '#e67e22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Mic size={24} />
                    </button>
                    {!input && <button style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', border: 'none', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Camera size={24} />
                    </button>}

                    <div style={{ flex: 1, background: 'white', borderRadius: '25px', padding: '12px 20px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="इथे लिहा..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
                            }}
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px' }}
                            disabled={viewState === 'THINKING'}
                        />
                    </div>
                    {input && (
                        <button
                            onClick={() => handleSend()}
                            disabled={viewState === 'THINKING'}
                            style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#e67e22', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, opacity: viewState === 'THINKING' ? 0.7 : 1 }}>
                            {viewState === 'THINKING' ? <div style={{ width: '20px', height: '20px', border: '2px solid white', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div> : <ChevronRight size={24} />}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

const SuggestionPill = ({ text, onClick }) => (
    <button onClick={onClick} style={{ background: 'white', border: '1px solid #eee', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#444', whiteSpace: 'nowrap', cursor: 'pointer' }}>
        {text}
    </button>
);

export default ChatInterface;
