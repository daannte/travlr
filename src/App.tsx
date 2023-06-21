import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, onAuthStateChanged } from "./backend/firebase";
import { fetchSavedInfo } from "./backend/firebaseUtils";
import "./App.css";

import Home from "./pages/home/Home";
import Planner from "./pages/planner/Planner";
import Saved from "./pages/saved/Saved";
import Navbar from "./components/navbar/Navbar";

interface Activity {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: Activity[];
  isEmpty: boolean;
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
  const [savedPlanners, setSavedPlanners] = useState<SavedPlanners>({});
  const [currentPlanner, setCurrentPlanner] = useState<IPlanner>(
    createInitialPlannerState()
  );
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const checkedLoggedIn = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchSavedInfo(
          user.uid,
          setSavedDests,
          setSavedPlanners,
          setCurrentPlanner
        );
      } else {
        setUserId("");
        setSavedDests([]);
        setSavedPlanners({});
      }
    });

    return () => checkedLoggedIn();
  }, []);

  const renderSavedRoute = () => (
    <Saved savedPlanners={savedPlanners} savedDests={savedDests} />
  );

  const renderPlannerRoute = () => (
    <Planner savedDests={savedDests} setSavedDests={setSavedDests} />
  );

  const renderHomeRoute = () => <Home savedDests={savedDests} />;
  return (
    <Router>
      <Navbar />
      <PlannerContext.Provider value={{ currentPlanner, setCurrentPlanner }}>
        <UserIdContext.Provider value={userId}>
          <Routes>
            <Route path="/saved" element={renderSavedRoute()} />
            <Route path="/planner" element={renderPlannerRoute()} />
            <Route path="/" element={renderHomeRoute()} />
          </Routes>
        </UserIdContext.Provider>
      </PlannerContext.Provider>
    </Router>
  );
}

export default App;
