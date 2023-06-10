import { onValue, ref, db } from "../backend/firebase";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
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

const fetchSavedInfo = (
  userId: string,
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>,
  setSavedPlanners: React.Dispatch<React.SetStateAction<SavedPlanners>>
) => {
  const dataRef = ref(db, `users/${userId}/savedDestinations`);
  onValue(dataRef, (snapshot) => {
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
};

export { fetchSavedInfo };
