import { ChangeEvent, useContext } from "react";
import { PlannerContext } from "../../App";
import "./NewCardModal.css";

import closeIcon from "../../assets/close.svg";
import deleteIcon from "../../assets/trash.svg";

interface Props {
  setShowNewModal: React.Dispatch<React.SetStateAction<boolean>>;
  day: number;
  activityToEdit: number | null;
  setActivityToEdit: React.Dispatch<React.SetStateAction<number | null>>;
}

function NewCardModal({
  setShowNewModal,
  day,
  activityToEdit,
  setActivityToEdit,
}: Props) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activityToEdit !== null) {
      setCurrentPlanner((prevPlanner) => {
        const updatedPlanner = { ...prevPlanner };
        updatedPlanner.activityLists[day].activities[activityToEdit].name =
          e.target.value;
        return updatedPlanner;
      });
    }
  };

  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentPlanner((prevPlanner) => {
      const updatedPlanner = { ...prevPlanner };

      if (e.target.name === "start-time" && activityToEdit !== null) {
        updatedPlanner.activityLists[day].activities[activityToEdit].startTime =
          e.target.value;
      } else if (e.target.name === "end-time" && activityToEdit !== null) {
        updatedPlanner.activityLists[day].activities[activityToEdit].endTime =
          e.target.value;
      }

      return updatedPlanner;
    });
  }

  function handleDeleteCard() {
    setCurrentPlanner((prevPlanner) => {
      const { activityLists } = prevPlanner;
      const date = activityLists[day].date;
      const updatedActivityLists = activityLists.map((activityList) => {
        if (activityList.date === date) {
          const updatedActivities = activityList.activities.filter(
            (_, index) => index !== activityToEdit
          );
          const isEmpty = updatedActivities.length === 0;
          // Set edit activity index to null after we delete the activity
          setActivityToEdit(null);
          setShowNewModal(false);
          return { ...activityList, activities: updatedActivities, isEmpty };
        }
        return activityList;
      });
      return { ...prevPlanner, activityLists: updatedActivityLists };
    });
  }

  return (
    <div className="new-card-modal">
      <img
        className="new-card-modal__close-icon"
        src={closeIcon}
        onClick={() => setShowNewModal(false)}
      />
      <img
        className="new-card-modal__delete-icon"
        src={deleteIcon}
        onClick={handleDeleteCard}
      />
      <input
        className="new-card-modal__input-name"
        defaultValue={
          activityToEdit !== null
            ? currentPlanner.activityLists[day].activities[activityToEdit].name
            : "Name"
        }
        onChange={handleCardNameChange}
      />
      <div className="new-card-modal__time-select">
        <div className="new-card-modal__time-start">
          Start:
          <input
            name="start-time"
            type="time"
            defaultValue={
              activityToEdit !== null
                ? currentPlanner.activityLists[day].activities[activityToEdit]
                    .startTime
                : ""
            }
            onChange={handleTimeChange}
            className="new-card-modal__choose-time"
          />
        </div>
        <div className="new-card-modal__time-end">
          End:
          <input
            name="end-time"
            type="time"
            defaultValue={
              activityToEdit !== null
                ? currentPlanner.activityLists[day].activities[activityToEdit]
                    .endTime
                : ""
            }
            onChange={handleTimeChange}
            className="new-card-modal__choose-time"
          />
        </div>
      </div>
    </div>
  );
}

export default NewCardModal;
