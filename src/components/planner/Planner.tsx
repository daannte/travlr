import Card from "../card/Card";
import AddDayIcon from "../../assets/addDay.svg";
import "./Planner.css";
import { useState } from "react";

interface ActivityList {
    [key: number]: string[];
}

function Planner() {
    const [activityList, setActivityList] = useState<ActivityList>({ 1: [] });

    function renderCards() {
        return Object.keys(activityList).map((day) => (
            <Card
                key={day}
                day={parseInt(day)}
                setActivityList={setActivityList}
                activityList={activityList}
            />
        ));
    }

    return (
        <div className="planner-container">
            <div className="event-container">
                {renderCards()}
                <button
                    className="add-icon"
                    onClick={() =>
                        setActivityList((prevActivityList) => {
                            const newDay = Object.keys(prevActivityList).length + 1;
                            return { ...prevActivityList, [newDay]: [] };
                        })
                    }
                >
                    <img src={AddDayIcon} alt="Add Day"></img>
                </button>
            </div>
        </div>
    );
}

export default Planner;
