import Activity from "../activity/Activity";
import DeleteSvg from "../../assets/delete.svg";
import AddActivityIcon from "../../assets/addActivity.svg";
import "./Card.css";
import { Dispatch, SetStateAction } from "react";
interface ActivityList {
    [key: number]: number;
}

interface CardProps {
    day: number;
    cardCount: number;
    setActivityList: Dispatch<SetStateAction<ActivityList>>;
    activityList: ActivityList;
}

function Card({ day, cardCount, setActivityList, activityList }: CardProps) {
    const renderActivities = () => {
        const activityCount = activityList[day];
        const activities = [];
        for (let i = 0; i < activityCount; i++) {
            activities.push(<Activity key={i} />);
        }
        return activities;
    };

    return (
        <div className="card-container">
            <div className="card-header">
                <h1 className="card-day">Day {day}</h1>
                <button
                    className="delete-icon"
                    onClick={() =>
                        setActivityList((prevList: ActivityList) => {
                            delete prevList[day];
                            const newActivityList: ActivityList = {};
                            let index = 1;
                            for (const key in prevList) {
                                newActivityList[index] = prevList[key];
                                index++;
                            }
                            return newActivityList;
                        })
                    }
                >
                    <img src={DeleteSvg} alt="Delete Day" />
                </button>
            </div>
            <div className="activity-container">{renderActivities()}</div>
            <button
                className="addActivity-icon"
                onClick={() =>
                    setActivityList((prevList: ActivityList) => {
                        const newActivity = prevList[day] + 1;
                        return { ...prevList, [day]: newActivity };
                    })
                }
            >
                <img src={AddActivityIcon} alt="Add Activity" />
            </button>
        </div>
    );
}

export default Card;
