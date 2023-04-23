import Card from "../card/Card";
import AddIcon from "../../assets/add.svg";
import "./Planner.css";
import { useState } from "react";

function Planner() {
    const [cardCount, setCardCount] = useState(1);

    const renderCards = () => {
        const cards = [];
        for (let i = 1; i <= cardCount; i++) {
            cards.push(<Card day={i} setCardCount={setCardCount} cardCount={cardCount} />);
        }
        return cards;
    };

    return (
        <div className="planner-container">
            <div className="event-container">
                {renderCards()}
                <button className="add-icon" onClick={() => setCardCount((count) => count + 1)}>
                    <img src={AddIcon} alt="Add Day"></img>
                </button>
            </div>
        </div>
    );
}

export default Planner;
