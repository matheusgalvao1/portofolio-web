import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: number;
    content: string;
    displayedContent?: string;
}

const BASE_API_URL = 'http://localhost:8000/chat';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/history`);
                if (response.ok) {
                    setIsConnected(true);
                    await fetchMessages();
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
        try {
            const response = await fetch(`${BASE_API_URL}/history`);
            const data = await response.json();
            const adaptedMessages: Message[] = data.map((msg: any, index: number) => ({
                id: index,
                content: msg.content,
            }));
            setMessages(adaptedMessages);
        } catch (error) {
            // Handle the error
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage || isSending) return;

        setIsSending(true);

        const formData = new FormData();
        formData.append('input', newMessage);

        try {
            // TEST MODE
            formData.append('testMode', 'true'); // Append testMode to formData

            const response = await fetch(`${BASE_API_URL}/message/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setNewMessage('');
                await fetchMessages();
            }
        } catch (error) {
            // Handle the error
        }

        setIsSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSending) {
            handleSendMessage();
        }
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
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isSending}
                        />
                        <button onClick={handleSendMessage} disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </>
            ) : (
                <div>Unable to connect to API</div>
            )}
        </div>
    );
};

export default Chat;
