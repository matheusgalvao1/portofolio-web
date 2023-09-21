// pages/index.tsx
import React from 'react';
import Chat from '../components/Chat';

const HomePage: React.FC = () => {
    return (
        <div className="homePage">
            <h3 className="homePage__header">
                Hello, my name is Matheus, I am a Computer Scientist by training and a tech lover by nature.
                This page was designed to provide information about me in a more straight forward manner.
                The chat below allows you to talk with a LLM engineered to answer questions and provide information about myself, my career, skills, experience, projects and much more.
                <br />Hope you find it fun and helpful to know me better!
            </h3>
            <div className="homePage__chat">
                <Chat />
            </div>
        </div>
    );
};

export default HomePage;
