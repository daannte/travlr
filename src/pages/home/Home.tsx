import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
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
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      startDate: Date | null;
      endDate: Date | null;
    }>
  >;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  destination: string;
  savedDests: string[];
}

function Home({
  setDestination,
  setDateRange,
  dateRange,
  setActivityList,
  destination,
  savedDests,
}: HomeProps) {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !savedDests.includes(destination) &&
      dateRange.startDate !== null &&
      dateRange.endDate !== null
    ) {
      const newActivityList: ActivityList[] = [];
      const currentDate = new Date(dateRange.startDate);
      // Set the time to end of the day so the last day gets added
      dateRange.endDate.setHours(23, 59, 59);

      while (currentDate <= dateRange.endDate) {
        const date = currentDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });

        const activities = [
          { startTime: "Start", endTime: "End", name: "Activity Name" },
        ];
        newActivityList.push({ date, activities });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setActivityList(newActivityList);
    }
    navigate("/planner");
  };

  useEffect(() => {
    setDateRange({ startDate: null, endDate: null });
  }, [setDateRange]);

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
              onChange={(e) => setDestination(e.target.value)}
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
                selected={dateRange.startDate}
                onChange={(date: Date) =>
                  setDateRange((prevDateRange) => ({
                    ...prevDateRange,
                    startDate: date,
                  }))
                }
                placeholderText="Start Date"
                startDate={dateRange.startDate}
                endDate={dateRange.startDate}
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
                selected={dateRange.endDate}
                onChange={(date: Date) =>
                  setDateRange((prevDateRange) => ({
                    ...prevDateRange,
                    endDate: date,
                  }))
                }
                placeholderText="End Date"
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                minDate={dateRange.startDate}
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
