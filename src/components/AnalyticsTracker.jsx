import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../services/firebase';

const PAGE_TITLES = {
    '/': 'Bandhu AI - Home',
    '/home': 'Bandhu AI - Home',
    '/chat': 'Bandhu AI - Chat Interface',
    '/info': 'Bandhu AI - Daily Weather & Info',
    '/settings': 'Bandhu AI - Settings'
};

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const pageTitle = PAGE_TITLES[location.pathname] || `Bandhu AI - ${location.pathname}`;
        logPageView(location.pathname, pageTitle);
    }, [location]);

    return null;
};

export default AnalyticsTracker;
