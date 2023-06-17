import React from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "./TimeSelect.css";

interface IFormInputs {
  startTime: Date | null;
  endTime: Date | null;
}

interface TimeSelectProps {
  startTime: Date | null;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
  endTime: Date | null;
  setEndTime: React.Dispatch<React.SetStateAction<Date | null>>;
  onSubmit: (data: IFormInputs) => void;
}

function TimeSelect({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onSubmit,
}: TimeSelectProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>();

  function handleClear() {
    reset({
      startTime: null,
      endTime: null,
    });
    setStartTime(null);
    setEndTime(null);
  }

  function validateTime(startTime: Date | null, endTime: Date | null) {
    // Remove milliseconds to fix a problem where they aren't equal when they should be
    startTime?.setMilliseconds(0);
    endTime?.setMilliseconds(0);

    if (startTime && endTime && startTime.getTime() >= endTime.getTime()) {
      return "End time must be set to a time after start time!";
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="choose-time-popup">
      <div className="time-inputs">
        <Controller
          control={control}
          name={"startTime"}
          rules={{ required: endTime ? true : false }}
          defaultValue={startTime}
          render={({ field: { onChange } }) => {
            return (
              <DatePicker
                onChange={(date) => {
                  setStartTime(date);
                  onChange(date);
                }}
                selected={startTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Start Time"
                dateFormat="h:mm aa"
                onKeyDown={(e) => e.preventDefault()}
                inline
              />
            );
          }}
        />
        <Controller
          control={control}
          name={"endTime"}
          rules={{
            validate: (val) => validateTime(watch("startTime"), val),
          }}
          defaultValue={endTime}
          render={({ field: { onChange } }) => {
            return (
              <DatePicker
                onChange={(date) => {
                  setEndTime(date);
                  onChange(date);
                }}
                selected={endTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="End Time"
                dateFormat="h:mm aa"
                onKeyDown={(e) => e.preventDefault()}
                inline
              />
            );
          }}
        />
      </div>
      <p className="time-error-message">
        {errors.startTime && "Start time needed if you choose an end time"}
        {errors.endTime && errors.endTime.message}
      </p>
      <div className="time-buttons">
        <button
          className="cancel-time-button"
          type="button"
          onClick={handleClear}
        >
          Clear
        </button>
        <button className="save-time-button" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default TimeSelect;
