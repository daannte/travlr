import Home from "./pages/home/Home";
import Planner from "./pages/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import Saved from "./components/saved/Saved";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { db, ref, onValue, auth } from "./backend/firebase";
import "./App.css";

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // get the destination names from the DB
  useEffect(() => {
    setUserId(auth.currentUser == null ? "" : auth.currentUser.uid);
    const dataRef = ref(db, `users/${userId}/savedDestinations`);
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const savedDestinationNames = Object.keys(data);
        setSavedDests(savedDestinationNames);
        setSavedActivities(data);
      } else {
        // Set it to blank if data is null
        setSavedDests([]);
        setSavedActivities({});
      }
    });
  }, [userId]);

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
              setActivityList={setActivityList}
              activityList={activityList}
              savedDests={savedDests}
              userId={userId}
              setUserId={setUserId}
            />
          }
        />
        <Route
          path="/"
          element={
            <Home
              setDestination={setDestination}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
              setActivityList={setActivityList}
              destination={destination}
              savedDests={savedDests}
            />
          }
        />
        <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/signup" element={<Signup setUserId={setUserId} />} />
      </Routes>
    </Router>
  );
}

export default App;
