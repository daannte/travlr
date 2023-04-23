import "./Home.css";

interface HomeProps {
    setSubmitted: (arg0: boolean) => void;
}

function Home({ setSubmitted }: HomeProps) {
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
                    required
                />
            </form>
        </div>
    );
}

export default Home;
