import "./Saved.css";
import { useNavigate } from "react-router-dom";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface SavedActivities {
  [key: string]: ActivityList[];
}

interface SavedProps {
  savedActivities: SavedActivities;
  savedDests: string[];
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
}

function Saved({
  savedActivities,
  savedDests,
  setActivityList,
  setDestination,
}: SavedProps) {
  const navigate = useNavigate();
  const loadItinerary = (destination: string) => {
    setDestination(destination);
    setActivityList(savedActivities[destination]);
    navigate("/planner");
  };

  return (
    <div className="saved-container">
      <h2>Saved Itineraries</h2>
      <div className="destination-list">
        {savedDests.map((destination, index) => (
          <div key={index} className="saved-destination">
            {`>>`}
            <p className="destination-name">{destination}</p>
            <button
              className="load-button"
              onClick={() => loadItinerary(destination)}
            >
              Load Itinerary
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Saved;
