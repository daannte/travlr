import { PlannerContext } from "../../App";
import { useContext, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Activity from "../activity/Activity";
import "./Card.css";

import featherMapPin from "../../assets/feather-map-pin.svg";

interface CardProps {
  day: number;
}

function Card({ day }: CardProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const [activityName, setActivityName] = useState("");
  const date = currentPlanner.activityLists[day].date;

  function handleAddActivity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurrentPlanner((prevPlanner) => {
      const { activityLists } = prevPlanner;
      const updatedActivityLists = activityLists.map((activityList) => {
        if (activityList.date === date) {
          const updatedActivities = activityList.activities || [];
          updatedActivities.push({
            startTime: "",
            endTime: "",
            name: activityName,
          });
          return {
            ...activityList,
            activities: updatedActivities,
            isEmpty: false,
          };
        }
        return activityList;
      });
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
    setActivityName("");
  }

  function renderActivities() {
    const isEmpty = currentPlanner.activityLists[day].isEmpty;
    const activityList = isEmpty
      ? []
      : currentPlanner.activityLists[day].activities;

    const activitiesList = activityList.map((_, index) => {
      return <Activity key={index} day={day} activityIndex={index} />;
    });
    return activitiesList;
  }

  return (
    <Droppable droppableId={`${day}`} type="group">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="card">
            <h1 className="card-title">{date}</h1>
            <div>{renderActivities()}</div>
            {provided.placeholder}
            <form
              className="card-activity-name-container"
              onSubmit={handleAddActivity}
            >
              <img src={featherMapPin} alt="Map Pin" />
              <input
                className="card-activity-name-input"
                value={activityName}
                type="text"
                placeholder="Add Activity"
                onChange={(e) => setActivityName(e.target.value)}
              />
            </form>
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default Card;
