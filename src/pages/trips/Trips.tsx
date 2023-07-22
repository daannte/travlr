import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlannerContext } from "../../App";
import TripsCard from "../../components/tripsCard/TripsCard";
import { SavedPlanners } from "../../types";
import "./Trips.css";

interface Props {
  savedPlanners: SavedPlanners;
  savedDests: string[];
}

function Trips({ savedDests, savedPlanners }: Props) {
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
    <div className="trips">
      <h2 className="trips__upcoming">Upcoming Trips</h2>
      <div className="trips__cards">
        {savedDests.map((destination, index) => (
          <TripsCard
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

export default Trips;
