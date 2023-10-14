import React, { useState, useEffect, useRef } from 'react';
import 'styles/Chat.css';
import Greeting from './Greeting';
import SendButton from './SendButton';

interface Message {
    content: string;
    author: string;
}

const BASE_API_URL_CHECK = process.env.NEXT_PUBLIC_BASE_API_URL_CHECK || "https://portofolioapi-npotaltx2q-no.a.run.app";
const BASE_API_URL = BASE_API_URL_CHECK + '/chat';
const greeting = 'Welcome, my name is Matheus, this interactive chat is connected to a modern LLM designed to answer to your questions in any language about my career, skills, experience, projects, and more, offering you a deeper understanding of who I am and what I do. Dive in, and enjoy learning more about me through a fun and informative experience!';

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

    // Run this useEffect every time 'messages' changes
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

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

        let currentChatId = chatId;
        if (!currentChatId) {
            currentChatId = await startChat();
            if (!currentChatId) {
                console.error("Failed to start chat");
                setError('Failed to connect to the server.');
                setIsSending(false);
                return;
            }
            setChatId(currentChatId);
        }

        const queryString = `chat_id=${currentChatId}&message=${encodeURIComponent(newMessage)}`;

        try {
            const response = await fetch(`${BASE_API_URL}/send_message/?${queryString}`, {
                method: 'POST',
            });

            if (response.ok) {
                setNewMessage('');
                const data = await response.json();
                const adaptedMessages: Message[] = data.messages.map((msg: any, index: number) => ({
                    content: msg.content,
                    author: msg.author,
                }));
                setMessages(adaptedMessages);
                //await fetchMessages(currentChatId as string);
            } else {
                console.log("Failed to send message");
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
                handleSendMessage();
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
                        <Greeting />
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
                            placeholder="Make a question..."
                        />
                        <SendButton isSending={isSending} handleSendMessage={handleSendMessage} />
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
