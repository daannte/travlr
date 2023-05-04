import "./Home.css";

interface HomeProps {
    setSubmitted: (submitted: boolean) => void;
    setDestination: (destination: string) => void;
}

function Home({ setSubmitted, setDestination }: HomeProps) {
    return (
        <div className="home-container">
            <h1 className="title">Plan your next vacation.</h1>
            <p>Enter your destination:</p>
            <form onSubmit={() => setSubmitted(true)}>
                <input
                    className="search-box"
                    name="destination"
                    type="text"
                    placeholder="e.g Barcelona"
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />
            </form>
        </div>
    );
}

export default Home;
