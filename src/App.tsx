import Home from "./components/home/Home";
import Planner from "./components/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import { useState } from "react";
import "./App.css";

function App() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <>
            <Navbar />
            {submitted ? <Planner /> : <Home setSubmitted={setSubmitted} />}
        </>
    );
}

export default App;
