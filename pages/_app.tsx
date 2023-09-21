import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/global.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    useEffect(() => {
        const theme = window.localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return (
        <>
            <Head>
                <title>Matheus' Portfolio</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default MyApp;
