import dayjs from "dayjs";
import customParseMoment from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseMoment);

import "./customTimePicker.css";
import { useContext, useState } from "react";
import { PlannerContext } from "../../App";
import { Activity } from "../../types";

interface Props {
  activity: Activity;
  date: string;
  activityIndex: number;
  setIsChoosingTime: React.Dispatch<React.SetStateAction<boolean>>;
}

function CustomTimePicker({
  activity,
  date,
  activityIndex,
  setIsChoosingTime,
}: Props) {
  const { setCurrentPlanner } = useContext(PlannerContext);
  const [errorMessage, setErrorMessage] = useState("");

  // Set the start of the day to 12:00 AM
  const startDayTime = dayjs().startOf("day");

  // Set it to end of the day to 11:30 PM
  const endDayTime = dayjs().endOf("day").subtract(29, "minute");

  const setTimeIntervals = () => {
    const timeIntervals: string[] = [];
    let currentTime = startDayTime.clone();

    while (currentTime.isBefore(endDayTime)) {
      timeIntervals.push(currentTime.format("h:mm A"));
      currentTime = currentTime.add(30, "minute");
    }
    return timeIntervals;
  };

  const handleTimeClick = (selectedTimeInterval: string) => {
    if (!activity.startTime) {
      setCurrentPlanner((prevPlanner) => {
        const updatedActivityLists = prevPlanner.activityLists.map(
          (activityList) => {
            if (activityList.date === date) {
              const updatedActivities = activityList.activities.map(
                (activity, index) => {
                  if (index === activityIndex) {
                    return { ...activity, startTime: selectedTimeInterval };
                  }
                  return activity;
                }
              );
              return { ...activityList, activities: updatedActivities };
            }
            return activityList;
          }
        );
        return { ...prevPlanner, activityLists: updatedActivityLists };
      });
    } else if (
      dayjs(selectedTimeInterval, "h:mm A").isBefore(
        dayjs(activity.startTime, "h:mm A")
      ) ||
      dayjs(selectedTimeInterval, "h:mm A").isSame(
        dayjs(activity.startTime, "h:mm A")
      )
    ) {
      setErrorMessage("End time must be set to a time after start time!");
    } else if (activity.startTime && !activity.endTime) {
      setErrorMessage("");
      setCurrentPlanner((prevPlanner) => {
        const updatedActivityLists = prevPlanner.activityLists.map(
          (activityList) => {
            if (activityList.date === date) {
              const updatedActivities = activityList.activities.map(
                (activity, index) => {
                  if (index === activityIndex) {
                    return { ...activity, endTime: selectedTimeInterval };
                  }
                  return activity;
                }
              );
              return { ...activityList, activities: updatedActivities };
            }
            return activityList;
          }
        );
        return { ...prevPlanner, activityLists: updatedActivityLists };
      });
    }
  };

  const handleClear = () => {
    setCurrentPlanner((prevPlanner) => {
      const updatedActivityLists = prevPlanner.activityLists.map(
        (activityList) => {
          if (activityList.date === date) {
            const updatedActivities = activityList.activities.map(
              (activity, index) => {
                if (index === activityIndex) {
                  return { ...activity, startTime: "", endTime: "" };
                }
                return activity;
              }
            );
            return { ...activityList, activities: updatedActivities };
          }
          return activityList;
        }
      );
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
  };

  return (
    <div className="time-picker">
      <div className="time-picker__header">
        <input
          className="time-picker__header-start-time"
          placeholder="Start Time"
          value={activity.startTime}
          readOnly
        />
        <input
          className="time-picker__header-end-time"
          placeholder="End Time"
          value={activity.endTime}
          readOnly
        />
      </div>
      <div className="time-picker__error">{errorMessage && errorMessage}</div>
      <div className="time-picker__times">
        {setTimeIntervals().map((timeInterval, index) => (
          <div
            className="time-picker__time"
            key={index}
            onClick={() => handleTimeClick(timeInterval)}
          >
            {timeInterval}
          </div>
        ))}
      </div>
      <div className="time-picker__buttons">
        <button
          className="time-picker__buttons-clear"
          onClick={() => handleClear()}
        >
          Clear
        </button>
        <button
          className="time-picker__buttons-save"
          onClick={() => setIsChoosingTime(false)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CustomTimePicker;
