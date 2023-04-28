import { useState } from "react";
import deleteIcon from "../../assets/delete.svg";
import editIcon from "../../assets/edit.svg";
import confirmIcon from "../../assets/confirm.svg";
import "./Activity.css";

interface ActivityList {
    [key: number]: string[];
}

interface ActivityProps {
    day: number;
    activityId: string;
    index: number;
    setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
}

function Activity({ day, activityId, index, setActivityList }: ActivityProps) {
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [startTime, setStartTime] = useState<string>("Start");
    const [endTime, setEndTime] = useState<string>("End");
    const [name, setName] = useState<string>("");

    function handleEditValues(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.className === "time-start-edit") {
            setStartTime(event.target.value);
        } else if (event.target.className === "time-end-edit") {
            setEndTime(event.target.value);
        } else {
            setName(event.target.value);
        }
    }

    function handleActivityDelete() {
        setActivityList((prevActivityList) => {
            const newActivityList = { ...prevActivityList };
            const activities = newActivityList[day];
            activities.splice(index, 1);

            for (let i = 1; i < activities.length; i++) {
                activities[i] = "activity" + (i + 1);
            }

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
                                placeholder={startTime}
                                onChange={handleEditValues}
                            />{" "}
                            <span> - </span>
                            <input
                                className="time-end-edit"
                                placeholder={endTime}
                                onChange={handleEditValues}
                            />
                        </div>
                        <input
                            className="name-edit"
                            placeholder={name}
                            onChange={handleEditValues}
                        />
                    </>
                ) : (
                    <>
                        <p className="activity-time">
                            <span>{startTime} </span>-<span> {endTime}</span>
                        </p>
                        <p className="activity-name">{name}</p>
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
