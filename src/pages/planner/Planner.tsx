import React, { useContext, useEffect, useState } from "react";
import { db, ref, set, remove } from "../../backend/firebase";
import { PlannerContext, UserIdContext } from "../../App";
import "./Planner.css";

import Card from "../../components/card/Card";
import starIcon from "../../assets/star.svg";
import starFilledIcon from "../../assets/starFilled.svg";
import pinIcon from "../../assets/map-pin.svg";
import calendarIcon from "../../assets/calendar.svg";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

interface Props {
  savedDests: string[];
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>;
}

function Planner({ savedDests, setSavedDests }: Props) {
  const { setCurrentPlanner, currentPlanner } = useContext(PlannerContext);
  const userId = useContext(UserIdContext);
  const isSaved = savedDests.includes(currentPlanner.destination);
  const [destinationImage, setDestinationImage] = useState<string>("");

  function renderCards() {
    const cards = currentPlanner.activityLists.map((_, index) => {
      return <Card key={index} day={index} />;
    });
    return cards;
  }

  useEffect(() => {
    if (isSaved && userId) {
      set(
        ref(
          db,
          `users/${userId}/savedDestinations/${currentPlanner.destination}`
        ),
        currentPlanner
      );
    }
    localStorage.setItem("currentPlanner", JSON.stringify(currentPlanner));
  }, [isSaved, userId, currentPlanner]);

  useEffect(() => {
    const fetchDestinationImage = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${currentPlanner.destination}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
        );
        const data = await response.json();
        const image =
          data.results[Math.floor(Math.random() * 10)]?.urls.regular || "";
        setDestinationImage(image);
      } catch (error) {
        console.log("Error fetching destination image:", error);
      }
    };

    fetchDestinationImage();
  }, [currentPlanner.destination]);

  function handleSaved() {
    if (userId) {
      const newSavedDests = savedDests.includes(currentPlanner.destination)
        ? savedDests.filter((dest) => dest !== currentPlanner.destination)
        : [...savedDests, currentPlanner.destination];
      setSavedDests(newSavedDests);

      if (isSaved) {
        remove(
          ref(
            db,
            `users/${userId}/savedDestinations/${currentPlanner.destination}`
          )
        );
      }
    }
  }

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
          {destinationImage && (
            <img
              src={destinationImage}
              alt={currentPlanner.destination}
              className="planner__destination-image"
            />
          )}
          <div className="planner__destination-info-container">
            <div className="planner__destination-title-container">
              <img className="planner__pin-icon" src={pinIcon} alt="Map Pin" />
              <h1 className="planner__destination">
                {currentPlanner.destination}
              </h1>
            </div>
            <div className="planner__destination-date-container">
              <img
                className="planner__destination-date-icon"
                src={calendarIcon}
                alt="Calendar Icon"
              />
              {currentPlanner.startDate &&
                new Date(currentPlanner.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
              -{" "}
              {currentPlanner.endDate &&
                new Date(currentPlanner.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </div>
          </div>
          <div className="planner__save-icon-container" onClick={handleSaved}>
            <img
              src={isSaved && userId ? starFilledIcon : starIcon}
              alt="Save"
            />
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className="planner__cards-container">{renderCards()}</div>
        </DragDropContext>
      </div>
      <div className="planner__map-container">Map Will go here later.</div>
    </div>
  );
}

export default Planner;
