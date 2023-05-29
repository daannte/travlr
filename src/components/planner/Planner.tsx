import Card from "../card/Card";
import AddDayIcon from "../../assets/addDay.svg";
import HeartIcon from "../../assets/heart.svg";
import FilledHeartIcon from "../../assets/filledHeart.svg";
import "./Planner.css";
import React, { useCallback, useEffect, useState } from "react";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  [key: number]: ActivityDetails[];
}

interface FavouriteActivities {
  [key: string]: ActivityList;
}

interface PlannerProps {
  destination: string;
  setFavouriteActivities: React.Dispatch<
    React.SetStateAction<FavouriteActivities>
  >;
  setFavouriteDests: React.Dispatch<React.SetStateAction<string[]>>;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
  activityList: ActivityList;
  favouriteDests: string[];
}

function Planner({
  destination,
  setFavouriteActivities,
  setFavouriteDests,
  setActivityList,
  activityList,
  favouriteDests,
}: PlannerProps) {
  const [isSaved, setIsSaved] = useState(favouriteDests.includes(destination));

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
      return {
        ...prevActivityList,
        [newDay]: [
          {
            startTime: "Start",
            endTime: "End",
            name: "Activity Name",
          },
        ],
      };
    });
  }

  const handleFavourites = useCallback(
    (isSaved: boolean) => {
      if (isSaved) {
        setFavouriteActivities((prevFavourites: FavouriteActivities) => ({
          ...prevFavourites,
          [destination]: activityList,
        }));
        setFavouriteDests((prevFavouriteDests) =>
          prevFavouriteDests.includes(destination)
            ? prevFavouriteDests
            : [...prevFavouriteDests, destination]
        );
      } else {
        setFavouriteActivities((prevFavourites) => {
          const updatedFavourites = { ...prevFavourites };
          delete updatedFavourites[destination];
          return updatedFavourites;
        });
        setFavouriteDests((prevFavouriteDests) =>
          prevFavouriteDests.filter((dest) => dest !== destination)
        );
      }
    },
    [activityList, destination, setFavouriteActivities, setFavouriteDests]
  );

  useEffect(() => {
    if (isSaved) {
      handleFavourites(true);
    }
  }, [activityList, destination, handleFavourites, isSaved]);

  return (
    <div className="planner-container">
      <div className="event-container">
        <div className="title-container">
          <h1 className="destination">{destination}</h1>{" "}
          <img
            src={isSaved ? FilledHeartIcon : HeartIcon}
            alt="Save"
            className="save-icon"
            onClick={() => setIsSaved(!isSaved)}
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
