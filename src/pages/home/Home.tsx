import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { PlannerContext } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

import searchIcon from "../../assets/search.svg";
import calendarIcon from "../../assets/calendar.svg";
import mapPinIcon from "../../assets/feather-map-pin.svg";
import heroImage from "/hero.png";

interface Activity {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: Activity[];
  isEmpty: true;
}

interface HomeProps {
  savedDests: string[];
}

function Home({ savedDests }: HomeProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
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
          month: "long",
          day: "numeric",
          year: "numeric",
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

  useEffect(() => {
    setCurrentPlanner((prevPlanner) => ({
      ...prevPlanner,
      startDate: "",
      endDate: "",
    }));
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

  return (
    <div className="home-container">
      <div className="home-hero-container">
        <div className="home-title-text">
          <h1 className="home-title">Plan your Trip with Travlr</h1>
          <h2 className="home-title-subtext">
            Build your itineraries all in one place, and plan for your ultimate
            adventure
          </h2>
        </div>
        <div className="home-hero-image-container">
          <img className="home-hero-image" src={heroImage} alt="Hero Image" />
        </div>
      </div>
      <div className="home-search-container">
        <form className="home-form-container" onSubmit={handleSubmit}>
          <div className="destination-container">
            <div className="destination-title-input-container">
              <div className="pin-container">
                <img
                  className="home-map-pin-icon"
                  src={mapPinIcon}
                  alt="Pin Icon"
                />
              </div>
              <label
                htmlFor="destination-input"
                className="destination-input-label"
              >
                Destination
              </label>
            </div>
            <input
              name="destination"
              id="destination-input"
              className="destination-input"
              type="text"
              placeholder="Where do you want to go?"
              autoComplete="off"
              required
              onChange={(e) =>
                setCurrentPlanner((prevPlanner) => ({
                  ...prevPlanner,
                  destination: e.target.value,
                }))
              }
            />
          </div>
          {isPhone ? (
            <div className="horizontal-line" />
          ) : (
            <div className="vertical-line" />
          )}
          <div className="date-container">
            <div className="date-input-title-container">
              <div className="calendar-container">
                <img
                  className="home-calendar-icon"
                  src={calendarIcon}
                  alt="Calendar Icon"
                />
              </div>
              <label className="date-input-label" htmlFor="date-input">
                Date
              </label>
            </div>
            <DatePicker
              className="date-input"
              selected={checkStartDate()}
              onChange={dateChange}
              placeholderText="When are you going?"
              startDate={checkStartDate()}
              endDate={checkEndDate()}
              monthsShown={isPhone ? 1 : 2}
              dateFormat="MMM d"
              onKeyDown={(e) => e.preventDefault()}
              required
              selectsRange
              // To prevent weird UI design by react-datepicker
              disabledKeyboardNavigation
              minDate={null}
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
    </div>
  );
}

export default Home;
