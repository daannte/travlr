import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, onAuthStateChanged } from "./backend/firebase";
import { fetchSavedInfo } from "./backend/firebaseUtils";
import { IPlanner, TripsType } from "./types";
import "./App.css";

import Home from "./pages/home/Home";
import Planner from "./pages/planner/Planner";
import Trips from "./pages/trips/Trips";
import Navbar from "./components/navbar/Navbar";

interface PlannerContextProps {
  currentPlanner: IPlanner;
  setCurrentPlanner: React.Dispatch<React.SetStateAction<IPlanner>>;
}

export const PlannerContext = createContext<PlannerContextProps>({
  currentPlanner: {
    destination: "",
    startDate: "",
    endDate: "",
    activityLists: [],
  },
  setCurrentPlanner: () => undefined,
});

export const UserIdContext = createContext<string>("");

function createInitialPlannerState(): IPlanner {
  const localPlanner = localStorage.getItem("currentPlanner");
  return localPlanner
    ? JSON.parse(localPlanner)
    : {
        destination: "",
        startDate: "",
        endDate: "",
        activityLists: [],
      };
}

function App() {
  const [savedDests, setSavedDests] = useState<string[]>([]);
  const [trips, setTrips] = useState<TripsType>({});
  const [currentPlanner, setCurrentPlanner] = useState<IPlanner>(
    createInitialPlannerState()
  );
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const checkedLoggedIn = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchSavedInfo(user.uid, setSavedDests, setTrips, setCurrentPlanner);
      } else {
        setUserId("");
        setSavedDests([]);
        setTrips({});
      }
    });
    return () => checkedLoggedIn();
  }, []);

  const renderSavedRoute = () => (
    <Trips trips={trips} savedDests={savedDests} />
  );

  const renderPlannerRoute = () => <Planner />;

  const renderHomeRoute = () => <Home savedDests={savedDests} />;
  return (
    <Router>
      <PlannerContext.Provider value={{ currentPlanner, setCurrentPlanner }}>
        <Navbar />
        <UserIdContext.Provider value={userId}>
          <Routes>
            <Route path="/trips" element={renderSavedRoute()} />
            <Route path="/planner" element={renderPlannerRoute()} />
            <Route path="/" element={renderHomeRoute()} />
          </Routes>
        </UserIdContext.Provider>
      </PlannerContext.Provider>
    </Router>
  );
}

export default App;
