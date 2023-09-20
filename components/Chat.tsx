import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: number;
    content: string;
}

const BASE_API_URL = 'http://localhost:8000/chat';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/history`);
                if (response.ok) {
                    setIsConnected(true);
                    fetchMessages();
                } else {
                    setIsConnected(false);
                }
            } catch (error) {
                setIsConnected(false);
            }
        };

        checkConnection();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_API_URL}/history`);
            if (response.ok) {
                const data = await response.json();
                const adaptedMessages: Message[] = data.map((msg: any, index: number) => ({
                    id: index,
                    content: msg.content,
                }));
                setMessages(adaptedMessages);
            }
        } catch (error) {
            // Handle error
        }
        setIsLoading(false);
    };

    const handleSendMessage = async () => {
        setIsLoading(true);
        if (!newMessage) return;

        const formData = new FormData();
        formData.append('input', newMessage);

        try {
            const response = await fetch(`${BASE_API_URL}/message/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            // Handle error
        }
        setIsLoading(false);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container">
            {isConnected ? (
                <>
                    <div className="chat-box">
                        {messages.map((message, index) => (
                            <div key={message.id} className={index % 2 === 0 ? 'message-right' : 'message-left'}>
                                {message.content}
                            </div>
                        ))}
                        {isLoading && <div className="loading">Loading...</div>}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </>
            ) : (
                <div>Unable to connect to API</div>
            )}
        </div>
    );
};

export default Chat;
