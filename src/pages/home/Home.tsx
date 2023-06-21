import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { PlannerContext } from "../../App";
import "./Home.css";

import searchIcon from "../../assets/search.svg";
import calendarIcon from "../../assets/calendar.svg";
import mapPinIcon from "../../assets/feather-map-pin.svg";
import heroImage from "/hero.png";

// Types
import { ActivityList, Activity, GeoData } from "../../types";
import CustomDatePicker from "../../components/customDatePicker/CustomDatePicker";

const FSQ_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

interface Props {
  savedDests: string[];
}

function Home({ savedDests }: Props) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const [autoCompleteData, setAutoCompleteData] = useState<string[] | null>(
    null
  );
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !savedDests.includes(currentPlanner.destination) &&
      currentPlanner.startDate &&
      currentPlanner.endDate
    ) {
      const newCurrentPlanner: ActivityList[] = [];

      const currentDate = new Date(currentPlanner.startDate);
      const endDate = new Date(currentPlanner.endDate);
      endDate.setHours(23, 59, 59);

      while (currentDate <= endDate) {
        const date = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const activities: Activity[] = [];
        const isEmpty = true;
        newCurrentPlanner.push({ date, activities, isEmpty });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setCurrentPlanner((prevPlanner) => ({
        ...prevPlanner,
        activityLists: newCurrentPlanner,
      }));
    }
    navigate("/planner");
  }

  // Reset everything if someone comes back to the home page.
  useEffect(() => {
    setCurrentPlanner((prevPlanner) => ({
      ...prevPlanner,
      startDate: "",
      endDate: "",
      destination: "",
    }));
    localStorage.removeItem("destination");
    localStorage.removeItem("currentPlanner");
    setAutoCompleteData(null);
  }, [setCurrentPlanner]);

  const generateSessionToken = () => {
    let sessionToken = "";
    const alphanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for (let i = 0; i < 32; i++) {
      sessionToken += alphanum[Math.floor(Math.random() * 33)];
    }
    return sessionToken;
  };

  useEffect(() => {
    if (currentPlanner.destination) {
      const fetchDestinationsAutoComplete = async () => {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: FSQ_API_KEY,
          },
        };
        try {
          const response = await fetch(
            `https://api.foursquare.com/v3/autocomplete?query=${
              currentPlanner.destination
            }&types=geo&session_token=${generateSessionToken()}`,
            options
          );
          const data = await response.json();
          const namesData = data.results.map(
            (location: GeoData) => location.geo.name
          );
          setAutoCompleteData(namesData);
        } catch (error) {
          setAutoCompleteData(null);
        }
      };
      fetchDestinationsAutoComplete();
    } else {
      setAutoCompleteData(null);
    }
  }, [currentPlanner.destination]);

  return (
    <div className="home">
      <div className="home__search-container">
        <form className="home__form-container" onSubmit={handleSubmit}>
          <div className="home__destination-container">
            <div className="home__pin-container">
              <img className="home__pin-icon" src={mapPinIcon} alt="Pin Icon" />
            </div>
            <input
              name="destination"
              className="home__destination-input"
              type="text"
              value={currentPlanner.destination}
              placeholder="Destination"
              autoComplete="off"
              required
              onChange={(e) =>
                setCurrentPlanner((prevPlanner) => ({
                  ...prevPlanner,
                  destination: e.target.value,
                }))
              }
            />
            {!isLocationSelected &&
            autoCompleteData &&
            currentPlanner.destination.length > 2 ? (
              <div className="home__autocomplete-data">
                {autoCompleteData.map((location, index) => (
                  <div
                    className="home__autocomplete-location"
                    key={index}
                    onClick={() => {
                      setCurrentPlanner((prevPlanner) => ({
                        ...prevPlanner,
                        destination: location.split(",")[0],
                      }));
                      setAutoCompleteData(null);
                      setIsLocationSelected(true);
                    }}
                    onChange={() => setIsLocationSelected(false)}
                  >
                    {location}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="home__date-container">
            <div className="home__calendar-icon-container">
              <img
                className="home__calendar-icon"
                src={calendarIcon}
                alt="Calendar Icon"
              />
            </div>
            <input
              className="home__date-input"
              required
              readOnly
              onClick={() => setIsDatePickerOpen(true)}
              placeholder="Start Date"
              value={currentPlanner.startDate}
            />
          </div>
          <div className="home__date-container">
            <div className="home__calendar-icon-container">
              <img
                className="home__calendar-icon"
                src={calendarIcon}
                alt="Calendar Icon"
              />
            </div>
            <input
              className="home__date-input"
              required
              readOnly
              onClick={() => setIsDatePickerOpen(true)}
              placeholder="End Date"
              value={currentPlanner.endDate}
            />
          </div>
          <button type="submit" className="home__search-button">
            <img
              className="home__search-icon"
              src={searchIcon}
              alt="Search Icon"
            />
          </button>
          {isDatePickerOpen && (
            <div className="home__custom-date-picker">
              <CustomDatePicker setIsDatePickerOpen={setIsDatePickerOpen} />
            </div>
          )}
        </form>
      </div>
      <div className="home__hero-container">
        <div className="home__title-text">
          <h1 className="home__title">
            Plan your Trip with{" "}
            <span className="home__travlr-text">Travlr</span>
          </h1>
          <h2 className="home__title-subtext">
            Build your itineraries all in one place, and plan for your ultimate
            adventure
          </h2>
        </div>
        <div className="home__hero-image-container">
          <img className="home__hero-image" src={heroImage} alt="Hero Image" />
        </div>
      </div>
    </div>
  );
}

export default Home;
