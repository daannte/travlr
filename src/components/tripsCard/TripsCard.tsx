import { db, ref, remove } from "../../backend/firebase";
import { UserIdContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { SavedPlanners } from "../../types";
import "./TripsCard.css";

import closeIcon from "../../assets/close.svg";
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

interface Props {
  destination: string;
  savedPlanners: SavedPlanners;
  loadItinerary: (destination: string) => void;
}

function TripsCard({ destination, savedPlanners, loadItinerary }: Props) {
  const userId = useContext(UserIdContext);

  const startDate = savedPlanners[destination].startDate;
  const endDate = savedPlanners[destination].endDate;
  const [destinationImage, setDestinationImage] = useState<string>("");

  function handleDeleteClick(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    e.stopPropagation();
    remove(ref(db, `users/${userId}/savedDestinations/${destination}`));
  }

  useEffect(() => {
    if (!destinationImage) {
      const fetchDestinationImage = async () => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${destination}&client_id=${UNSPLASH_API_KEY}`
          );
          const data = await response.json();
          // Get a random image from the 10 results
          const image =
            data.results[Math.floor(Math.random() * 10)]?.urls.regular || "";
          setDestinationImage(image);
        } catch (error) {
          console.log("Error fetching destination image:", error);
        }
      };
      fetchDestinationImage();
    }
  }, [destination, destinationImage]);

  return (
    <div className="trips-card" onClick={() => loadItinerary(destination)}>
      <img
        className="trips-card__image"
        src={destinationImage}
        alt="Destination Image"
      />
      <img
        className="trips-card__delete-icon"
        src={closeIcon}
        alt="Delete"
        onClick={handleDeleteClick}
      />
      <div className="trips-card__info">
        <h2 className="trips-card__destination">{destination}</h2>
        <p className="trips-card__date">
          {startDate} - {endDate}
        </p>
      </div>
    </div>
  );
}

export default TripsCard;
