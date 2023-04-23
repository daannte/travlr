import Home from "./components/home/Home";
import "./App.css";
import Planner from "./components/planner/Planner";
import background from "./assets/background.jpg";
import { useState } from "react";

function App() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div
            style={{
                background: `url(${background}) no-repeat center`,
                backgroundSize: "cover",
                height: "100vh",
            }}
        >
            {submitted ? <Planner /> : <Home setSubmitted={setSubmitted} />}
        </div>
    );
}

export default App;
