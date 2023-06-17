import { useContext, useEffect, useState } from "react";
import { PlannerContext } from "../../App";
import { Draggable } from "@hello-pangea/dnd";
import TimeSelect from "../timeSelect/TimeSelect";
import "./Activity.css";

import clockIcon from "../../assets/clock.svg";

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
          {startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      );
    }

    if (startTime && endTime) {
      return (
        <div className="time-chosen-colour">
          {startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {endTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      );
    }
  }

  return (
    <Draggable
      draggableId={`drag-${day}-${activityIndex}`}
      index={activityIndex}
    >
      {(provided) => (
        <div
          className="activity-container"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div {...provided.dragHandleProps}>
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
              className="drag-handle-icon"
            >
              <path d="M9 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
              <path d="M9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
              <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
              <path d="M15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
              <path d="M15 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
            </svg>
          </div>
          <div className="activity-info-container">
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
              className="delete-icon"
              onClick={handleActivityDelete}
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <h2 className="activity-destination">{activity.name}</h2>
            <div
              className="activity-time"
              onClick={() => setIsChoosingTime(true)}
            >
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
        </div>
      )}
    </Draggable>
  );
}

export default Activity;
