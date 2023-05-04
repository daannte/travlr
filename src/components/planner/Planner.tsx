import Card from "../card/Card";
import AddDayIcon from "../../assets/addDay.svg";
import HeartIcon from "../../assets/heart.svg";
import FilledHeartIcon from "../../assets/filledHeart.svg";
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

function Planner({ destination }: { destination: string }) {
    const [activityList, setActivityList] = useState<ActivityList>({
        1: [{ startTime: "Start", endTime: "End", name: "Activity Name" }],
    });
    const [isSaved, setIsSaved] = useState(false);

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
                <div className="title-container">
                    <h1 className="destination">{destination}</h1>{" "}
                    <img
                        src={isSaved ? FilledHeartIcon : HeartIcon}
                        alt="Save"
                        className="save-icon"
                        onClick={() => setIsSaved((prevIsSaved) => !prevIsSaved)}
                    />
                </div>
                <div className="cards-container">
                    {renderCards()}
                    <button
                        className="add-icon"
                        onClick={() =>
                            setActivityList((prevActivityList) => {
                                const newDay = Object.keys(prevActivityList).length + 1;
                                return {
                                    ...prevActivityList,
                                    [newDay]: [
                                        {
                                            startTime: "Start",
                                            endTime: "End",
                                            name: "Activity Name",
                                        },
                                    ],
                                };
                            })
                        }
                    >
                        <img src={AddDayIcon} alt="Add Day"></img>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Planner;
