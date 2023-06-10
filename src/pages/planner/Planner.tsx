import React, { useContext, useEffect } from "react";
import { db, ref, set, remove } from "../../backend/firebase";
import { PlannerContext, UserIdContext } from "../../App";
import "./Planner.css";

import Card from "../../components/card/Card";
import starIcon from "../../assets/star.svg";
import starFilledIcon from "../../assets/starFilled.svg";

interface PlannerProps {
  savedDests: string[];
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>;
}

function Planner({ savedDests, setSavedDests }: PlannerProps) {
  const { currentPlanner } = useContext(PlannerContext);
  const userId = useContext(UserIdContext);
  const isSaved = savedDests.includes(currentPlanner.destination);

  function renderCards() {
    const cards = currentPlanner.activityLists.map((_, index) => {
      return <Card key={index} day={index} />;
    });
    return cards;
  }

  useEffect(() => {
    if (isSaved && userId) {
      set(
        ref(
          db,
          `users/${userId}/savedDestinations/${currentPlanner.destination}`
        ),
        currentPlanner
      );
    }
    localStorage.setItem("currentPlanner", JSON.stringify(currentPlanner));
  }, [isSaved, userId, currentPlanner]);

  function handleSaved() {
    if (userId !== "") {
      const newSavedDests = savedDests.includes(currentPlanner.destination)
        ? savedDests.filter((dest) => dest !== currentPlanner.destination)
        : [...savedDests, currentPlanner.destination];
      setSavedDests(newSavedDests);

      if (savedDests.includes(currentPlanner.destination)) {
        remove(
          ref(
            db,
            `users/${userId}/savedDestinations/${currentPlanner.destination}`
          )
        );
      }
    }
  }

  return (
    <div className="planner-container">
      <div className="event-container">
        <div className="title-container">
          <h1 className="destination">{currentPlanner.destination}</h1>
          <img
            src={isSaved && userId !== "" ? starFilledIcon : starIcon}
            alt="Save"
            className="save-icon"
            onClick={handleSaved}
          />
        </div>
        <div className="cards-button-container">
          <div className="cards-container">{renderCards()}</div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
