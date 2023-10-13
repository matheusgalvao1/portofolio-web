// SendButtonButton.tsx

import React from 'react';
import 'styles/SendButton.css';  // Adjust the path if needed

interface SendButtonProps {
    isSending: boolean;
    handleSendMessage: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ isSending, handleSendMessage }) => {
    return (
        <button onClick={handleSendMessage} className="button" disabled={isSending}>
            {isSending
                ? <div className="dotSpinner">
                    <div></div><div></div><div></div>
                </div>
                : <img src={'assets/send.svg'} alt="Send" />
            }
        </button>
    );
}

export default SendButton;
