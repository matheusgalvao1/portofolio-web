// pages/_app.tsx
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/global.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    useEffect(() => {
        const theme = window.localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return <Component {...pageProps} />;
};

export default MyApp;
