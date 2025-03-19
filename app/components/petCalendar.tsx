import { useState, useEffect } from "react";

export default function PetCalendar({ trackers }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthDays = [];
  const totalDays = daysInMonth(currentDate);
  const firstDayIndex = firstDayOfMonth(currentDate);

  for (let i = 0; i < firstDayIndex; i++) {
    monthDays.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    monthDays.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    );
  }

  const isTracked = (day) => {
    return trackers?.some((tracker) => {
      const trackerDate = new Date(tracker.date);
      return (
        trackerDate.getFullYear() === day.getFullYear() &&
        trackerDate.getMonth() === day.getMonth() &&
        trackerDate.getDate() === day.getDate()
      );
    });
  };

  const handleClick = (day) => {
    const tracker = trackers.find((t) => {
      const trackerDate = new Date(t.date);
      return (
        trackerDate.getFullYear() === day.getFullYear() &&
        trackerDate.getMonth() === day.getMonth() &&
        trackerDate.getDate() === day.getDate()
      );
    });

    if (tracker) {
      setSelectedTracker(tracker);
      setIsModalOpen(true);
    } else {
      setSelectedTracker(null);
      setIsModalOpen(true); // también puedes mostrar que no hay datos en el modal
    }
  };

  return (
    <div className="p-5 mx-auto p-4 bg-gray-800 rounded-xl text-white mt-5">
      <h2 className="text-center text-xl font-bold">
        {currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      <div className="grid grid-cols-7 gap-1 mt-4 text-sm text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}

        {monthDays.map((day, idx) => (
          <div
            key={idx}
            onClick={() => day && handleClick(day)}
            className={`p-2 rounded cursor-pointer ${
              day
                ? isTracked(day)
                  ? "bg-teal-500"
                  : "bg-gray-600"
                : "bg-transparent cursor-default"
            }`}
          >
            {day ? day.getDate() : ""}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              ✖️
            </button>

            {selectedTracker ? (
              <>
                <h3 className="text-xl font-bold mb-2">Pet Details</h3>
                <p>
                  <strong>Mood:</strong> {selectedTracker.mood}
                </p>
                <p>
                  <strong>Walked Minutes:</strong>{" "}
                  {selectedTracker.walked_minutes} mins
                </p>
                <p>
                  <strong>Food Consumed:</strong>{" "}
                  {selectedTracker.food_consumed} gr
                </p>
                <p>
                  <strong>Water Consumed:</strong>{" "}
                  {selectedTracker.water_consumed} ml
                </p>
                <p>
                  <strong>Sleep Hours:</strong> {selectedTracker.sleep_hours}{" "}
                  hrs
                </p>
                <p>
                  <strong>Poop Quality:</strong> {selectedTracker.poop_quality}
                </p>
              </>
            ) : (
              <p className="text-gray-700">No data available for this day.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
