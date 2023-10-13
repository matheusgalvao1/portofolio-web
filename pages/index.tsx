// pages/index.tsx
import React from 'react';
import Chat from '../components/Chat';
import Links from '../components/Links'

const HomePage: React.FC = () => {
    return (
        <div className="homePage">
            <h4 className="homePage__header">

            </h4>
            <div className="homePage__chat">
                <Chat />
                <Links />
            </div>
        </div>
    );
};

export default HomePage;
