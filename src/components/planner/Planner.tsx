import React, { useEffect, useState } from "react";
import { db, ref, set, remove } from "../../backend/firebase";
import { useNavigate } from "react-router-dom";
import Card from "../card/Card";
import StarIcon from "../../assets/star.svg";
import StarFilledIcon from "../../assets/starFilled.svg";
import "./Planner.css";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  [key: number]: ActivityDetails[];
}

interface PlannerProps {
  destination: string;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
  activityList: ActivityList;
  savedDests: string[];
  userId: string;
}

function Planner({
  destination,
  setActivityList,
  activityList,
  savedDests,
  userId,
}: PlannerProps) {
  const [isSaved, setIsSaved] = useState(savedDests.includes(destination));

  function renderCards() {
    return Object.keys(activityList).map((day) => (
      <Card
        key={day}
        day={parseInt(day)}
        setActivityList={setActivityList}
        activityList={activityList}
      />
    ));
  }

  function handleAddCard() {
    setActivityList((prevActivityList) => {
      const newDay = Object.keys(prevActivityList).length;
      const newActivityList = {
        ...prevActivityList,
        [newDay]: [
          {
            startTime: "Start",
            endTime: "End",
            name: "Activity Name",
          },
        ],
      };
      return newActivityList;
    });
  }

  useEffect(() => {
    if (isSaved) {
      set(
        ref(db, `users/${userId}/savedDestinations/${destination}`),
        activityList
      );
    }
  }, [activityList, destination, isSaved, userId]);

  const navigate = useNavigate();
  function handleSaved() {
    if (userId == "") navigate("/login");
    else {
      setIsSaved(!isSaved);
      if (isSaved) {
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
            src={isSaved ? StarFilledIcon : StarIcon}
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
