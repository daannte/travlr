import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./backend/firebase";
import { fetchSavedInfo } from "./utils/firebaseUtils";
import "./App.css";

import Home from "./pages/home/Home";
import Planner from "./pages/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import Saved from "./components/saved/Saved";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

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
  const [destination, setDestination] = useState<string>("");
  const [savedDests, setSavedDests] = useState<string[]>([]);
  const [savedActivities, setSavedActivities] = useState<SavedActivities>({});
  const [activityList, setActivityList] = useState<ActivityList[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // get the destination names from the DB
  useEffect(() => {
    setUserId(auth.currentUser == null ? "" : auth.currentUser.uid);
    fetchSavedInfo(userId, setSavedDests, setSavedActivities);
  }, [userId]);

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
      userId={userId}
      setUserId={setUserId}
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
        <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/signup" element={<Signup setUserId={setUserId} />} />
      </Routes>
    </Router>
  );
}

export default App;
