import Activity from "../activity/Activity";
import deleteIcon from "../../assets/delete.svg";
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
  currentDate: string;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  activityList: ActivityList[];
}

function Card({ currentDate, setActivityList, activityList }: CardProps) {
  // function handleCardDelete() {
  //   setActivityList((prevActivityList: ActivityList) => {
  //     delete prevActivityList[day];
  //     const fixedActivityList: ActivityList = {};
  //     // Reassign the keys so the numbers are back in order
  //     let i = 0;
  //     for (const key in prevActivityList) {
  //       fixedActivityList[i] = prevActivityList[key];
  //       i++;
  //     }
  //     return fixedActivityList;
  //   });
  // }
  //
  // function handleAddActivity() {
  //   setActivityList((prevActivityList: ActivityList) => {
  //     const newActivityList = { ...prevActivityList };
  //     newActivityList[day] = [
  //       ...newActivityList[day],
  //       {
  //         startTime: "Start",
  //         endTime: "End",
  //         name: "Activity Name",
  //       },
  //     ];
  //     return newActivityList;
  //   });
  // }
  //
  // function renderActivites() {
  //   return activityList[day].map((_, index: number) => {
  //     return (
  //       <Activity
  //         key={index}
  //         day={day}
  //         index={index}
  //         setActivityList={setActivityList}
  //         activityList={activityList}
  //       />
  //     );
  //   });
  // }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{currentDate}</h1>
        <button className="delete-card-button" /* onClick={handleCardDelete} */>
          <img src={deleteIcon} alt="Delete Card" />
        </button>
      </div>
      <div className="card-activities">{/* {renderActivites()} */}</div>
      <button className="add-activity-button" /* onClick={handleAddActivity} */>
        <img src={addActivityIcon} alt="Add Activity" />
      </button>
    </div>
  );
}

export default Card;
