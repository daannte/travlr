import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { PlannerContext } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

import searchIcon from "../../assets/search.svg";
import calendarIcon from "../../assets/calendar.svg";
import phoneIll from "../../assets/phoneIll.svg";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface HomeProps {
  savedDests: string[];
}

function Home({ savedDests }: HomeProps) {
  const { currentPlanner, setCurrentPlanner } = useContext(PlannerContext);
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
        });

        const activities = [
          { startTime: "Start", endTime: "End", name: "Activity Name" },
        ];
        newCurrentPlanner.push({ date, activities });
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

  return (
    <div className="home-container">
      <div className="home-search-container">
        <h1 className="title">Plan your next vacation.</h1>
        <p>Enter your destination:</p>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="search-box-container">
            <input
              className="search-box"
              name="destination"
              type="text"
              placeholder="e.g Barcelona"
              onChange={(e) =>
                setCurrentPlanner((prevPlanner) => ({
                  ...prevPlanner,
                  destination: e.target.value,
                }))
              }
              required
              autoComplete="off"
            />
            <button type="submit" className="search-button">
              <img src={searchIcon} alt="Search" className="search-icon" />
            </button>
          </div>
          <div className="date-select-container">
            <div className="calendar-button-container">
              <img
                src={calendarIcon}
                alt="calendar"
                className="calendar-icon"
              />
              <DatePicker
                className="calendar-button"
                selected={checkStartDate()}
                onChange={(date: Date) =>
                  setCurrentPlanner((prevPlanner) => ({
                    ...prevPlanner,
                    startDate: date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                  }))
                }
                placeholderText="Start Date"
                startDate={checkStartDate()}
                endDate={checkEndDate()}
                monthsShown={2}
                dateFormat="MMMM d"
                onKeyDown={(e) => e.preventDefault()}
                required
                selectsStart
              />
            </div>
            <div className="calendar-button-container">
              <img
                src={calendarIcon}
                alt="calendar"
                className="calendar-icon"
              />
              <DatePicker
                className="calendar-button"
                selected={checkEndDate()}
                onChange={(date: Date) =>
                  setCurrentPlanner((prevPlanner) => ({
                    ...prevPlanner,
                    endDate: date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                  }))
                }
                placeholderText="End Date"
                startDate={checkStartDate()}
                endDate={checkEndDate()}
                minDate={checkStartDate()}
                monthsShown={2}
                dateFormat="MMMM d"
                onKeyDown={(e) => e.preventDefault()}
                required
                selectsEnd
              />
            </div>
          </div>
        </form>
      </div>
      <img src={phoneIll} alt="phone" className="phone-image" />
    </div>
  );
}

export default Home;
