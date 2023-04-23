import Activity from "../activity/Activity";
import DeleteSvg from "../../assets/delete.svg";
import "./Card.css";

interface CardProps {
    day: number;
    setCardCount: (count: (prevCount: number) => number) => void;
    cardCount: number;
}

function Card({ day, setCardCount, cardCount }: CardProps) {
    return (
        <div className="card-container">
            <div className="card-header">
                <h1 className="card-day">Day {day}</h1>
                {cardCount === 1 ? null : (
                    <button
                        className="delete-icon"
                        onClick={() => setCardCount((count: number) => count - 1)}
                    >
                        <img src={DeleteSvg} alt="Delete Day" />
                    </button>
                )}
            </div>
            <div className="activity-container">
                <Activity />
            </div>
        </div>
    );
}

export default Card;
