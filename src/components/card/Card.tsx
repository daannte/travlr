import Activity from "../activity/Activity";
import "./Card.css";

interface CardProps {
    day: number;
}

function Card({ day }: CardProps) {
    return (
        <div className="card-container">
            <h1 className="card-day">Day {day}</h1>
            <div className="activity-container">
                <Activity />
            </div>
        </div>
    );
}

export default Card;
