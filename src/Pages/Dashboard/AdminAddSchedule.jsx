import React, { useState } from "react";
import useAxios from "../../hooks/useAxios";

const AdminAddSchedule = () => {
  const [form, setForm] = useState({
    routeNo: "",
    routeName: "",
    startTime: [],
    departureTime: [],
    details: "",
    coordinates: []
  });

  const [timeInput, setTimeInput] = useState("");
  const [depTimeInput, setDepTimeInput] = useState("");
  const axios = useAxios();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStartTime = () => {
    if (timeInput.trim() === "") return;
    setForm({ ...form, startTime: [...form.startTime, timeInput] });
    setTimeInput("");
  };

  const addDepartureTime = () => {
    if (depTimeInput.trim() === "") return;
    setForm({ ...form, departureTime: [...form.departureTime, depTimeInput] });
    setDepTimeInput("");
  };

  const addCoordinate = () => {
    if (!lat || !lng) return;
    setForm({
      ...form,
      coordinates: [...form.coordinates, [parseFloat(lat), parseFloat(lng)]]
    });
    setLat("");
    setLng("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/schedules", form);
      alert("Schedule Added Successfully!");
      setForm({
        routeNo: "",
        routeName: "",
        startTime: [],
        departureTime: [],
        details: "",
        coordinates: []
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add route!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add Transport Schedule</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="routeNo"
          placeholder="Route No (e.g. Route 1)"
          value={form.routeNo}
          onChange={updateField}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="routeName"
          placeholder="Route Name"
          value={form.routeName}
          onChange={updateField}
          className="w-full border p-2 rounded"
          required
        />

        {/* Start Time */}
        <div>
          <label className="font-semibold">Start Times</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add Time (e.g., 08:00 AM)"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button type="button" onClick={addStartTime} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
          <ul className="mt-2 text-sm text-gray-700">
            {form.startTime.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>

        {/* Departure Time */}
        <div>
          <label className="font-semibold">Departure Times</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add Time"
              value={depTimeInput}
              onChange={(e) => setDepTimeInput(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button type="button" onClick={addDepartureTime} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
          <ul className="mt-2 text-sm text-gray-700">
            {form.departureTime.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>

        {/* Description */}
        <textarea
          name="details"
          placeholder="Route Details"
          value={form.details}
          onChange={updateField}
          className="w-full border p-2 rounded h-24"
          required
        ></textarea>

        {/* Coordinates */}
        <div>
          <label className="font-semibold">Coordinates</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <button type="button" onClick={addCoordinate} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Add Coordinate
          </button>

          <ul className="mt-2 text-sm text-gray-700">
            {form.coordinates.map((c, i) => (
              <li key={i}>• Lat: {c[0]}, Lng: {c[1]}</li>
            ))}
          </ul>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-lg">
          Save Route
        </button>
      </form>
    </div>
  );
};

export default AdminAddSchedule;
