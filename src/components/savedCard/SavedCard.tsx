import { db, ref, remove } from "../../backend/firebase";
import { UserIdContext } from "../../App";
import { useContext } from "react";
import "./SavedCard.css";

import closeIcon from "../../assets/close.svg";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
  isEmpty: boolean;
}

interface IPlanner {
  destination: string;
  startDate: string;
  endDate: string;
  activityLists: ActivityList[];
}

interface SavedPlanners {
  [key: string]: IPlanner;
}

interface SavedCardProps {
  destination: string;
  savedPlanners: SavedPlanners;
  loadItinerary: (destination: string) => void;
}

function SavedCard({
  destination,
  savedPlanners,
  loadItinerary,
}: SavedCardProps) {
  const startDate = savedPlanners[destination].startDate;
  const endDate = savedPlanners[destination].endDate;
  const userId = useContext(UserIdContext);

  function handleUnfavouriteClick(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    e.stopPropagation();
    remove(ref(db, `users/${userId}/savedDestinations/${destination}`));
  }

  return (
    <div
      className="saved-card-container"
      onClick={() => loadItinerary(destination)}
    >
      <div className="saved-card-info">
        <p className="saved-card-destination">{destination}</p>
        <p className="saved-card-date">
          {startDate} - {endDate}
        </p>
      </div>
      <img
        className="saved-card-icon"
        src={closeIcon}
        alt="Unfavourite"
        onClick={handleUnfavouriteClick}
      />
    </div>
  );
}

export default SavedCard;
