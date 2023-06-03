import Activity from "../activity/Activity";
import addActivityIcon from "../../assets/addActivity.svg";
import "./Card.css";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface CardProps {
  day: number;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  activityList: ActivityList[];
}

function Card({ day, setActivityList, activityList }: CardProps) {
  const currentDate = activityList[day].date;

  function handleAddActivity() {
    setActivityList((prevActivityList: ActivityList[]) => {
      const updatedActivityList = prevActivityList.map((item) => {
        if (item.date === currentDate) {
          return {
            ...item,
            activities: [
              ...item.activities,
              { startTime: "Start", endTime: "End", name: "Activity Name" },
            ],
          };
        }
        return item;
      });
      return updatedActivityList;
    });
  }

  function renderActivities() {
    const activitiesList = activityList[day].activities.map((_, index) => {
      return (
        <Activity
          key={index}
          day={day}
          activityIndex={index}
          setActivityList={setActivityList}
          activityList={activityList}
        />
      );
    });
    return activitiesList;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{currentDate}</h1>
      </div>
      <div className="card-activities">{renderActivities()}</div>
      <button className="add-activity-button" onClick={handleAddActivity}>
        <img src={addActivityIcon} alt="Add Activity" />
      </button>
    </div>
  );
}

export default Card;
