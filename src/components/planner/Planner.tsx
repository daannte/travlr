import Card from "../card/Card";
import AddDayIcon from "../../assets/addDay.svg";
import StarIcon from "../../assets/star.svg";
import StarFilledIcon from "../../assets/starFilled.svg";
import "./Planner.css";
import React, { useEffect, useState } from "react";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  [key: number]: ActivityDetails[];
}

interface SavedActivities {
  [key: string]: ActivityList;
}

interface PlannerProps {
  destination: string;
  setSavedActivities: React.Dispatch<React.SetStateAction<SavedActivities>>;
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
  activityList: ActivityList;
  savedDests: string[];
}

function Planner({
  destination,
  setSavedActivities,
  setSavedDests,
  setActivityList,
  activityList,
  savedDests,
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
      const newDay = Object.keys(prevActivityList).length + 1;
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
      setSavedActivities((prevSavedActivities) => ({
        ...prevSavedActivities,
        [destination]: activityList,
      }));
    }
  }, [activityList, destination, isSaved, setSavedActivities]);

  function handleSaved() {
    setIsSaved((prevIsSaved) => !prevIsSaved);
    if (!isSaved) {
      setSavedDests((prevSavedDests) =>
        prevSavedDests.includes(destination)
          ? prevSavedDests
          : [...prevSavedDests, destination]
      );
    } else {
      setSavedActivities((prevSaved) => {
        const updatedSaved = { ...prevSaved };
        delete updatedSaved[destination];
        return updatedSaved;
      });
      setSavedDests((prevSavedDests) =>
        prevSavedDests.filter((dest) => dest !== destination)
      );
    }
  }

  return (
    <div className="planner-container">
      <div className="event-container">
        <div className="title-container">
          <h1 className="destination">{destination}</h1>{" "}
          <img
            src={isSaved ? StarFilledIcon : StarIcon}
            alt="Save"
            className="save-icon"
            onClick={handleSaved}
          />
        </div>
        <div className="cards-button-container">
          <div className="cards-container">{renderCards()}</div>
          <button className="add-icon" onClick={handleAddCard}>
            <img src={AddDayIcon} alt="Add Day" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Planner;
