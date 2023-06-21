import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlannerContext } from "../../App";
import SavedCard from "../../components/savedCard/SavedCard";
import { SavedPlanners } from "../../types";
import "./Saved.css";

interface Props {
  savedPlanners: SavedPlanners;
  savedDests: string[];
}

function Saved({ savedDests, savedPlanners }: Props) {
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
    <div className="saved">
      <h2>Saved Itineraries</h2>
      <div className="saved__destination-list">
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
