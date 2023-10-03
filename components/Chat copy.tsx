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

    //const [currentChat, setCurrentChat] = useState<ChatModel>(null);
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
                        setChatId(id);
                        console.log("Chat ID received: ", id);
                        console.log("Chat ID local: ", chatId);
                        await fetchMessages();
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

    const fetchMessages = async () => {
        if (!chatId) return;

        try {
            const formData = new FormData();
            formData.append('chat_id', chatId);

            const response = await fetch(`${BASE_API_URL}/get_chat_db/`, {
                method: 'POST', // or whatever HTTP method is appropriate for your API
                body: formData,
            });
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
        if (!newMessage || isSending) return;

        setIsSending(true);

        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('message', newMessage);

        try {
            // TEST MODE
            //if (testMode) {
            //    formData.append('testMode', 'true'); // Append testMode to formData
            //}

            const response = await fetch(`${BASE_API_URL}/send_message/`, {
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
