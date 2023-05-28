import Home from "./components/home/Home";
import Planner from "./components/planner/Planner";
import Navbar from "./components/navbar/Navbar";
import Favourites from "./components/favourites/Favourites";
import { useState } from "react";
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

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/favourites"
          element={
            <Favourites
              favouriteActivities={favouriteActivities}
              favouriteDests={favouriteDests}
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
            />
          }
        />
        <Route path="/" element={<Home setDestination={setDestination} />} />
      </Routes>
    </Router>
  );
}

export default App;
