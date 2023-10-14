import React from 'react';
import 'styles/Error.css';


interface Error {
    message: string;
}

const ErrorComponent: React.FC<Error> = ({ message }) => {
    return (
        <div className="error-container">
            <div className={'profile-container'}>
                <img
                    src="assets/error.svg"
                    alt="Profile Picture"
                    className={'profile-picture'}
                />
            </div>
            <div className="error-message">
                {message}
            </div>
        </div>
    );
};

export default ErrorComponent;