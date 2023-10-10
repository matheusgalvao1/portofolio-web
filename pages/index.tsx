// pages/index.tsx
import React from 'react';
import Chat from '../components/Chat';
import RightColumn from '../components/RightColumn'

const HomePage: React.FC = () => {
    return (
        <div className="homePage">
            <h4 className="homePage__header">
                Greetings! I'm Matheus, a trained Computer Scientist and avid tech lover.
                This page offers succinct information about my professional background and passions.
                The interactive chat feature below is equipped with a sophisticated LLM designed to respond to your inquiries about my career, skills, experience,
                projects, and more, offering you a deeper understanding of who I am and what I do.
                <br /> Dive in, and enjoy learning more about me through a fun and informative experience!
            </h4>
            <div className="homePage__chat">
                <Chat />
                <RightColumn />
            </div>
        </div>
    );
};

export default HomePage;
