import { useContext } from "react";
import { PlannerContext } from "../../App";
import { Draggable } from "@hello-pangea/dnd";
import "./Activity.css";

interface Props {
  day: number;
  activityIndex: number;
  setActivityToEdit: React.Dispatch<React.SetStateAction<number | null>>;
  setShowNewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function Activity({
  day,
  activityIndex,
  setActivityToEdit,
  setShowNewModal,
}: Props) {
  const { currentPlanner } = useContext(PlannerContext);
  const { activityLists } = currentPlanner;
  const activityList = activityLists[day];
  const { activities } = activityList;
  const activity = activities[activityIndex];

  function convertTo12HourFormat(time: string) {
    const [hours, minutes] = time.split(":");
    let period = "AM";

    let hours12 = parseInt(hours, 10);
    if (hours12 === 0) {
      hours12 = 12;
    } else if (hours12 === 12) {
      period = "PM";
    } else if (hours12 > 12) {
      hours12 -= 12;
      period = "PM";
    }

    return `${hours12}:${minutes} ${period}`;
  }

  function renderTime() {
    if (activity.startTime && !activity.endTime) {
      return (
        <div className="activity__time-chosen-colour">
          {convertTo12HourFormat(activity.startTime)}
        </div>
      );
    }

    if (activity.startTime && activity.endTime) {
      return (
        <div className="activity__time-chosen-colour">
          {convertTo12HourFormat(activity.startTime)} -{" "}
          {convertTo12HourFormat(activity.endTime)}
        </div>
      );
    }
  }

  return (
    <Draggable
      draggableId={`drag-${day}-${activityIndex}`}
      index={activityIndex}
    >
      {(provided) => (
        <div
          className="activity"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => {
            setActivityToEdit(activityIndex);
            setShowNewModal((prevShow) => !prevShow);
          }}
        >
          <div className="activity__info-container">
            <h2 className="activity__destination">{activity.name}</h2>
            <div className="activity__time">{renderTime()}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Activity;
