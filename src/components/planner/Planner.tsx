import Card from "../card/Card";
import AddDayIcon from "../../assets/addDay.svg";
import HeartIcon from "../../assets/heart.svg";
import FilledHeartIcon from "../../assets/filledHeart.svg";
import "./Planner.css";
import { useCallback, useEffect, useState } from "react";

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
}

function Planner({
  destination,
  setFavouriteActivities,
  setFavouriteDests,
}: PlannerProps) {
  const [activityList, setActivityList] = useState<ActivityList>({
    1: [{ startTime: "Start", endTime: "End", name: "Activity Name" }],
  });
  const [isSaved, setIsSaved] = useState(false);

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

  const handleFavorites = useCallback(() => {
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
    }
  }, [
    activityList,
    destination,
    isSaved,
    setFavouriteActivities,
    setFavouriteDests,
  ]);

  useEffect(() => {
    handleFavorites();
  }, [handleFavorites]);

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
