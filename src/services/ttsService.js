/**
 * Bandhu AI - Indic Text-To-Speech (TTS) Service
 * ===============================================
 * Provides high-quality regional voice playback in Marathi (mr-IN),
 * Hindi (hi-IN), and Indian English (en-IN).
 * Strips markdown and special characters for natural spoken output.
 */

export const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';

    return rawText
        // Remove markdown headings, bold, italics, strikethrough
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/~~(.*?)~~/g, '$1')
        // Remove markdown code blocks and inline code
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        // Remove markdown links [text](url) -> text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove markdown tables (| col | col |)
        .replace(/\|.*\|/g, '')
        .replace(/[-:]{3,}/g, '')
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove JSON blobs
        .replace(/\{[\s\S]*?\}/g, '')
        // Clean excessive whitespace and punctuation
        .replace(/\s+/g, ' ')
        .trim();
};

export const getBestIndicVoice = (langCode = 'mr') => {
    if (!('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices() || [];
    const targetPrefix = langCode === 'hi' ? 'hi' : langCode === 'en' ? 'en' : 'mr';

    // 1. Look for native regional language voice (e.g. Marathi mr-IN, Hindi hi-IN)
    let matched = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));

    // 2. Look for Indian English or Hindi fallback if Marathi voice isn't installed locally
    if (!matched && langCode === 'mr') {
        matched = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'));
    }

    return matched || voices[0] || null;
};

export const speakIndicText = ({
    text,
    language = 'mr',
    rate = 1.0,
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
}) => {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis is not supported in this browser.');
        onError(new Error('SpeechSynthesis not supported'));
        return null;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) {
        onEnd();
        return null;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const langTag = language === 'hi' ? 'hi-IN' : language === 'en' ? 'en-IN' : 'mr-IN';
    utterance.lang = langTag;
    utterance.rate = rate || 1.0;
    utterance.pitch = 1.0;

    const voice = getBestIndicVoice(language);
    if (voice) {
        utterance.voice = voice;
    }

    utterance.onstart = () => onStart();
    utterance.onend = () => onEnd();
    utterance.onerror = (e) => {
        // 'interrupted' / 'canceled' is normal when user stops or switches
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('TTS utterance error:', e);
        }
        onError(e);
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
};

export const stopSpeech = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};
