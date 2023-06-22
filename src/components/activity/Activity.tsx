import { useContext, useState } from "react";
import { PlannerContext } from "../../App";
import "./Activity.css";

import clockIcon from "../../assets/clock.svg";
import CustomTimePicker from "../customTimePicker/customTimePicker";

// interface IFormInputs {
//   startTime: string;
//   endTime: string;
// }

interface Props {
  day: number;
  activityIndex: number;
}

function Activity({ day, activityIndex }: Props) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const { activityLists } = currentPlanner;
  const activityList = activityLists[day];
  const { activities, date } = activityList;
  const activity = activities[activityIndex];

  const [isChoosingTime, setIsChoosingTime] = useState<boolean>(false);

  // Delete activity from activity list
  function handleActivityDelete() {
    setCurrentPlanner((prevPlanner) => {
      const { activityLists } = prevPlanner;
      const updatedActivityLists = activityLists.map((activityList) => {
        if (activityList.date === date) {
          const updatedActivities = activityList.activities.filter(
            (_, index) => index !== activityIndex
          );
          const isEmpty = updatedActivities.length === 0;
          return { ...activityList, activities: updatedActivities, isEmpty };
        }
        return activityList;
      });
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
  }

  function renderTime() {
    if (!activity.startTime && !activity.endTime) {
      return (
        <>
          <img
            className="activity__clock-icon"
            src={clockIcon}
            alt="Clock Icon"
          />
          Add Time
        </>
      );
    }

    if (activity.startTime && !activity.endTime) {
      return (
        <div className="activity__time-chosen-colour">{activity.startTime}</div>
      );
    }

    if (activity.startTime && activity.endTime) {
      return (
        <div className="activity__time-chosen-colour">
          {activity.startTime} - {activity.endTime}
        </div>
      );
    }
  }

  return (
    <div className="activity">
      <div>
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="gray"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="activity__drag-handle-icon"
        >
          <path d="M9 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
          <path d="M9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
          <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
          <path d="M15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
          <path d="M15 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
        </svg>
      </div>
      <div className="activity__info-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="gray"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="activity__delete-icon"
          onClick={handleActivityDelete}
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        <h2 className="activity__destination">{activity.name}</h2>
        <div className="activity__time" onClick={() => setIsChoosingTime(true)}>
          {renderTime()}
        </div>
        <div className="activity__time-picker">
          {isChoosingTime && (
            <CustomTimePicker
              activity={activity}
              date={date}
              activityIndex={activityIndex}
              setIsChoosingTime={setIsChoosingTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Activity;
