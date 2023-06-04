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

interface SavedActivities {
  [key: string]: ActivityList[];
}

const fetchSavedInfo = (
  userId: string,
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>,
  setSavedActivities: React.Dispatch<React.SetStateAction<SavedActivities>>
) => {
  const dataRef = ref(db, `users/${userId}/savedDestinations`);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const savedDestinationNames = Object.keys(data);
      setSavedDests(savedDestinationNames);
      setSavedActivities(data);
    } else {
      setSavedDests([]);
      setSavedActivities({});
    }
  });
};

export { fetchSavedInfo };
