import { useState } from "react";
import "./Activity.css";

import deleteIcon from "../../assets/deleteActivity.svg";
import editIcon from "../../assets/edit.svg";
import checkIcon from "../../assets/check.svg";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface ActivityProps {
  day: number;
  activityIndex: number;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  activityList: ActivityList[];
}

function Activity({
  day,
  activityIndex,
  setActivityList,
  activityList,
}: ActivityProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const activity = activityList[day].activities[activityIndex];

  // Handle edit values and add them to activity object
  function handleEditValues(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, className } = event.target;
    const activityListData = [...activityList];
    const updatedActivity = {
      ...activityListData[day].activities[activityIndex],
    };

    switch (className) {
      case "name-edit":
        updatedActivity.name = value;
        break;
      case "time-start-edit":
        updatedActivity.startTime = value;
        break;
      case "time-end-edit":
        updatedActivity.endTime = value;
        break;
      default:
        break;
    }
    activityListData[day].activities[activityIndex] = updatedActivity;
    setActivityList(activityListData);
  }

  // Delete activity from activity list
  function handleActivityDelete() {
    const activityListData = [...activityList];
    const updatedActivities = activityListData[day].activities.filter(
      (_, index) => index !== activityIndex
    );
    activityListData[day].activities = updatedActivities;
    setActivityList(activityListData);
  }

  return (
    <div className="activity">
      <div className="activity-info">
        {isEditing ? (
          // Show edit form
          <>
            <input
              className="name-edit"
              value={activity.name}
              onChange={handleEditValues}
            />
            <div>
              <input
                className="time-start-edit"
                value={activity.startTime}
                onChange={handleEditValues}
              />{" "}
              <span> - </span>
              <input
                className="time-end-edit"
                value={activity.endTime}
                onChange={handleEditValues}
              />
            </div>
          </>
        ) : (
          // Show activity info
          <>
            <p className="activity-name">{activity.name}</p>
            <p className="activity-time">
              <span>{activity.startTime} </span>-
              <span> {activity.endTime}</span>
            </p>
          </>
        )}
      </div>
      <div className="activity-button">
        {!isEditing && (
          <button className="delete-button" onClick={handleActivityDelete}>
            <img src={deleteIcon} alt="Delete Activity" />
          </button>
        )}
        {isEditing && (
          <button
            className="confirm-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <img src={checkIcon} alt="Confirm Edit" />
          </button>
        )}
        {!isEditing && (
          <button
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <img src={editIcon} alt="Edit Activity" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Activity;
