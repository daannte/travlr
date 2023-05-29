import Home from "./components/home/Home";
import Planner from "./components/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import Saved from "./components/saved/Saved";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

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
function App() {
  const [destination, setDestination] = useState<string>("");
  const [favouriteDests, setFavouriteDests] = useState<string[]>([]);
  const [favouriteActivities, setFavouriteActivities] =
    useState<FavouriteActivities>({});
  const [activityList, setActivityList] = useState<ActivityList>({});

  useEffect(() => {
    if (!favouriteDests.includes(destination)) {
      setActivityList({
        1: [{ startTime: "Start", endTime: "End", name: "Activity Name" }],
      });
    }
  }, [destination, favouriteDests]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/saved"
          element={
            <Saved
              favouriteActivities={favouriteActivities}
              favouriteDests={favouriteDests}
              setActivityList={setActivityList}
              setDestination={setDestination}
            />
          }
        />
        <Route
          path="/planner"
          element={
            <Planner
              destination={destination}
              setFavouriteActivities={setFavouriteActivities}
              setFavouriteDests={setFavouriteDests}
              setActivityList={setActivityList}
              activityList={activityList}
              favouriteDests={favouriteDests}
            />
          }
        />
        <Route path="/" element={<Home setDestination={setDestination} />} />
      </Routes>
    </Router>
  );
}

export default App;
