import { useContext, useEffect } from "react";
import { db, ref, set } from "../../backend/firebase";
import { PlannerContext, UserIdContext } from "../../App";
import "./Planner.css";

import Card from "../../components/card/Card";
import PDF from "../../components/pdf/Pdf";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { PDFDownloadLink } from "@react-pdf/renderer";

function Planner() {
  const { setCurrentPlanner, currentPlanner } = useContext(PlannerContext);
  const userId = useContext(UserIdContext);

  function renderCards() {
    const cards = currentPlanner.activityLists.map((_, index) => {
      return <Card key={index} day={index} />;
    });
    return cards;
  }

  useEffect(() => {
    if (userId) {
      set(
        ref(db, `users/${userId}/trips/${currentPlanner.destination}`),
        currentPlanner
      );
    }
    localStorage.setItem("currentPlanner", JSON.stringify(currentPlanner));
  }, [userId, currentPlanner]);

  function handleDragDrop(results: DropResult) {
    const { source, destination, type } = results;
    // If we dont drag a draggrable into a droppable, we return
    if (!destination) return;
    // If draggable got picked and dropped in the same spot
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "group") {
      // Create a copy of currentPlanner
      const reorderedPlanner = { ...currentPlanner };

      // Get the activity we want to move
      const sourceActivitiesList =
        reorderedPlanner.activityLists[parseInt(source.droppableId)];
      const movedActivity = sourceActivitiesList.activities[source.index];

      // Remove that activity from the array
      sourceActivitiesList.activities.splice(source.index, 1);

      // Check if it was the last element in the source list
      const isSourceEmpty = sourceActivitiesList.activities.length === 0;
      sourceActivitiesList.isEmpty = isSourceEmpty;

      // Get the activities we want to move it to
      const destActivitiesList =
        reorderedPlanner.activityLists[parseInt(destination.droppableId)];

      // Check if the activities list exists
      if (destActivitiesList.isEmpty) {
        // Create a new list with that activity if it is empty
        destActivitiesList.activities = [movedActivity];

        // Set the empty value to false since it isn't empty anymore
        destActivitiesList.isEmpty = false;
      } else {
        // Insert the movedActivity into the acitivities we wanted
        // if the activities exist
        destActivitiesList.activities.splice(
          destination.index,
          0,
          movedActivity
        );
      }

      // Update the currentPlanner state with the reordered planner
      return setCurrentPlanner(reorderedPlanner);
    }
  }

  return (
    <div className="planner">
      <div className="planner__itinerary-container">
        <div className="planner__hero-container">
          <div className="planner__download-itinerary-link-container">
            <PDFDownloadLink
              className="planner__download-itinerary-link"
              document={
                <PDF
                  destination={currentPlanner.destination}
                  activityLists={currentPlanner.activityLists}
                />
              }
              fileName={`${currentPlanner.destination}.pdf`}
            >
              {({ loading }) =>
                loading ? "Loading itinerary..." : "Download Itinerary"
              }
            </PDFDownloadLink>
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className="planner__cards-container">{renderCards()}</div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Planner;
