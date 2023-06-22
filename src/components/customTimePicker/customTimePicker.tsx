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
  const [isChoosingStartTime, setIsChoosingStartTime] = useState<boolean>(true);
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

  const handleStartTimeClick = (selectedTimeInterval: string) => {
    setIsChoosingStartTime(false);
    setCurrentPlanner((prevPlanner) => {
      const updatedActivityLists = prevPlanner.activityLists.map(
        (activityList) => {
          if (activityList.date === date) {
            const updatedActivities = activityList.activities.map(
              (activity, index) => {
                if (index === activityIndex) {
                  return {
                    ...activity,
                    startTime: selectedTimeInterval,
                  };
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

  const handleEndTimeClick = (selectedTimeInterval: string) => {
    if (
      dayjs(selectedTimeInterval, "h:mm A").isBefore(
        dayjs(activity.startTime, "h:mm A")
      )
    ) {
      setErrorMessage("End time must be set to a time after the start time!");
    } else {
      setErrorMessage("");
      setIsChoosingStartTime(true);
      setCurrentPlanner((prevPlanner) => {
        const updatedActivityLists = prevPlanner.activityLists.map(
          (activityList) => {
            if (activityList.date === date) {
              const updatedActivities = activityList.activities.map(
                (activity, index) => {
                  if (index === activityIndex) {
                    return {
                      ...activity,
                      endTime: selectedTimeInterval,
                    };
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
          className={`time-picker__header-start-time ${
            isChoosingStartTime
              ? "time-picker__header-start-time--outline"
              : null
          }`}
          placeholder="Start Time"
          value={activity.startTime}
          onClick={() => setIsChoosingStartTime(true)}
          readOnly
        />
        <input
          className={`time-picker__header-end-time ${
            !isChoosingStartTime
              ? "time-picker__header-end-time--outline"
              : null
          }`}
          placeholder="End Time"
          value={activity.endTime}
          onClick={() => setIsChoosingStartTime(false)}
          readOnly
        />
      </div>
      <div className="time-picker__error">{errorMessage && errorMessage}</div>
      {isChoosingStartTime ? (
        <div className="time-picker__times">
          {setTimeIntervals().map((timeInterval, index) => (
            <div
              className={`time-picker__time ${
                timeInterval === activity.startTime
                  ? "time-picker__time--selected"
                  : null
              }`}
              key={index}
              onClick={() => handleStartTimeClick(timeInterval)}
            >
              {timeInterval}
            </div>
          ))}
        </div>
      ) : null}
      {!isChoosingStartTime ? (
        <div className="time-picker__times">
          {setTimeIntervals().map((timeInterval, index) => (
            <div
              className={`time-picker__time ${
                timeInterval === activity.endTime
                  ? "time-picker__time--selected"
                  : null
              }`}
              key={index}
              onClick={() => handleEndTimeClick(timeInterval)}
            >
              {timeInterval}
            </div>
          ))}
        </div>
      ) : null}
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
