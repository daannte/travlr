import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlannerContext } from "../../App";
import TripsCard from "../../components/tripsCard/TripsCard";
import { TripsType } from "../../types";
import "./Trips.css";

interface Props {
  trips: TripsType;
  savedDests: string[];
}

function Trips({ trips, savedDests }: Props) {
  const { setCurrentPlanner } = useContext(PlannerContext);
  const navigate = useNavigate();

  const loadItinerary = (destination: string) => {
    // Update all the values when we want to load a saved destination
    setCurrentPlanner(trips[destination]);
    localStorage.setItem("currentPlanner", JSON.stringify(trips[destination]));
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
            trips={trips}
            loadItinerary={loadItinerary}
          />
        ))}
      </div>
    </div>
  );
}

export default Trips;
