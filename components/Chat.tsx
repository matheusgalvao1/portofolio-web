// components/Chat.tsx
import React, { useState, useEffect } from 'react';

const BASE_API_URL = 'http://localhost:8000/chat';

interface Message {
    id: number;
    content: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/history`);
                if (response.ok) {
                    console.log('Successfully connected to API.');
                    setIsConnected(true);
                    fetchMessages(); // Fetch messages after successful connection
                } else {
                    console.error('API connection failed:', response.statusText);
                    setIsConnected(false);
                }
            } catch (error) {
                console.error('An error occurred while checking API connection:', error);
                setIsConnected(false);
            }
        };

        checkConnection();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/history`);
            if (response.ok) {
                const data = await response.json();
                const adaptedMessages: Message[] = data.map((msg: any, index: number) => {
                    return { id: index, content: msg.content };
                });
                setMessages(adaptedMessages);
            } else {
                console.error('Failed to fetch messages:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred while fetching messages:', error);
        }
    };


    const handleSendMessage = async () => {
        if (!newMessage) return; // Prevent empty messages

        const formData = new FormData();
        formData.append('input', newMessage);

        try {
            const response = await fetch(`${BASE_API_URL}/message/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const output = await response.json();
                setMessages([...messages, { id: Date.now(), content: output }]);
                setNewMessage('');
            } else {
                console.error('Failed to send message:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred while sending the message:', error);
        }
    };

    return (
        <div>
            {isConnected ? (
                <>
                    <div>
                        {messages.map((message) => (
                            <div key={message.id}>{message.content}</div>
                        ))}
                    </div>
                    <div>
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
