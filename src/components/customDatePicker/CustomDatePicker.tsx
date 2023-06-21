import { useCallback, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "./CustomDatePicker.css";

import arrowLeft from "../../assets/arrow-left.svg";
import arrowRight from "../../assets/arrow-right.svg";

function CustomDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const currentMonth = selectedDate.clone();
  const nextMonth = selectedDate.clone().add(1, "month");

  const generateWeek = useCallback((startDay: Dayjs): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = startDay.clone().add(i, "day").toDate();
      dates.push(date);
    }
    return dates;
  }, []);

  const generateCalendar = useCallback(
    (month: Dayjs): Date[][] => {
      const firstDayOfMonth = month.startOf("month");
      const firstDayOfFirstWeek = firstDayOfMonth.startOf("week");

      const calendar: Date[][] = [];
      let currentDay = firstDayOfFirstWeek;

      for (let i = 0; i < 6; i++) {
        const week = generateWeek(currentDay);
        calendar.push(week);
        currentDay = currentDay.add(1, "week");
      }

      return calendar;
    },
    [generateWeek]
  );

  const currentMonthCalendar = useMemo(
    () => generateCalendar(currentMonth),
    [currentMonth, generateCalendar]
  );
  const nextMonthCalendar = useMemo(
    () => generateCalendar(nextMonth),
    [nextMonth, generateCalendar]
  );

  const dayLabels = useMemo(() => {
    const startOfWeek = dayjs().startOf("week");
    const dayLabels: string[] = [];

    for (let i = 0; i < 7; i++) {
      const dayLabel = startOfWeek.add(i, "day").format("dd");
      dayLabels.push(dayLabel);
    }

    return dayLabels;
  }, []);

  const dayClassName = (day: Date, month: Dayjs) => {
    if (month.toDate().getMonth() !== day.getMonth()) {
      return "date-picker__day date-picker__day-hidden";
    } else {
      let className = "date-picker__day";
      if (startDate && day >= startDate && endDate && day <= endDate) {
        className += " date-picker__day-range";
      } else if (startDate && dayjs(day).isSame(startDate, "day")) {
        className += " date-picker__day-start";
      } else if (
        hoveredDate &&
        startDate &&
        day > startDate &&
        day <= hoveredDate
      ) {
        className += " date-picker__day-range-hover";
      }
      return className;
    }
  };

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      setHoveredDate(null);
    } else {
      if (day >= startDate) {
        setEndDate(day);
      } else {
        setEndDate(startDate);
        setStartDate(day);
      }
    }
  };

  const handleDayHover = (day: Date) => {
    if (startDate && !endDate) {
      setHoveredDate(day);
    }
  };

  return (
    <div className="date-picker">
      <div className="date-picker__header">
        <img
          src={arrowLeft}
          className="date-picker__arrow-left"
          onClick={() => setSelectedDate((date) => date.subtract(1, "month"))}
          alt="Arrow Left"
        />
        <h3 className="date-picker__month">
          {currentMonth.format("MMM YYYY")}
        </h3>
        <h3>{nextMonth.format("MMM YYYY")}</h3>
        <img
          src={arrowRight}
          className="date-picker__arrow-right"
          onClick={() => setSelectedDate((date) => date.add(1, "month"))}
          alt="Arrow Right"
        />
      </div>
      <div className="date-picker__calendar-container">
        <div className="date-picker__calendar">
          <div className="date-picker__week">
            {dayLabels.map((dayLabel, index) => (
              <div className="date-picker__day-name" key={index}>
                {dayLabel}
              </div>
            ))}
          </div>
          {currentMonthCalendar.map((week, weekIndex) => (
            <div className="date-picker__week" key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div
                  className={dayClassName(day, currentMonth)}
                  key={dayIndex}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => handleDayHover(day)}
                >
                  {day.getDate()}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="date-picker__calendar">
          <div className="date-picker__week">
            {dayLabels.map((dayLabel, index) => (
              <div className="date-picker__day-name" key={index}>
                {dayLabel}
              </div>
            ))}
          </div>
          {nextMonthCalendar.map((week, weekIndex) => (
            <div className="date-picker__week" key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div
                  className={dayClassName(day, nextMonth)}
                  key={dayIndex}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => handleDayHover(day)}
                >
                  {day.getDate()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomDatePicker;
