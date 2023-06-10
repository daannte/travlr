import { useContext, useState } from "react";
import { PlannerContext } from "../../App";
import "./Activity.css";

import deleteIcon from "../../assets/deleteActivity.svg";
import editIcon from "../../assets/edit.svg";
import checkIcon from "../../assets/check.svg";

interface ActivityProps {
  day: number;
  activityIndex: number;
}

function Activity({ day, activityIndex }: ActivityProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const activity = currentPlanner.activityLists[day].activities[activityIndex];
  const date = currentPlanner.activityLists[day].date;

  // Handle edit values and add them to activity object
  function handleEditValues(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, className } = event.target;
    setCurrentPlanner((prevPlanner) => {
      const { activityLists } = prevPlanner;
      const updatedActivityLists = activityLists.map((activityList) => {
        if (activityList.date === date) {
          const updatedActivities = activityList.activities.map(
            (activity, index) => {
              if (index === activityIndex) {
                switch (className) {
                  case "name-edit":
                    return { ...activity, name: value };
                  case "time-start-edit":
                    return { ...activity, startTime: value };
                  case "time-end-edit":
                    return { ...activity, endTime: value };
                  default:
                    return activity;
                }
              }
              return activity;
            }
          );
          return { ...activityList, activities: updatedActivities };
        }
        return activityList;
      });

      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
  }

  // Delete activity from activity list
  function handleActivityDelete() {
    setCurrentPlanner((prevPlanner) => {
      const { activityLists } = prevPlanner;
      const updatedActivityLists = activityLists.map((activityList) => {
        if (activityList.date === date) {
          const updatedActivities = activityList.activities.filter(
            (_, index) => index !== activityIndex
          );
          return { ...activityList, activities: updatedActivities };
        }
        return activityList;
      });
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
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
