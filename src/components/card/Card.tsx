import { PlannerContext } from "../../App";
import { useContext, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import "./Card.css";

import Activity from "../activity/Activity";
import NewCardModal from "../../components/newCardModal/NewCardModal";

interface Props {
  day: number;
}

function Card({ day }: Props) {
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [activityToEdit, setActivityToEdit] = useState<number | null>(null);

  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const date = currentPlanner.activityLists[day].date;

  function handleAddCard() {
    setCurrentPlanner((prevPlanner) => {
      const updatedPlanner = { ...prevPlanner };
      const { activityLists } = updatedPlanner;
      const activityListIndex = activityLists.findIndex(
        (activityList) => activityList.date === date
      );
      if (activityListIndex !== -1) {
        const updatedActivityLists = [...activityLists];
        const currentActivities = activityLists[activityListIndex].activities;
        const updatedActivities = currentActivities
          ? [...currentActivities]
          : [];
        updatedActivities.push({
          startTime: "",
          endTime: "",
          name: "New Card",
        });
        setActivityToEdit(updatedActivities.length - 1);
        updatedActivityLists[activityListIndex] = {
          ...activityLists[activityListIndex],
          activities: updatedActivities,
          isEmpty: false,
        };
        updatedPlanner.activityLists = updatedActivityLists;
      }
      return updatedPlanner;
    });
  }

  function renderActivities() {
    const isEmpty = currentPlanner.activityLists[day].isEmpty;
    const activityList = isEmpty
      ? []
      : currentPlanner.activityLists[day].activities;

    const activitiesList = activityList.map((_, index) => {
      return (
        <Activity
          key={index}
          day={day}
          activityIndex={index}
          setActivityToEdit={setActivityToEdit}
          setShowNewModal={setShowNewModal}
        />
      );
    });
    return activitiesList;
  }

  return (
    <>
      <Droppable droppableId={`${day}`} type="group">
        {(provided) => (
          <div
            className="card"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <h1 className="card__title">{date}</h1>
            <div>{renderActivities()}</div>
            {provided.placeholder}
            <button
              className="card__new-card"
              onClick={() => {
                setShowNewModal(true);
                handleAddCard();
              }}
            >
              + New Card
            </button>
          </div>
        )}
      </Droppable>
      {showNewModal && (
        <NewCardModal
          setShowNewModal={setShowNewModal}
          day={day}
          activityToEdit={activityToEdit}
          setActivityToEdit={setActivityToEdit}
        />
      )}
    </>
  );
}

export default Card;
