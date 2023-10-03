import React, { useState, useEffect, useRef } from 'react';
import { start } from 'repl';


interface ChatModel {
    chat_id: string;
    messages: Message[];
}

interface Message {
    content: string;
    author: string;
}


//const BASE_API_URL = 'http://localhost:8000/chat';
const BASE_API_URL_CHECK = 'http://localhost:8000';
const BASE_API_URL = BASE_API_URL_CHECK + '/chat';
//const testMode = false;

const Chat: React.FC = () => {

    const [chatId, setChatId] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch(`${BASE_API_URL_CHECK}/`);
                if (response.ok) {
                    const id = await startChat();
                    if (id) {
                        console.log("ID received from startChat:", id);  // Should log the correct ID
                        setChatId(id);
                        await fetchMessages(id);  // Pass id directly to fetchMessages
                        setIsConnected(true);
                    }
                } else {
                    setIsConnected(false);
                }
            } catch (error) {
                setIsConnected(false);
            }
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
                    console.error("No chat_id received from server");
                    return null;
                }
            } else {
                setIsConnected(false);
                return null;
            }
        } catch (error) {
            setIsConnected(false);
            console.error("An error occurred while starting the chat:", error);
        }
    };

    const fetchMessages = async (chatId: string) => {
        if (!chatId) return;

        try {
            console.log("Chat ID passed to fetchMessages:", chatId);  // Should log the correct ID
            const response = await fetch(`${BASE_API_URL}/get_chat_db/?chat_id=${chatId}`);
            const data = await response.json();

            const adaptedMessages: Message[] = data.messages.map((msg: any, index: number) => ({
                content: msg.content,
                author: msg.author,
            }));
            setMessages(adaptedMessages);
        } catch (error) {
            // Handle the error
            console.error("An error occurred while fetching the messages:", error);
        }
    };


    const handleSendMessage = async () => {
        if (!newMessage || isSending || !chatId) return;

        setIsSending(true);

        console.log("Chat ID passed to handleSendMessage:", chatId);  // Should log the correct ID
        console.log("New message passed to handleSendMessage:", newMessage);  // Should log the correct message

        const queryString = `chat_id=${chatId}&message=${encodeURIComponent(newMessage)}`;

        try {
            const response = await fetch(`${BASE_API_URL}/send_message/?${queryString}`, {
                method: 'POST',
            });

            if (response.ok) {
                setNewMessage('');
                await fetchMessages(chatId);
            } else {
                console.error('Failed to send message:', await response.text());
            }
        } catch (error) {
            console.error('Error sending message:', error);
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
                        <button onClick={handleSendMessage} disabled={isSending}>
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
