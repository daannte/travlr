import Home from "./components/home/Home";
import Planner from "./components/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import { useState } from "react";
import "./App.css";

function App() {
    const [submitted, setSubmitted] = useState(false);
    const [destination, setDestination] = useState("");

    return (
        <>
            <Navbar />
            {submitted ? (
                <Planner destination={destination} />
            ) : (
                <Home setSubmitted={setSubmitted} setDestination={setDestination} />
            )}
        </>
    );
}

export default App;
