import { db, ref, remove } from "../../backend/firebase";
import { UserIdContext } from "../../App";
import { useContext } from "react";
import { SavedPlanners } from "../../types";
import "./SavedCard.css";

import closeIcon from "../../assets/close.svg";

interface Props {
  destination: string;
  savedPlanners: SavedPlanners;
  loadItinerary: (destination: string) => void;
}

function SavedCard({ destination, savedPlanners, loadItinerary }: Props) {
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
    <div className="saved-card" onClick={() => loadItinerary(destination)}>
      <div className="saved-card__info">
        <p className="saved-card__destination">{destination}</p>
        <p className="saved-card__date">
          {startDate} - {endDate}
        </p>
      </div>
      <img
        className="saved-card__delete-icon"
        src={closeIcon}
        alt="Unfavourite"
        onClick={handleUnfavouriteClick}
      />
    </div>
  );
}

export default SavedCard;
