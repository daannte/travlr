import { PlannerContext } from "../../App";
import { useContext } from "react";
import Activity from "../activity/Activity";
import "./Card.css";

import addActivityIcon from "../../assets/addActivity.svg";

interface CardProps {
  day: number;
}

function Card({ day }: CardProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const date = currentPlanner.activityLists[day].date;

  function handleAddActivity() {
    setCurrentPlanner((prevPlanner) => {
      const { activityLists } = prevPlanner;
      const updatedActivityLists = activityLists.map((activityList) => {
        if (activityList.date === date) {
          const updatedActivities = [
            ...activityList.activities,
            { startTime: "Start", endTime: "End", name: "Activity Name" },
          ];
          return { ...activityList, activities: updatedActivities };
        }
        return activityList;
      });
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
  }

  function renderActivities() {
    const activitiesList = currentPlanner.activityLists[day].activities.map(
      (_, index) => {
        return <Activity key={index} day={day} activityIndex={index} />;
      }
    );
    return activitiesList;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{date}</h1>
      </div>
      <div className="card-activities">{renderActivities()}</div>
      <button className="add-activity-button" onClick={handleAddActivity}>
        <img src={addActivityIcon} alt="Add Activity" />
      </button>
    </div>
  );
}

export default Card;
