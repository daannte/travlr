import { onValue, ref, db } from "../backend/firebase";
import { IPlanner, TripsType } from "../types";

const fetchSavedInfo = (
  userId: string,
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>,
  setTrips: React.Dispatch<React.SetStateAction<TripsType>>,
  setCurrentPlanner: React.Dispatch<React.SetStateAction<IPlanner>>
) => {
  const tripsRef = ref(db, `users/${userId}/trips`);
  onValue(tripsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const tripsNames = Object.keys(data);
      setSavedDests(tripsNames);
      setTrips(data);
    } else {
      setSavedDests([]);
      setTrips({});
    }
  });

  const localPlanner = localStorage.getItem("currentPlanner");
  let destination = null;
  if (localPlanner) {
    const localPlannerData = JSON.parse(localPlanner);
    if (localPlannerData.destination) {
      destination = localPlannerData.destination;
    }
  }

  if (destination) {
    const currentPlannerRef = ref(db, `users/${userId}/trips/${destination}`);
    onValue(currentPlannerRef, (snapshot) => {
      const currentPlannerData = snapshot.val();
      if (currentPlannerData) {
        setCurrentPlanner(currentPlannerData);
        localStorage.setItem(
          "currentPlanner",
          JSON.stringify(currentPlannerData)
        );
      }
    });
  }
};

export { fetchSavedInfo };
