import React, { useEffect, useState } from "react";
import { db, ref, set, remove, auth } from "../../backend/firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Card from "../../components/card/Card";
import StarIcon from "../../assets/star.svg";
import StarFilledIcon from "../../assets/starFilled.svg";
import "./Planner.css";
import useAuth from "../../hooks/useAuth";

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
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

function Planner({
  destination,
  setActivityList,
  activityList,
  savedDests,
  userId,
  setUserId,
}: PlannerProps) {
  const [isSaved, setIsSaved] = useState(savedDests.includes(destination));

  useAuth(setUserId);

  function renderCards() {
    const cards = activityList.map((activity) => {
      return (
        <Card
          key={uuidv4()}
          currentDate={activity.date}
          setActivityList={setActivityList}
          activityList={activityList}
        />
      );
    });
    return cards;
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
    if (auth.currentUser == null) navigate("/login");
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
