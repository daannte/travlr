import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlannerContext } from "../../App";
import SavedCard from "../../components/savedCard/SavedCard";
import "./Saved.css";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
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

interface SavedProps {
  savedPlanners: SavedPlanners;
  savedDests: string[];
}

function Saved({ savedDests, savedPlanners }: SavedProps) {
  const { setCurrentPlanner } = useContext(PlannerContext);
  const navigate = useNavigate();
  const loadItinerary = (destination: string) => {
    // Update all the values when we want to load a saved destination
    setCurrentPlanner(savedPlanners[destination]);
    localStorage.setItem(
      "currentPlanner",
      JSON.stringify(savedPlanners[destination])
    );
    navigate("/planner");
  };

  return (
    <div className="saved-container">
      <h2>Saved Itineraries</h2>
      <div className="destination-list">
        {savedDests.map((destination, index) => (
          <SavedCard
            key={index}
            destination={destination}
            savedPlanners={savedPlanners}
            loadItinerary={loadItinerary}
          />
        ))}
      </div>
    </div>
  );
}

export default Saved;
