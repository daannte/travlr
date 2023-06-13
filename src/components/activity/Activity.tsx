import { useContext, useEffect, useState } from "react";
import { PlannerContext } from "../../App";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import "./Activity.css";

import deleteIcon from "../../assets/deleteActivity.svg";
import clockIcon from "../../assets/clock.svg";

interface IFormInputs {
  startTime: string;
  endTime: string;
}

interface ActivityProps {
  day: number;
  activityIndex: number;
}

function Activity({ day, activityIndex }: ActivityProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IFormInputs>();

  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const activity = currentPlanner.activityLists[day].activities[activityIndex];
  const date = currentPlanner.activityLists[day].date;
  const [startTime, setStartTime] = useState<string>(activity.startTime);
  const [endTime, setEndTime] = useState<string>(activity.endTime);
  const [isChoosingTime, setIsChoosingTime] = useState<boolean>(false);

  useEffect(() => {
    setStartTime(activity.startTime);
    setEndTime(activity.endTime);
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
      startTime: data.startTime,
      endTime: data.endTime,
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

  function handleClear() {
    reset();
    setValue("startTime", "");
    setValue("endTime", "");
    setStartTime("");
    setEndTime("");
  }

  function startSelected() {
    if (startTime === "") return null;

    const currentDate = new Date().toDateString();
    return new Date(`${currentDate} ${startTime}`);
  }

  function endSelected() {
    if (endTime === "") return null;

    const currentDate = new Date().toDateString();
    return new Date(`${currentDate} ${endTime}`);
  }

  function validateTime(watchStarTime: string, endTime: string) {
    const endUnix = new Date(
      `${new Date().toDateString()} ${endTime}`
    ).getTime();
    const startUnix = new Date(
      `${new Date().toDateString()} ${watchStarTime}`
    ).getTime();
    if (endTime !== "" && startUnix >= endUnix) {
      return "End time must be set to a time after start time!";
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
        {!startTime && (
          <>
            <img className="clock-icon" src={clockIcon} />
            Add Time
          </>
        )}
        {startTime && !endTime && (
          <div className="time-chosen-colour">{startTime}</div>
        )}
        {startTime && endTime && (
          <div className="time-chosen-colour">
            {startTime} - {endTime}
          </div>
        )}
      </div>
      {isChoosingTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="choose-time-popup">
          <div className="time-inputs">
            <Controller
              control={control}
              name={"startTime"}
              rules={watch("endTime") !== "" ? { required: true } : {}}
              render={({ field: { onChange } }) => {
                return (
                  <DatePicker
                    onChange={(date: Date) => {
                      const formattedTime = date.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      onChange(formattedTime);
                      setStartTime(formattedTime);
                    }}
                    selected={startSelected()}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Start Time"
                    dateFormat="h:mm aa"
                    placeholderText="End"
                    onKeyDown={(e) => e.preventDefault()}
                    inline
                  />
                );
              }}
            />
            <Controller
              control={control}
              name={"endTime"}
              rules={{
                validate: (val: string) =>
                  validateTime(watch("startTime"), val),
              }}
              render={({ field: { onChange } }) => {
                return (
                  <DatePicker
                    onChange={(date: Date) => {
                      const formattedTime = date.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      onChange(formattedTime);
                      setEndTime(formattedTime);
                    }}
                    selected={endSelected()}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="End Time"
                    dateFormat="h:mm aa"
                    placeholderText="End"
                    onKeyDown={(e) => e.preventDefault()}
                    inline
                  />
                );
              }}
            />
          </div>
          <p className="time-error-message">
            {errors.startTime && "Start time needed if you choose an end time"}
            {errors.endTime && errors.endTime.message}
          </p>
          <div className="time-buttons">
            <button
              className="cancel-time-button"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
            <button className="save-time-button" type="submit">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Activity;
