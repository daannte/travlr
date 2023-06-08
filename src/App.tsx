import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, onAuthStateChanged } from "./backend/firebase";
import { fetchSavedInfo } from "./utils/firebaseUtils";
import "./App.css";

import Home from "./pages/home/Home";
import Planner from "./pages/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import Saved from "./components/saved/Saved";

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

function App() {
  const [destination, setDestination] = useState<string>(() => {
    const currentDestination = localStorage.getItem("destination");
    return currentDestination ? currentDestination : "";
  });
  const [savedDests, setSavedDests] = useState<string[]>([]);
  const [savedActivities, setSavedActivities] = useState<SavedActivities>({});
  const [activityList, setActivityList] = useState<ActivityList[]>(() => {
    const currentPlanner = localStorage.getItem("currentPlanner");
    return currentPlanner ? JSON.parse(currentPlanner) : [];
  });
  const [userId, setUserId] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        setUserId(userId);
        fetchSavedInfo(userId, setSavedDests, setSavedActivities);
      } else {
        setUserId("");
      }
    });

    return () => unsubscribe();
  }, []);

  const renderSavedRoute = () => (
    <Saved
      savedActivities={savedActivities}
      savedDests={savedDests}
      setActivityList={setActivityList}
      setDestination={setDestination}
    />
  );

  const renderPlannerRoute = () => (
    <Planner
      destination={destination}
      setActivityList={setActivityList}
      activityList={activityList}
      savedDests={savedDests}
      setSavedDests={setSavedDests}
      userId={userId}
    />
  );

  const renderHomeRoute = () => (
    <Home
      setDestination={setDestination}
      setDateRange={setDateRange}
      dateRange={dateRange}
      setActivityList={setActivityList}
      destination={destination}
      savedDests={savedDests}
    />
  );
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/saved" element={renderSavedRoute()} />
        <Route path="/planner" element={renderPlannerRoute()} />
        <Route path="/" element={renderHomeRoute()} />
      </Routes>
    </Router>
  );
}

export default App;
