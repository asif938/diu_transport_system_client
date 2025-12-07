import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { FiPlus, FiRefreshCw, FiX } from "react-icons/fi";

const BusManagement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const [newBus, setNewBus] = useState({
    busName: "",
    busNumber: "",
  });

  const [assigningBus, setAssigningBus] = useState(null); // { busId, scheduleId, timeSlot, direction }

  const { data: busesRes, isLoading: busesLoading } = useQuery({
    queryKey: ["admin-buses"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/buses");
      return res.data?.data || [];
    },
  });

  const { data: routesRes } = useQuery({
    queryKey: ["admin-routes"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/routes");
      return res.data?.data || [];
    },
  });

  const { data: schedulesRes } = useQuery({
    queryKey: ["admin-schedules"],
    queryFn: async () => {
      const res = await axios.get("/api/schedules");
      return res.data?.data || [];
    },
  });

  const addBusMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post("/api/admin/buses", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buses"] });
      setNewBus({ busName: "", busNumber: "" });
    },
  });

  const assignRouteMutation = useMutation({
    mutationFn: async ({ busId, routeId }) => {
      const res = await axios.put(`/api/admin/buses/${busId}/assign-route`, {
        routeId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buses"] });
    },
  });

  const assignScheduleMutation = useMutation({
    mutationFn: async ({ busId, scheduleId, timeSlot, direction }) => {
      const res = await axios.put(`/api/admin/buses/${busId}/assign-schedule`, {
        scheduleId,
        timeSlot,
        direction,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buses"] });
      setAssigningBus(null);
    },
  });

  const removeAssignmentMutation = useMutation({
    mutationFn: async ({ busId, assignmentIndex }) => {
      const res = await axios.delete(
        `/api/admin/buses/${busId}/assignments/${assignmentIndex}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buses"] });
    },
  });

  const handleAddBus = (e) => {
    e.preventDefault();
    if (!newBus.busName || !newBus.busNumber) return;
    addBusMutation.mutate(newBus);
  };

  const handleAssignRoute = (busId, routeId) => {
    if (!routeId) return;
    assignRouteMutation.mutate({ busId, routeId });
  };

  const handleAssignSchedule = () => {
    if (!assigningBus?.scheduleId || !assigningBus?.timeSlot || !assigningBus?.direction) {
      alert("Please select schedule, time slot, and direction");
      return;
    }
    assignScheduleMutation.mutate(assigningBus);
  };

  const buses = busesRes || [];
  const routes = routesRes || [];
  const schedules = schedulesRes || [];

  const getSelectedSchedule = () => {
    if (!assigningBus?.scheduleId) return null;
    return schedules.find(s => s._id === assigningBus.scheduleId);
  };

  const selectedSchedule = getSelectedSchedule();
  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Bus Management</h2>
        <button
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["admin-buses"] })
          }
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <form
          onSubmit={handleAddBus}
          className="md:col-span-1 bg-white shadow rounded-lg p-4 space-y-3"
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FiPlus /> Add New Bus
          </h3>
          <input
            type="text"
            placeholder="Bus Name"
            className="input input-bordered w-full"
            value={newBus.busName}
            onChange={(e) =>
              setNewBus({ ...newBus, busName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Bus Number"
            className="input input-bordered w-full"
            value={newBus.busNumber}
            onChange={(e) =>
              setNewBus({ ...newBus, busNumber: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={addBusMutation.isPending}
          >
            {addBusMutation.isPending ? "Saving..." : "Save Bus"}
          </button>
        </form>

        <div className="md:col-span-2 bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-4">Buses</h3>
          {busesLoading ? (
            <p>Loading buses...</p>
          ) : buses.length === 0 ? (
            <p className="text-sm text-gray-500">No buses created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bus Name</th>
                    <th>Bus Number</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Assign Route</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus, idx) => (
                    <tr key={bus._id || bus.busId || idx}>
                      <td>{idx + 1}</td>
                      <td>{bus.busName}</td>
                      <td>{bus.busNumber}</td>
                      <td>{bus.route || bus.routeId || "Not assigned"}</td>
                      <td className="capitalize">{bus.status}</td>
                      <td>
                        <select
                          className="select select-bordered select-xs mr-2"
                          defaultValue={bus.routeId || ""}
                          onChange={(e) =>
                            handleAssignRoute(bus.busId, e.target.value)
                          }
                        >
                          <option value="">Select route</option>
                          {routes.map((r) => (
                            <option key={r._id} value={r.routeId}>
                              {r.title} ({r.routeId})
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-sm btn-primary ml-2"
                          onClick={() => setAssigningBus({ busId: bus.busId })}
                        >
                          Assign Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assigningBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Assign Bus to Schedule</h3>
              <button
                onClick={() => setAssigningBus(null)}
                className="btn btn-sm btn-circle"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Select Schedule</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={assigningBus.scheduleId || ""}
                  onChange={(e) =>
                    setAssigningBus({ ...assigningBus, scheduleId: e.target.value, timeSlot: "", direction: "" })
                  }
                >
                  <option value="">Select a Route</option>
                  {schedules.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.routeNo} - {s.routeName}
                    </option>
                  ))}
                  {/* {routes.map((r) => (
                    <option key={r._id} value={r.routeId}>
                      {r.title} ({r.routeId})
                    </option>
                  ))} */}
                </select>
              </div>

              {selectedSchedule && (
                <>
                  <div>
                    <label className="label">
                      <span className="label-text">Direction</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={assigningBus.direction || ""}
                      onChange={(e) =>
                        setAssigningBus({ ...assigningBus, direction: e.target.value, timeSlot: "" })
                      }
                    >
                      <option value="">Select direction</option>
                      <option value="toDSC">To DSC</option>
                      <option value="fromDSC">From DSC</option>
                    </select>
                  </div>

                  {assigningBus.direction && (
                    <div>
                      <label className="label">
                        <span className="label-text">Time Slot</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={assigningBus.timeSlot || ""}
                        onChange={(e) =>
                          setAssigningBus({ ...assigningBus, timeSlot: e.target.value })
                        }
                      >
                        <option value="">Select time slot</option>
                        {(assigningBus.direction === "toDSC"
                          ? selectedSchedule.startTime
                          : selectedSchedule.departureTime
                        ).map((time, idx) => (
                          <option key={idx} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2 justify-end mt-6">
                <button
                  className="btn btn-ghost"
                  onClick={() => setAssigningBus(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAssignSchedule}
                  disabled={assignScheduleMutation.isPending}
                >
                  {assignScheduleMutation.isPending ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show existing assignments */}
      {buses.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-4">Bus Schedule Assignments</h3>
          <div className="space-y-4">
            {buses.map((bus) => {
              const assignments = bus.assignments || [];
              if (assignments.length === 0) return null;

              return (
                <div key={bus.busId} className="border-b pb-4 last:border-b-0">
                  <div className="font-semibold mb-2">
                    {bus.busName} ({bus.busNumber})
                  </div>
                  <div className="space-y-1">
                    {assignments.map((assignment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                      >
                        <span>
                          <strong>{assignment.scheduleRouteNo}</strong> -{" "}
                          {assignment.scheduleRouteName} | {assignment.timeSlot}{" "}
                          ({assignment.direction === "toDSC" ? "To DSC" : "From DSC"})
                        </span>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() =>
                            removeAssignmentMutation.mutate({
                              busId: bus.busId,
                              assignmentIndex: idx,
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusManagement;