import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Mic, ChevronRight, MessageSquare, ArrowLeft, Square, RefreshCw, Volume2, VolumeX, Copy, Check, Share2 } from 'lucide-react';
import RichResponseCard from '../components/RichResponseCard';
import { fetchChatResponse, transcribeAudioBlob } from '../services/api';
import { speakIndicText, stopSpeech } from '../services/ttsService';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { saveChatTurnToFirestore, logCustomEvent } from '../services/firebase';

const ChatInterface = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state?.category || 'general';
    const { language, t } = useChat();
    const { user } = useAuth();

    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [viewState, setViewState] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, THINKING
    const [richData, setRichData] = useState(null);
    const [transcriptAccumulated, setTranscriptAccumulated] = useState('');
    const [audioVolume, setAudioVolume] = useState(0); // 0 to 100
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const messagesEndRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const recognitionRef = useRef(null);
    const audioChunksRef = useRef([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, viewState, richData]);

    useEffect(() => {
        if (location.state?.autoListen) {
            startListening();
        } else if (location.state?.query) {
            handleSend(location.state.query);
        }
        return () => {
            cleanupAudio();
        };
    }, [location.state]);

    const cleanupAudio = () => {
        stopSpeech();
        setSpeakingMsgIndex(null);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) {}
            recognitionRef.current = null;
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
            audioStreamRef.current = null;
        }
        if (audioContextRef.current) {
            try { audioContextRef.current.close(); } catch (e) {}
            audioContextRef.current = null;
        }
        setAudioVolume(0);
    };

    const handleToggleSpeak = (idx, text) => {
        if (speakingMsgIndex === idx) {
            stopSpeech();
            setSpeakingMsgIndex(null);
        } else {
            setSpeakingMsgIndex(idx);
            speakIndicText({
                text,
                language,
                onStart: () => setSpeakingMsgIndex(idx),
                onEnd: () => setSpeakingMsgIndex(null),
                onError: () => setSpeakingMsgIndex(null)
            });
        }
    };

    const handleCopy = (idx, text) => {
        navigator.clipboard?.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleShare = (text) => {
        const shareText = `*बंधू AI सल्ला:*\n\n${text}\n\n👉 https://bandhu-ai-566ed.web.app`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    };

    const handleSend = async (text = input) => {
        if (!text || !text.trim()) return;

        const userText = text.trim();
        const userMsg = { sender: 'user', text: userText };
        setHistory(prev => [...prev, userMsg]);
        setInput('');
        setViewState('THINKING');
        setRichData(null);

        try {
            const data = await fetchChatResponse(userText, category, history, language);
            const aiMsg = { sender: 'ai', text: data.response || 'Error generating response.' };
            setHistory(prev => [...prev, aiMsg]);
            if (data.rich_data) {
                setRichData(data.rich_data);
            }

            // Sync to Google Cloud Firestore & log Analytics Event
            if (user?.uid) {
                saveChatTurnToFirestore(user.uid, {
                    userMessage: userText,
                    aiResponse: data.response,
                    category,
                    language
                });
            }
            logCustomEvent('chat_message_sent', { category, language });
        } catch (error) {
            console.error(error);
            setHistory(prev => [...prev, { sender: 'ai', text: `⚠️ Error: ${error.message}` }]);
        } finally {
            setViewState('IDLE');
        }
    };

    const startListening = async () => {
        cleanupAudio();
        setViewState('LISTENING');
        setTranscriptAccumulated('');
        setRecordingSeconds(0);
        setAudioVolume(0);
        audioChunksRef.current = [];

        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert(language === 'mr' ? 'तुमच्या ब्राउझरमध्ये मायक्रोफोन सपोर्ट नाही.' : 'Microphone is not supported in this browser.');
            setViewState('IDLE');
            return;
        }

        try {
            // 1. Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            audioStreamRef.current = stream;

            // 2. Setup Web Audio API Analyser for real-time soundwave meter
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                const audioCtx = new AudioContextClass();
                if (audioCtx.state === 'suspended') {
                    await audioCtx.resume();
                }
                audioContextRef.current = audioCtx;
                const sourceNode = audioCtx.createMediaStreamSource(stream);
                const analyserNode = audioCtx.createAnalyser();
                analyserNode.fftSize = 128;
                analyserNode.smoothingTimeConstant = 0.5;
                sourceNode.connect(analyserNode);
                analyserRef.current = analyserNode;

                const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
                const checkVolume = () => {
                    if (!analyserRef.current) return;
                    analyserRef.current.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }
                    const avg = sum / dataArray.length;
                    const level = Math.min(100, Math.round((avg / 80) * 100));
                    setAudioVolume(level);
                    animationFrameRef.current = requestAnimationFrame(checkVolume);
                };
                checkVolume();
            }

            // 3. Setup MediaRecorder for high-fidelity audio chunks
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/mp4')
                ? 'audio/mp4'
                : '';

            const mediaRecorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(200); // 200ms slice chunks
            mediaRecorderRef.current = mediaRecorder;

            // 4. Start recording timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingSeconds(prev => prev + 1);
            }, 1000);

            // 5. Run native SpeechRecognition in parallel if available for live interim text
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                try {
                    const recognition = new SpeechRecognition();
                    const speechLangCode = language === 'hi' ? 'hi-IN' : language === 'en' ? 'en-IN' : 'mr-IN';
                    recognition.lang = speechLangCode;
                    recognition.continuous = true;
                    recognition.interimResults = true;

                    recognition.onresult = (event) => {
                        let interim = '';
                        let final = '';
                        for (let i = 0; i < event.results.length; i++) {
                            const chunk = event.results[i][0].transcript;
                            if (event.results[i].isFinal) {
                                final += chunk + ' ';
                            } else {
                                interim += chunk;
                            }
                        }
                        const live = (final + interim).trim();
                        if (live) {
                            setTranscriptAccumulated(live);
                        }
                    };

                    recognition.onerror = (e) => {
                        console.warn('Native speech recognition notice (Whisper will process full audio):', e?.error);
                    };

                    recognition.start();
                    recognitionRef.current = recognition;
                } catch (recErr) {
                    console.warn('SpeechRecognition initialization skipped:', recErr);
                }
            }

        } catch (err) {
            console.error('Microphone access failed:', err);
            cleanupAudio();
            setViewState('IDLE');
            alert(language === 'mr'
                ? 'मायक्रोफोन परवानगी नाकारली गेली आहे. कृपया ब्राऊझर सेटिंगमध्ये मायक्रोफोन सुरू करा.'
                : 'Microphone permission denied. Please allow microphone access in browser settings.');
        }
    };

    const stopListening = async () => {
        const liveTranscript = transcriptAccumulated.trim();
        setViewState('PROCESSING');

        // Stop timer & animation
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Stop native speech recognition
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
            recognitionRef.current = null;
        }

        const mediaRecorder = mediaRecorderRef.current;
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.onstop = async () => {
                // Collect audio blob
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorder.mimeType || 'audio/webm'
                });

                cleanupAudio();

                // If native speech recognition already captured clear text, we can use it immediately!
                if (liveTranscript.length > 3) {
                    setInput(liveTranscript);
                    handleSend(liveTranscript);
                    return;
                }

                // Otherwise, use Groq Whisper STT on backend for guaranteed regional accuracy
                try {
                    const result = await transcribeAudioBlob(audioBlob, language);
                    const recognizedText = result?.text?.trim();

                    if (recognizedText && recognizedText.length > 0) {
                        setTranscriptAccumulated(recognizedText);
                        setInput(recognizedText);
                        handleSend(recognizedText);
                    } else {
                        alert(language === 'mr' ? 'आवाज स्पष्ट ऐकू आला नाही. कृपया पुन्हा बोला.' : 'No clear speech detected. Please speak again.');
                        setViewState('IDLE');
                    }
                } catch (err) {
                    console.error('Groq Whisper STT failed:', err);
                    if (liveTranscript) {
                        setInput(liveTranscript);
                        handleSend(liveTranscript);
                    } else {
                        alert(language === 'mr' ? 'आवाज ओळखण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.' : 'Voice recognition failed. Please try again.');
                        setViewState('IDLE');
                    }
                }
            };

            mediaRecorder.stop();
        } else {
            cleanupAudio();
            if (liveTranscript) {
                setInput(liveTranscript);
                handleSend(liveTranscript);
            } else {
                setViewState('IDLE');
            }
        }
    };

    const cancelListening = () => {
        cleanupAudio();
        setTranscriptAccumulated('');
        setViewState('IDLE');
    };

    const formatTimer = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
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

            {/* --- VOICE LISTENING OVERLAY --- */}
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
                    padding: '40px 20px 50px'
                }}>
                    {/* Top status */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#FFE0B2',
                            color: '#E65100',
                            fontSize: '13px',
                            fontWeight: '800',
                            padding: '6px 18px',
                            borderRadius: '20px',
                            marginBottom: '12px'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#E65100',
                                display: 'inline-block',
                                animation: 'pulse 1s infinite'
                            }}></span>
                            <span>{formatTimer(recordingSeconds)}</span>
                            <span>•</span>
                            <span>{t?.micActive || '🎙️ मायक्रोफोन सुरू आहे'}</span>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: '0 0 6px 0' }}>
                            {t?.voiceListening || 'बंधू ऐकत आहेत...'}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontWeight: '500' }}>
                            {t?.speakClearly || 'तुमचा प्रश्न स्पष्टपणे बोला'}
                        </p>
                    </div>

                    {/* Animated Microphone Radar / Ripple Circles */}
                    <div style={{
                        position: 'relative',
                        width: '200px',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '10px 0'
                    }}>
                        {/* Outer pulsating aura */}
                        <div style={{
                            position: 'absolute',
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(230, 81, 0, 0.12)',
                            transform: `scale(${1 + (audioVolume / 100) * 0.45})`,
                            transition: 'transform 0.1s ease-out',
                            zIndex: 1
                        }} />
                        <div style={{
                            position: 'absolute',
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 111, 0, 0.22)',
                            transform: `scale(${1 + (audioVolume / 100) * 0.25})`,
                            transition: 'transform 0.1s ease-out',
                            zIndex: 2
                        }} />

                        {/* Center Mic Button */}
                        <div style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                            border: '5px solid white',
                            boxShadow: `0 12px 35px rgba(230,81,0,${0.35 + (audioVolume / 200)})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            zIndex: 10,
                            transform: `scale(${1 + (audioVolume / 300)})`,
                            transition: 'transform 0.08s ease-out'
                        }}>
                            <Mic size={44} strokeWidth={2.4} />
                        </div>
                    </div>

                    {/* Soundwave Equalizer Bars */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        height: '40px',
                        marginBottom: '8px'
                    }}>
                        {[0.6, 0.9, 1.2, 1.0, 1.3, 0.8, 0.5].map((multiplier, idx) => {
                            const barHeight = Math.max(8, Math.min(38, (audioVolume * 0.4 * multiplier) + (idx % 2 === 0 ? 8 : 12)));
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        width: '6px',
                                        height: `${barHeight}px`,
                                        borderRadius: '4px',
                                        backgroundColor: audioVolume > 10 ? '#E65100' : '#D1D5DB',
                                        transition: 'height 0.08s ease, background-color 0.15s ease'
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Live Transcript / Speech Bubble */}
                    <div style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                        <div style={{
                            background: 'white',
                            border: '1.5px solid #FFE0B2',
                            borderRadius: '20px',
                            padding: '16px 20px',
                            minHeight: '76px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 6px 20px rgba(230,81,0,0.07)'
                        }}>
                            <p style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: transcriptAccumulated ? '#111827' : '#9CA3AF',
                                margin: 0,
                                lineHeight: '1.4'
                            }}>
                                {transcriptAccumulated || (language === 'mr' ? 'बोलत राहा... तुमचा आवाज ऐकला जात आहे' : language === 'hi' ? 'बोलते रहिए... आपकी आवाज़ सुनी जा रही है' : 'Speak now... listening to your voice')}
                            </p>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '320px' }}>
                        <button
                            onClick={stopListening}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '30px',
                                padding: '15px 28px',
                                fontSize: '17px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                boxShadow: '0 6px 22px rgba(230,81,0,0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <Square size={18} fill="white" />
                            <span>{t?.doneSpeaking || 'बोलणे पूर्ण झाले (Done)'}</span>
                        </button>

                        <button
                            onClick={cancelListening}
                            style={{
                                background: 'transparent',
                                color: '#6B7280',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                padding: '6px 16px'
                            }}
                        >
                            {language === 'mr' ? 'रद्द करा (Cancel)' : language === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel'}
                        </button>
                    </div>
                </div>
            )}

            {/* --- SPEECH PROCESSING OVERLAY --- */}
            {viewState === 'PROCESSING' && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(255, 253, 249, 0.95)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: '#FFE0B2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#E65100',
                        marginBottom: '20px'
                    }}>
                        <RefreshCw size={36} className="ani-spin" style={{ animation: 'spin 1.2s linear infinite' }} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
                        {language === 'mr' ? 'आवाज ओळखत आहे...' : language === 'hi' ? 'आवाज़ पहचानी जा रही है...' : 'Transcribing voice...'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                        {language === 'mr' ? 'कृपया एक सेकंद थांबा' : language === 'hi' ? 'कृपया एक सेकंड प्रतीक्षा करें' : 'Please wait a moment'}
                    </p>
                </div>
            )}


            {/* --- HEADER --- */}
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
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>{t?.appName || 'Bandhu AI'} 🙏</h3>
                        <p style={{ fontSize: '11px', opacity: 0.9, margin: 0 }}>
                            {category === 'education' ? (t?.categories?.education || 'Teacher') :
                                category === 'farming' ? (t?.categories?.farming || 'Farming Advisor') :
                                    category === 'health' ? (t?.categories?.health || 'Health Advisor') : (t?.tagline || 'AI Assistant')}
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

            {/* --- CHAT STREAM --- */}
            <div style={{
                padding: '20px',
                paddingBottom: '110px',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
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
                            {t?.greeting || 'Hello! I am Bandhu.'}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '280px', margin: '0 auto', lineHeight: '1.4' }}>
                            {t?.greetingSub || 'How can I help you today?'}
                        </p>
                    </div>
                )}

                {history.map((msg, idx) => {
                    const isAi = msg.sender === 'ai';
                    const isSpeaking = speakingMsgIndex === idx;
                    const isCopied = copiedIndex === idx;

                    return (
                        <div key={idx} style={{
                            alignSelf: isAi ? 'flex-start' : 'flex-end',
                            maxWidth: '88%',
                            marginBottom: '14px',
                            marginLeft: isAi ? 0 : 'auto'
                        }}>
                            <div style={{
                                background: isAi ? 'white' : '#FFE0B2',
                                color: '#111827',
                                padding: '12px 18px',
                                borderRadius: '18px',
                                borderBottomRightRadius: isAi ? '18px' : '4px',
                                borderBottomLeftRadius: isAi ? '4px' : '18px',
                                boxShadow: isAi ? '0 2px 10px rgba(0,0,0,0.05)' : '0 2px 8px rgba(230,81,0,0.1)',
                                border: isAi ? '1px solid #F3F4F6' : 'none',
                                fontSize: '15px',
                                lineHeight: '1.5',
                                fontWeight: '500',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.text}
                            </div>

                            {/* --- AI ACTION TOOLBAR (TTS Audio, Copy, Share) --- */}
                            {isAi && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '6px',
                                    paddingLeft: '4px'
                                }}>
                                    {/* Voice Read Aloud Button */}
                                    <button
                                        onClick={() => handleToggleSpeak(idx, msg.text)}
                                        style={{
                                            background: isSpeaking ? '#FFE0B2' : '#F9FAFB',
                                            border: isSpeaking ? '1px solid #E65100' : '1px solid #E5E7EB',
                                            borderRadius: '16px',
                                            padding: '4px 10px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: isSpeaking ? '#E65100' : '#4B5563',
                                            transition: 'all 0.15s ease'
                                        }}
                                        title={isSpeaking ? "थांबवा (Stop)" : "आवाज ऐका (Listen)"}
                                    >
                                        {isSpeaking ? (
                                            <>
                                                <VolumeX size={14} color="#E65100" />
                                                <span>थांबवा</span>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    gap: '2px',
                                                    alignItems: 'center',
                                                    marginLeft: '2px'
                                                }}>
                                                    <span style={{ width: '3px', height: '10px', backgroundColor: '#E65100', borderRadius: '1px', animation: 'pulse 0.6s infinite' }} />
                                                    <span style={{ width: '3px', height: '14px', backgroundColor: '#E65100', borderRadius: '1px', animation: 'pulse 0.8s infinite' }} />
                                                    <span style={{ width: '3px', height: '8px', backgroundColor: '#E65100', borderRadius: '1px', animation: 'pulse 0.5s infinite' }} />
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 size={14} color="#E65100" />
                                                <span>{language === 'mr' ? 'आवाज ऐका' : language === 'hi' ? 'आवाज़ सुनें' : 'Listen'}</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => handleCopy(idx, msg.text)}
                                        style={{
                                            background: '#F9FAFB',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '16px',
                                            padding: '4px 8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: isCopied ? '#16A34A' : '#6B7280'
                                        }}
                                        title="Copy message"
                                    >
                                        {isCopied ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                                        <span>{isCopied ? (language === 'mr' ? 'कॉपी झाले' : 'Copied') : (language === 'mr' ? 'कॉपी' : 'Copy')}</span>
                                    </button>

                                    {/* WhatsApp Share Button */}
                                    <button
                                        onClick={() => handleShare(msg.text)}
                                        style={{
                                            background: '#F9FAFB',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '16px',
                                            padding: '4px 8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#059669'
                                        }}
                                        title="Share on WhatsApp"
                                    >
                                        <Share2 size={13} color="#059669" />
                                        <span>{language === 'mr' ? 'शेअर' : 'Share'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

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
                            {t?.typing || 'Bandhu is typing...'}
                        </span>
                    </div>
                )}

                {richData && (
                    <div className="ani-fade-in" style={{ marginBottom: '16px' }}>
                        <RichResponseCard data={richData} />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* --- BOTTOM CHAT INPUT BAR --- */}
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
                <div style={{ display: 'flex', gap: '8px', padding: '10px 16px 6px', overflowX: 'auto' }}>
                    <SuggestionPill text={t?.suggestions?.rain || "Will it rain today?"} onClick={() => handleSend(t?.suggestions?.rain || "Will it rain today?")} />
                    <SuggestionPill text={t?.suggestions?.cotton || "Cotton market price?"} onClick={() => handleSend(t?.suggestions?.cotton || "Cotton market price?")} />
                    <SuggestionPill text={t?.suggestions?.schemes || "Government schemes?"} onClick={() => handleSend(t?.suggestions?.schemes || "Government schemes?")} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px 10px' }}>
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
                            placeholder={t?.askPlaceholder || "Ask anything here..."}
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
