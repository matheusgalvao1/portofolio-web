import 'styles/Greeting.css';

const greeting = "Hello! Ask me anything about Matheus!"

function Greeting() {
    return (
        <div className={'container'}>
            <div className={'profile-container'}>
                <img
                    src="assets/memoji.svg"
                    alt="Profile Picture"
                    className={'profile-picture'}
                />
            </div>
            <div className={'message'}>
                {greeting}
            </div>
        </div>
    );
}

export default Greeting; 