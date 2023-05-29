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

interface SavedActivities {
  [key: string]: ActivityList;
}
function App() {
  const [destination, setDestination] = useState<string>("");
  const [prevDestination, setPrevDestination] = useState<string>("");
  const [savedDests, setSavedDests] = useState<string[]>([]);
  const [savedActivities, setSavedActivities] = useState<SavedActivities>({});
  const [activityList, setActivityList] = useState<ActivityList>({
    1: [{ startTime: "Start", endTime: "End", name: "Activity Name" }],
  });

  useEffect(() => {
    if (!savedDests.includes(destination) && destination !== prevDestination) {
      setActivityList({
        1: [{ startTime: "Start", endTime: "End", name: "Activity Name" }],
      });
    }
    setPrevDestination(destination);
  }, [destination, savedDests, prevDestination]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/saved"
          element={
            <Saved
              savedActivities={savedActivities}
              savedDests={savedDests}
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
              setSavedActivities={setSavedActivities}
              setSavedDests={setSavedDests}
              setActivityList={setActivityList}
              activityList={activityList}
              savedDests={savedDests}
            />
          }
        />
        <Route path="/" element={<Home setDestination={setDestination} />} />
      </Routes>
    </Router>
  );
}

export default App;
