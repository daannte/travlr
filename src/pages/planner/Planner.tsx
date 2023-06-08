import React, { useEffect } from "react";
import { db, ref, set, remove } from "../../backend/firebase";
import "./Planner.css";

import Card from "../../components/card/Card";
import StarIcon from "../../assets/star.svg";
import StarFilledIcon from "../../assets/starFilled.svg";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface PlannerProps {
  destination: string;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  activityList: ActivityList[];
  savedDests: string[];
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>;
  userId: string;
}

function Planner({
  destination,
  setActivityList,
  activityList,
  savedDests,
  setSavedDests,
  userId,
}: PlannerProps) {
  const isSaved = savedDests.includes(destination);

  function renderCards() {
    const cards = activityList.map((_, index) => {
      return (
        <Card
          key={index}
          day={index}
          setActivityList={setActivityList}
          activityList={activityList}
        />
      );
    });
    return cards;
  }

  useEffect(() => {
    if (isSaved && userId) {
      set(
        ref(db, `users/${userId}/savedDestinations/${destination}`),
        activityList
      );
    }
    localStorage.setItem("currentPlanner", JSON.stringify(activityList));
  }, [activityList, destination, isSaved, userId]);

  function handleSaved() {
    if (userId !== "") {
      const newSavedDests = savedDests.includes(destination)
        ? savedDests.filter((dest) => dest !== destination)
        : [...savedDests, destination];
      setSavedDests(newSavedDests);

      if (savedDests.includes(destination)) {
        remove(ref(db, `users/${userId}/savedDestinations/${destination}`));
      }
    }
  }

  return (
    <div className="planner-container">
      <div className="event-container">
        <div className="title-container">
          <h1 className="destination">{destination}</h1>
          <img
            src={isSaved && userId !== "" ? StarFilledIcon : StarIcon}
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
