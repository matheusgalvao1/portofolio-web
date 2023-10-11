// pages/index.tsx
import React from 'react';
import Chat from '../components/Chat';
import RightColumn from '../components/RightColumn'

const HomePage: React.FC = () => {
    return (
        <div className="homePage">
            <h4 className="homePage__header">

            </h4>
            <div className="homePage__chat">
                <Chat />
                <RightColumn />
            </div>
        </div>
    );
};

export default HomePage;
