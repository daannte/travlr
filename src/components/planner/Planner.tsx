import Card from "../card/Card";
import AddDayIcon from "../../assets/addDay.svg";
import "./Planner.css";
import { useState } from "react";

interface ActivityDetails {
    startTime: string;
    endTime: string;
    name: string;
}

interface ActivityList {
    [key: number]: ActivityDetails[];
}

function Planner() {
    const [activityList, setActivityList] = useState<ActivityList>({
        1: [{ startTime: "Start", endTime: "End", name: "Activity Name" }],
    });

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
                            return {
                                ...prevActivityList,
                                [newDay]: [
                                    { startTime: "Start", endTime: "End", name: "Activity Name" },
                                ],
                            };
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
