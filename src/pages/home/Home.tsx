import { useNavigate } from "react-router-dom";
import React, { forwardRef, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { PlannerContext } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

import searchIcon from "../../assets/search.svg";
import calendarIcon from "../../assets/calendar.svg";
import mapPinIcon from "../../assets/feather-map-pin.svg";
import heroImage from "/hero.png";

// Types
import { ActivityList, Activity, GeoData } from "../../types";

const FSQ_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

interface HomeProps {
  savedDests: string[];
}

function Home({ savedDests }: HomeProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
  const [autoCompleteData, setAutoCompleteData] = useState<string[] | null>(
    null
  );
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);
  const ExampleCustomInput = ({
    onClick,
  }: {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }) => <button onClick={onClick}>{currentPlanner.startDate}</button>;

  const isPhone = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !savedDests.includes(currentPlanner.destination) &&
      currentPlanner.startDate !== "" &&
      currentPlanner.endDate !== ""
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

  function checkStartDate() {
    return currentPlanner.startDate ? new Date(currentPlanner.startDate) : null;
  }

  function checkEndDate() {
    return currentPlanner.endDate ? new Date(currentPlanner.endDate) : null;
  }

  function dateChange(dates: [Date, Date]) {
    const [start, end] = dates;

    setCurrentPlanner((prevPlanner) => ({
      ...prevPlanner,
      startDate: start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      endDate: end?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  }

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
            `https://api.foursquare.com/v3/autocomplete?query=${currentPlanner.destination}&types=geo&session_token=9X7gT5dn0KfH4mVj3B8L6Z2cR1vQpWxY`,
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
    <div className="home-container">
      <div className="home-search-container">
        <form className="home-form-container" onSubmit={handleSubmit}>
          <div className="destination-container">
            <div className="pin-container">
              <img
                className="home-map-pin-icon"
                src={mapPinIcon}
                alt="Pin Icon"
              />
            </div>
            <input
              name="destination"
              className="destination-input"
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
              <div className="home-autocomplete-data">
                {autoCompleteData.map((location, index) => (
                  <div
                    className="home-autocomplete-location"
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
          <div className="date-container">
            <div className="calendar-icon-container">
              <img
                className="home-calendar-icon"
                src={calendarIcon}
                alt="Calendar Icon"
              />
            </div>
            <DatePicker
              className="date-input"
              selected={checkStartDate()}
              onChange={dateChange}
              placeholderText="Start Date"
              startDate={checkStartDate()}
              endDate={checkEndDate()}
              monthsShown={isPhone ? 1 : 2}
              dateFormat="MMM d"
              onKeyDown={(e) => e.preventDefault()}
              required
              selectsRange
              // To prevent weird UI design by react-datepicker
              disabledKeyboardNavigation
              minDate={new Date()}
              // Prevent mobile keybaord
              onFocus={(e) => e.target.blur()}
              customInput={React.createElement(ExampleCustomInput)}
            />
          </div>
          <div className="date-container">
            <div className="calendar-icon-container">
              <img
                className="home-calendar-icon"
                src={calendarIcon}
                alt="Calendar Icon"
              />
            </div>
            <DatePicker
              className="date-input"
              selected={checkEndDate()}
              onChange={dateChange}
              placeholderText="End Date"
              startDate={checkStartDate()}
              endDate={checkEndDate()}
              monthsShown={isPhone ? 1 : 2}
              dateFormat="MMM d"
              onKeyDown={(e) => e.preventDefault()}
              required
              selectsRange
              // To prevent weird UI design by react-datepicker
              disabledKeyboardNavigation
              minDate={new Date()}
              // Prevent mobile keybaord
              onFocus={(e) => e.target.blur()}
            />
          </div>
          <button type="submit" className="home-search-button">
            <img
              className="home-search-icon"
              src={searchIcon}
              alt="Search Icon"
            />
          </button>
        </form>
      </div>
      <div className="home-hero-container">
        <div className="home-title-text">
          <h1 className="home-title">
            Plan your Trip with <span className="travlr-text">Travlr</span>
          </h1>
          <h2 className="home-title-subtext">
            Build your itineraries all in one place, and plan for your ultimate
            adventure
          </h2>
        </div>
        <div className="home-hero-image-container">
          <img className="home-hero-image" src={heroImage} alt="Hero Image" />
        </div>
      </div>
    </div>
  );
}

export default Home;
