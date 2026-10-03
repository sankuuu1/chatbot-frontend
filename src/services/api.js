const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const PRODUCTION_FALLBACK = 'https://chatbot-backend-1-nhq4.onrender.com';

export const fetchChatResponse = async (message, category = 'general', history = [], language = 'mr') => {
    const payload = { message, category, history, language };

    try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok && API_BASE_URL !== PRODUCTION_FALLBACK) {
            const fallbackRes = await fetch(`${PRODUCTION_FALLBACK}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            return await fallbackRes.json();
        }
        return await res.json();
    } catch (error) {
        console.warn('API fetch error, trying production fallback endpoint...', error);
        try {
            const fallbackRes = await fetch(`${PRODUCTION_FALLBACK}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            return await fallbackRes.json();
        } catch (e) {
            throw new Error('सर्वरशी संपर्क होऊ शकला नाही. (Unable to reach server)');
        }
    }
};

export const fetchDailyInfo = async (language = 'mr') => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/daily-info?lang=${language}`);
        return await res.json();
    } catch (err) {
        const res = await fetch(`${PRODUCTION_FALLBACK}/api/daily-info?lang=${language}`);
        return await res.json();
    }
};

export const transcribeAudioBlob = async (audioBlob, language = 'mr') => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'speech.webm');
    formData.append('language', language);

    try {
        const res = await fetch(`${API_BASE_URL}/api/transcribe`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok && API_BASE_URL !== PRODUCTION_FALLBACK) {
            const fallbackRes = await fetch(`${PRODUCTION_FALLBACK}/api/transcribe`, {
                method: 'POST',
                body: formData,
            });
            return await fallbackRes.json();
        }
        return await res.json();
    } catch (err) {
        console.warn('Local transcribe failed, trying production endpoint...', err);
        const fallbackRes = await fetch(`${PRODUCTION_FALLBACK}/api/transcribe`, {
            method: 'POST',
            body: formData,
        });
        return await fallbackRes.json();
    }
};

export const fetchSettings = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        return await res.json();
    } catch (err) {
        const res = await fetch(`${PRODUCTION_FALLBACK}/api/settings`);
        return await res.json();
    }
};

export const saveSettings = async (settingsData) => {
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
    });
    return await res.json();
};

export const fetchMandiRates = async (language = 'mr') => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/mandi-rates?lang=${language}`);
        return await res.json();
    } catch (err) {
        console.warn('Local mandi rates failed, trying production endpoint...', err);
        const res = await fetch(`${PRODUCTION_FALLBACK}/api/mandi-rates?lang=${language}`);
        return await res.json();
    }
};
