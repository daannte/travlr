import { useState } from "react";
import "./Card.css";

interface ActivityList {
    [key: number]: string[];
}

interface CardProps {
    day: number;
    setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
    activityList: ActivityList;
}

function Card({ day, setActivityList, activityList }: CardProps) {
    return (
        <div className="card">
            <h1>Card</h1>
        </div>
    );
}

export default Card;
