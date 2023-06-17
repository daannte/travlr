import { useContext, useEffect, useState } from "react";
import { PlannerContext } from "../../App";
import TimeSelect from "../timeSelect/TimeSelect";

import deleteIcon from "../../assets/deleteActivity.svg";
import clockIcon from "../../assets/clock.svg";
import "./Activity.css";

interface IFormInputs {
  startTime: Date | null;
  endTime: Date | null;
}

interface ActivityProps {
  day: number;
  activityIndex: number;
}

function Activity({ day, activityIndex }: ActivityProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const { activityLists } = currentPlanner;
  const activityList = activityLists[day];
  const { activities, date } = activityList;
  const activity = activities[activityIndex];

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isChoosingTime, setIsChoosingTime] = useState<boolean>(false);

  useEffect(() => {
    // If the activity changes, check if it has a time set
    setStartTime(activity.startTime ? new Date(activity.startTime) : null);
    setEndTime(activity.endTime ? new Date(activity.endTime) : null);
  }, [activity]);

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

  function onSubmit(data: IFormInputs) {
    const updatedActivity = {
      ...activity,
      startTime: data.startTime ? data.startTime.toISOString() : "",
      endTime: data.endTime ? data.endTime.toISOString() : "",
    };

    setCurrentPlanner((prevPlanner) => {
      const updatedActivityLists = prevPlanner.activityLists.map(
        (activityList) => {
          if (activityList.date === date) {
            const updatedActivities = [...activityList.activities];
            updatedActivities[activityIndex] = updatedActivity;
            return { ...activityList, activities: updatedActivities };
          }
          return activityList;
        }
      );
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
    setIsChoosingTime(false);
  }

  function renderTime() {
    if (!startTime) {
      return (
        <>
          <img className="clock-icon" src={clockIcon} alt="Clock Icon" />
          Add Time
        </>
      );
    }

    if (startTime && !endTime) {
      return (
        <div className="time-chosen-colour">
          {startTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      );
    }

    if (startTime && endTime) {
      return (
        <div className="time-chosen-colour">
          {startTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {endTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      );
    }
  }

  return (
    <div className="activity-container">
      <img
        className="delete-icon"
        src={deleteIcon}
        alt="Delete Icon"
        onClick={handleActivityDelete}
      />
      <h2 className="activity-destination">{activity.name}</h2>
      <div className="activity-time" onClick={() => setIsChoosingTime(true)}>
        {renderTime()}
      </div>
      {isChoosingTime && (
        <TimeSelect
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export default Activity;
