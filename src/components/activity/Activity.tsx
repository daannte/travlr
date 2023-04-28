import { useState } from "react";
import deleteIcon from "../../assets/delete.svg";
import editIcon from "../../assets/edit.svg";
import confirmIcon from "../../assets/confirm.svg";
import "./Activity.css";

interface Activity {
    startTime: string;
    endTime: string;
    name: string;
}

interface ActivityList {
    [key: number]: Activity[];
}

interface ActivityProps {
    day: number;
    index: number;
    setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
    activityList: ActivityList;
}

function Activity({ day, index, setActivityList, activityList }: ActivityProps) {
    const [isEditing, setIsEditing] = useState<boolean>(true);

    function handleEditValues(event: React.ChangeEvent<HTMLInputElement>) {
        const { value, className } = event.target;
        const activity = activityList[day][index];
        if (className === "time-start-edit") {
          activity.startTime = value;
        } else if (className === "time-end-edit") {
          activity.endTime = value;
        } else {
          activity.name = value;
        }
      }

    function handleActivityDelete() {
        setActivityList((prevActivityList) => {
            const newActivityList = { ...prevActivityList };
            const activities = newActivityList[day];

            const newActivities = activities.filter((_, i) => i !== index);
            newActivityList[day] = newActivities;

            return newActivityList;
        });
    }

    return (
        <div className="activity">
            <div className="activity-info">
                {isEditing ? (
                    <>
                        <div>
                            <input
                                className="time-start-edit"
                                placeholder={activityList[day][index].startTime}
                                onChange={handleEditValues}
                            />{" "}
                            <span> - </span>
                            <input
                                className="time-end-edit"
                                placeholder={activityList[day][index].endTime}
                                onChange={handleEditValues}
                            />
                        </div>
                        <input
                            className="name-edit"
                            placeholder={activityList[day][index].name}
                            onChange={handleEditValues}
                        />
                    </>
                ) : (
                    <>
                        <p className="activity-time">
                            <span>{activityList[day][index].startTime} </span>-
                            <span> {activityList[day][index].endTime}</span>
                        </p>
                        <p className="activity-name">{activityList[day][index].name}</p>
                    </>
                )}
            </div>
            <div className="activity-button">
                {isEditing ? null : (
                    <button className="delete-button" onClick={handleActivityDelete}>
                        <img src={deleteIcon} alt="Delete Activity" />
                    </button>
                )}
                {isEditing ? (
                    <button className="confirm-button" onClick={() => setIsEditing(!isEditing)}>
                        <img src={confirmIcon} alt="Confirm Edit" />
                    </button>
                ) : (
                    <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                        <img src={editIcon} alt="Edit Activity" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Activity;
