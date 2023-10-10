import React, { useState, useEffect, useRef } from 'react';
import 'styles/Chat.css';

interface Message {
    content: string;
    author: string;
}

const BASE_API_URL_CHECK = process.env.NEXT_PUBLIC_BASE_API_URL_CHECK || "https://portofolioapi-npotaltx2q-no.a.run.app";
//const BASE_API_URL_CHECK = "https://portofolioapi-npoataltx2q-no.a.run.app";
const BASE_API_URL = BASE_API_URL_CHECK + '/chat';
//const testMode = false;

const Chat: React.FC = () => {

    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            setIsLoading(true);
            console.log("Checking API:", BASE_API_URL_CHECK);
            try {
                const response = await fetch(`${BASE_API_URL_CHECK}/`);
                console.log("API checked");
                if (response.ok) {
                    setIsConnected(true);
                    setError(null);
                } else {
                    setIsConnected(false);
                    setError('Failed to connect to the server.');
                }
            } catch (error) {
                console.error("Error while checking API:", error);
                setIsConnected(false);
                setError('Failed to connect to the server.');
            }
            setIsLoading(false);
        };
        checkConnection();
    }, []);


    const startChat = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/create`);
            if (response.ok) {
                const data = await response.json();
                if (data.chat_id) {
                    return data.chat_id;
                } else {
                    setIsConnected(false);
                    setError('Failed to connect to the server.');
                    console.error("No chat_id received from server");
                    return null;
                }
            } else {
                setIsConnected(false);
                setError(null);
                return null;
            }
        } catch (error) {
            setIsConnected(false);
            setError('Failed to connect to the server.');
            console.error("An error occurred while starting the chat:", error);
        }
    };

    const fetchMessages = async (chatId: string) => {
        if (!chatId) return;

        try {
            const response = await fetch(`${BASE_API_URL}/get_chat_db/?chat_id=${chatId}`);
            const data = await response.json();

            const adaptedMessages: Message[] = data.messages.map((msg: any, index: number) => ({
                content: msg.content,
                author: msg.author,
            }));
            setMessages(adaptedMessages);
        } catch (error) {
            setError('Failed to connect to the server.');
            console.error("An error occurred while fetching the messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage || isSending) return;

        setIsSending(true);

        if (!chatId) {
            const id = await startChat();
            if (!id) {
                console.error("Failed to start chat");
                setError('Failed to connect to the server.');
                setIsSending(false);
                return;
            }
            setChatId(id);
        }

        const queryString = `chat_id=${chatId}&message=${encodeURIComponent(newMessage)}`;

        try {
            const response = await fetch(`${BASE_API_URL}/send_message/?${queryString}`, {
                method: 'POST',
            });

            if (response.ok) {
                setNewMessage('');
                await fetchMessages(chatId as string);
            } else {
                // Handle the error (you may want to set some error state here)
            }
        } catch (error) {
            setError('Failed to connect to the server.');
            console.log("An error occurred while sending the message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSending) {
            if (!chatId) {
                startChat().then(id => {
                    if (id) {
                        setChatId(id);
                    }
                });
            } else {
                handleSendMessage();
            }
        }
    };

    return (
        <div className="chat-container">
            {isLoading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="error-container">
                    <div>{error}</div>
                </div>
            ) : isConnected ? (
                <>
                    <div className="chat-box">
                        {messages.map((message, index) => (
                            <div key={index} className={message.author === 'Human' ? 'message-right' : 'message-left'}>
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
                        <button onClick={handleSendMessage} className="apple-button" disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="error-container">
                    <div>Unable to connect to API ;(</div>
                </div>

            )}
        </div>
    );
};

export default Chat;
