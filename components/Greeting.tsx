import 'styles/Greeting.css';

const greeting = 'Welcome, my name is Matheus, this interactive chat is connected to a modern LLM designed to answer to your questions in any language about my career, skills, experience, projects, and more, offering you a deeper understanding of who I am and what I do. Dive in, and enjoy learning more about me through a fun and informative experience!';

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