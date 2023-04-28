import Activity from "../activity/Activity";
import deleteIcon from "../../assets/delete.svg";
import addActivityIcon from "../../assets/addActivity.svg";
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
    function handleCardDelete() {
        setActivityList((prevActivityList: ActivityList) => {
            delete prevActivityList[day];
            const fixedActivityList: ActivityList = {};
            // Reassign the keys so the numbers are back in order
            let i = 1;
            for (const key in prevActivityList) {
                fixedActivityList[i] = prevActivityList[key];
                i++;
            }
            return fixedActivityList;
        });
    }

    function handleAddActivity() {
        setActivityList((prevActivityList: ActivityList) => {
            const newActivityList = { ...prevActivityList };
            newActivityList[day] = [
                ...newActivityList[day],
                "activity" + (newActivityList[day].length + 1),
            ];
            return newActivityList;
        });
    }

    function renderActivites() {
        return activityList[day].map((activityId: string, index: number) => {
            return (
                <Activity
                    key={index}
                    day={day}
                    activityId={activityId}
                    index={index}
                    setActivityList={setActivityList}
                />
            );
        });
    }

    return (
        <div className="card">
            <div className="card-header">
                <h1 className="card-title">Day {day}</h1>
                <button className="delete-card-icon" onClick={handleCardDelete}>
                    <img src={deleteIcon} alt="Delete Card" />
                </button>
            </div>
            {renderActivites()}
            <button className="add-activity-icon" onClick={handleAddActivity}>
                <img src={addActivityIcon} alt="Add Activity" />
            </button>
        </div>
    );
}

export default Card;
