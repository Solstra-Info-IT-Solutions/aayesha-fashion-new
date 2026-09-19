"use client";

import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type CustomCalendarProps = {
  value: string;
  onChange: (value: string) => void;
  onClose?: () => void;
  minDate?: string;
  maxDate?: string;
};

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

function parseDateValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDateValue(date: Date): string {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(value: string): string {
  const date = parseDateValue(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isSameDay(
  first: Date | null,
  second: Date,
): boolean {
  if (!first) {
    return false;
  }

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isDateBefore(
  date: Date,
  boundary: Date | null,
): boolean {
  if (!boundary) {
    return false;
  }

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const normalizedBoundary = new Date(
    boundary.getFullYear(),
    boundary.getMonth(),
    boundary.getDate(),
  );

  return normalizedDate < normalizedBoundary;
}

function isDateAfter(
  date: Date,
  boundary: Date | null,
): boolean {
  if (!boundary) {
    return false;
  }

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const normalizedBoundary = new Date(
    boundary.getFullYear(),
    boundary.getMonth(),
    boundary.getDate(),
  );

  return normalizedDate > normalizedBoundary;
}

export function CustomCalendar({
  value,
  onChange,
  onClose,
  minDate,
  maxDate,
}: CustomCalendarProps) {
  const selectedDate = parseDateValue(value);

  const minDateObject = parseDateValue(minDate ?? "");
  const maxDateObject = parseDateValue(maxDate ?? "");

  const [visibleMonth, setVisibleMonth] =
    useState<Date>(() => {
      return (
        selectedDate ??
        maxDateObject ??
        new Date()
      );
    });

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstDayOfMonth = new Date(
      year,
      month,
      1,
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0,
    ).getDate();

    const daysInPreviousMonth = new Date(
      year,
      month,
      0,
    ).getDate();

    const days: CalendarDay[] = [];

    for (
      let index = firstDayOfMonth - 1;
      index >= 0;
      index--
    ) {
      days.push({
        date: new Date(
          year,
          month - 1,
          daysInPreviousMonth - index,
        ),
        currentMonth: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    let nextMonthDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(
          year,
          month + 1,
          nextMonthDay++,
        ),
        currentMonth: false,
      });
    }

    return days;
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    },
  ).format(visibleMonth);

  const today = new Date();
  const todayValue = formatDateValue(today);

  const canGoPrevious = minDateObject
    ? new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        1,
      ) >
      new Date(
        minDateObject.getFullYear(),
        minDateObject.getMonth(),
        1,
      )
    : true;

  const canGoNext = maxDateObject
    ? new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        1,
      ) <
      new Date(
        maxDateObject.getFullYear(),
        maxDateObject.getMonth(),
        1,
      )
    : true;

  const goPreviousMonth = () => {
    if (!canGoPrevious) {
      return;
    }

    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    );
  };

  const goNextMonth = () => {
    if (!canGoNext) {
      return;
    }

    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
    );
  };

  const selectDate = (date: Date) => {
    if (
      isDateBefore(date, minDateObject) ||
      isDateAfter(date, maxDateObject)
    ) {
      return;
    }

    onChange(formatDateValue(date));
    onClose?.();
  };

  const goToToday = () => {
    if (
      isDateBefore(today, minDateObject) ||
      isDateAfter(today, maxDateObject)
    ) {
      return;
    }

    onChange(todayValue);

    setVisibleMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );

    onClose?.();
  };

  const clearDate = () => {
    onChange("");
  };

  return (
    <div className="custom-calendar">
      <div className="custom-calendar__header">
        <div className="custom-calendar__navigation">
          <button
            type="button"
            onClick={goPreviousMonth}
            disabled={!canGoPrevious}
            aria-label="Previous month"
            className="custom-calendar__nav-button"
          >
            <ChevronLeft
              size={17}
              strokeWidth={1.7}
            />
          </button>

          <div className="custom-calendar__month">
            <p className="custom-calendar__month-label">
              {monthLabel}
            </p>

            <p className="custom-calendar__month-caption">
              Select date
            </p>
          </div>

          <button
            type="button"
            onClick={goNextMonth}
            disabled={!canGoNext}
            aria-label="Next month"
            className="custom-calendar__nav-button"
          >
            <ChevronRight
              size={17}
              strokeWidth={1.7}
            />
          </button>
        </div>

        <div className="custom-calendar__selected">
          <div className="custom-calendar__selected-info">
            <span className="custom-calendar__selected-icon">
              <CalendarDays
                size={15}
                strokeWidth={1.6}
              />
            </span>

            <div>
              <span className="custom-calendar__selected-label">
                Selected date
              </span>

              <span className="custom-calendar__selected-value">
                {value
                  ? formatDisplayDate(value)
                  : "No date selected"}
              </span>
            </div>
          </div>

          {value && (
            <button
              type="button"
              onClick={clearDate}
              className="custom-calendar__clear-button"
              aria-label="Clear selected date"
            >
              <X size={15} strokeWidth={1.7} />
            </button>
          )}
        </div>
      </div>

      <div className="custom-calendar__body">
        <div className="custom-calendar__weekdays">
          {[
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
          ].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="custom-calendar__weekday"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="custom-calendar__days">
          {calendarDays.map(
            ({ date, currentMonth }) => {
              const dateValue =
                formatDateValue(date);

              const selected = isSameDay(
                selectedDate,
                date,
              );

              const outsideRange =
                isDateBefore(
                  date,
                  minDateObject,
                ) ||
                isDateAfter(
                  date,
                  maxDateObject,
                );

              const todayDate =
                dateValue === todayValue;

              return (
                <button
                  key={dateValue}
                  type="button"
                  disabled={outsideRange}
                  onClick={() =>
                    selectDate(date)
                  }
                  aria-label={new Intl.DateTimeFormat(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  ).format(date)}
                  aria-current={
                    todayDate
                      ? "date"
                      : undefined
                  }
                  aria-pressed={selected}
                  className={[
                    "custom-calendar__day",
                    currentMonth
                      ? "custom-calendar__day--current"
                      : "custom-calendar__day--outside",
                    selected
                      ? "custom-calendar__day--selected"
                      : "",
                    outsideRange
                      ? "custom-calendar__day--disabled"
                      : "",
                    todayDate
                      ? "custom-calendar__day--today"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span>
                    {date.getDate()}
                  </span>

                  {selected && (
                    <Check
                      size={10}
                      strokeWidth={2.4}
                      className="custom-calendar__selected-mark"
                    />
                  )}

                  {todayDate &&
                    !selected &&
                    !outsideRange && (
                      <span className="custom-calendar__today-dot" />
                    )}
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="custom-calendar__footer">
        <button
          type="button"
          onClick={clearDate}
          className="custom-calendar__footer-button"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={goToToday}
          disabled={
            isDateBefore(
              today,
              minDateObject,
            ) ||
            isDateAfter(
              today,
              maxDateObject,
            )
          }
          className="custom-calendar__footer-button custom-calendar__footer-button--accent"
        >
          Today
        </button>
      </div>
    </div>
  );
}