import React, { useContext, useEffect, useState } from "react";
import { db, ref, set, remove } from "../../backend/firebase";
import { PlannerContext, UserIdContext } from "../../App";
import "./Planner.css";

import Card from "../../components/card/Card";
import starIcon from "../../assets/star.svg";
import starFilledIcon from "../../assets/starFilled.svg";
import pinIcon from "../../assets/map-pin.svg";
import calendarIcon from "../../assets/calendar.svg";

const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

interface PlannerProps {
  savedDests: string[];
  setSavedDests: React.Dispatch<React.SetStateAction<string[]>>;
}

function Planner({ savedDests, setSavedDests }: PlannerProps) {
  const { currentPlanner } = useContext(PlannerContext);
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

  return (
    <div className="planner-container">
      <div className="planner-event-container">
        <div className="planner-hero-container">
          {destinationImage && (
            <img
              src={destinationImage}
              alt={currentPlanner.destination}
              className="planner-destination-image"
            />
          )}
          <div className="planner-destination-info-container">
            <div className="planner-destination-title-container">
              <img className="planner-pin-icon" src={pinIcon} alt="Map Pin" />
              <h1 className="planner-destination">
                {currentPlanner.destination}
              </h1>
            </div>
            <div className="planner-destination-date-container">
              <img
                className="planner-destination-date-icon"
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
          <div className="planner-save-icon-container" onClick={handleSaved}>
            <img
              src={isSaved && userId ? starFilledIcon : starIcon}
              alt="Save"
            />
          </div>
        </div>
        <div className="planner-cards-container">{renderCards()}</div>
      </div>
      <div className="planner-map-container">Map Will go here later.</div>
    </div>
  );
}

export default Planner;
