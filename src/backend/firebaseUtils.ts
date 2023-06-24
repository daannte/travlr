import { onValue, ref, db } from "../backend/firebase";
import { IPlanner, SavedPlanners } from "../types";

const fetchSavedInfo = (
  userId: string,
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>,
  setSavedPlanners: React.Dispatch<React.SetStateAction<SavedPlanners>>,
  setCurrentPlanner: React.Dispatch<React.SetStateAction<IPlanner>>
) => {
  const savedDestinationsRef = ref(db, `users/${userId}/savedDestinations`);
  onValue(savedDestinationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const savedDestinationNames = Object.keys(data);
      setSavedDests(savedDestinationNames);
      setSavedPlanners(data);
    } else {
      setSavedDests([]);
      setSavedPlanners({});
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
    const currentPlannerRef = ref(
      db,
      `users/${userId}/savedDestinations/${destination}`
    );
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
