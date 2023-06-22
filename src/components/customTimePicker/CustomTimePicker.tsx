import dayjs from "dayjs";
import customParseMoment from "dayjs/plugin/customParseFormat";
import { useContext, useState } from "react";
import { PlannerContext } from "../../App";
import { Activity, IPlanner } from "../../types";
import "./CustomTimePicker.css";

dayjs.extend(customParseMoment);

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

  const startDayTime = dayjs().startOf("day");
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

  const updateActivityLists = (
    prevPlanner: IPlanner,
    date: string,
    activityIndex: number,
    updatedProperties: { startTime?: string; endTime?: string }
  ) => {
    return prevPlanner.activityLists.map((activityList) => {
      if (activityList.date === date) {
        const updatedActivities = activityList.activities.map(
          (activity, index) => {
            if (index === activityIndex) {
              return { ...activity, ...updatedProperties };
            }
            return activity;
          }
        );
        return { ...activityList, activities: updatedActivities };
      }
      return activityList;
    });
  };

  const handleStartTimeClick = (selectedTimeInterval: string) => {
    if (
      dayjs(selectedTimeInterval, "h:mm A").isAfter(
        dayjs(activity.endTime, "h:mm A")
      ) ||
      dayjs(selectedTimeInterval, "h:mm A").isSame(
        dayjs(activity.endTime, "h:mm A")
      )
    ) {
      setErrorMessage("Start time must be set to a time before the end time!");
    } else {
      setErrorMessage("");
      setIsChoosingStartTime(false);
      setCurrentPlanner((prevPlanner) => {
        const updatedActivityLists = updateActivityLists(
          prevPlanner,
          date,
          activityIndex,
          { startTime: selectedTimeInterval }
        );
        return { ...prevPlanner, activityLists: updatedActivityLists };
      });
    }
  };

  const handleEndTimeClick = (selectedTimeInterval: string) => {
    if (
      dayjs(selectedTimeInterval, "h:mm A").isBefore(
        dayjs(activity.startTime, "h:mm A")
      ) ||
      dayjs(selectedTimeInterval, "h:mm A").isSame(
        dayjs(activity.startTime, "h:mm A")
      )
    ) {
      setErrorMessage("End time must be set to a time after the start time!");
    } else {
      setErrorMessage("");
      setIsChoosingStartTime(true);
      setCurrentPlanner((prevPlanner) => {
        const updatedActivityLists = updateActivityLists(
          prevPlanner,
          date,
          activityIndex,
          { endTime: selectedTimeInterval }
        );
        return { ...prevPlanner, activityLists: updatedActivityLists };
      });
    }
  };

  const handleClear = () => {
    setCurrentPlanner((prevPlanner) => {
      const updatedActivityLists = updateActivityLists(
        prevPlanner,
        date,
        activityIndex,
        { startTime: "", endTime: "" }
      );
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
  };

  return (
    <div className="time-picker">
      <div className="time-picker__header">
        <input
          className={`time-picker__header-start-time ${
            isChoosingStartTime ? "time-picker__header-start-time--outline" : ""
          }`}
          placeholder="Start Time"
          value={activity.startTime}
          onClick={() => {
            setIsChoosingStartTime(true);
            setErrorMessage("");
          }}
          readOnly
        />
        <input
          className={`time-picker__header-end-time ${
            !isChoosingStartTime ? "time-picker__header-end-time--outline" : ""
          }`}
          placeholder="End Time"
          value={activity.endTime}
          onClick={() => {
            setIsChoosingStartTime(false);
            setErrorMessage("");
          }}
          readOnly
        />
      </div>
      {errorMessage && <div className="time-picker__error">{errorMessage}</div>}
      {isChoosingStartTime && (
        <div className="time-picker__times">
          {setTimeIntervals().map((timeInterval, index) => (
            <div
              className={`time-picker__time ${
                timeInterval === activity.startTime
                  ? "time-picker__time--selected"
                  : ""
              }`}
              key={index}
              onClick={() => handleStartTimeClick(timeInterval)}
            >
              {timeInterval}
            </div>
          ))}
        </div>
      )}
      {!isChoosingStartTime && (
        <div className="time-picker__times">
          {setTimeIntervals().map((timeInterval, index) => (
            <div
              className={`time-picker__time ${
                timeInterval === activity.endTime
                  ? "time-picker__time--selected"
                  : ""
              }`}
              key={index}
              onClick={() => handleEndTimeClick(timeInterval)}
            >
              {timeInterval}
            </div>
          ))}
        </div>
      )}
      <div className="time-picker__buttons">
        <button className="time-picker__buttons-clear" onClick={handleClear}>
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
