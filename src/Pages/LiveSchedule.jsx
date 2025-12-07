import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "../hooks/useAxios";
import { FiClock, FiMapPin, FiArrowRight } from "react-icons/fi";
import { MdDirectionsBus, MdSchedule } from "react-icons/md";
import { FaBus } from "react-icons/fa";

const LiveSchedule = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  const { data: liveSchedulesRes, isLoading } = useQuery({
    queryKey: ["live-schedules"],
    queryFn: async () => {
      const res = await axios.get("/api/live-schedules");
      return res.data?.data || [];
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const liveSchedules = liveSchedulesRes || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
            <MdDirectionsBus className="text-3xl" /> Live Schedule
          </h1>
          <button
            onClick={() => navigate("/transportSchedule")}
            className="btn btn-primary flex items-center gap-2"
          >
            <MdSchedule /> View Full Schedule
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r">
          <div className="flex items-start">
            <FiClock className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Live Updates:</strong> Showing upcoming schedules for the
                next 3 hours with assigned buses.
              </p>
            </div>
          </div>
        </div>

        {liveSchedules.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No upcoming schedules in the next 3 hours
            </p>
            <button
              onClick={() => navigate("/transportSchedule")}
              className="btn btn-outline btn-primary mt-4"
            >
              View Full Schedule
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {liveSchedules.map((schedule, index) => (
              <div
                key={schedule._id || index}
                className="border rounded-xl shadow-sm p-6 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {schedule.routeNo}
                  </h2>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {schedule.routeName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* To DSC */}
                  {schedule.toDSC.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-600 mb-3">
                        <FiArrowRight className="rotate-[-45deg]" />
                        <span className="font-medium">To DSC</span>
                      </div>
                      <div className="space-y-3">
                        {schedule.toDSC.map((slot, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                                {slot.time}
                              </span>
                              <span className="text-xs text-gray-500">
                                {slot.buses.length} bus
                                {slot.buses.length !== 1 ? "es" : ""} assigned
                              </span>
                            </div>
                            {slot.buses.length > 0 ? (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {slot.buses.map((bus, busIdx) => (
                                  <div
                                    key={busIdx}
                                    className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                  >
                                    <FaBus className="text-xs" />
                                    <span>
                                      {bus.busName} ({bus.busNumber})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 mt-2">
                                No bus assigned
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* From DSC */}
                  {schedule.fromDSC.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <FiArrowRight className="rotate-[45deg]" />
                        <span className="font-medium">From DSC</span>
                      </div>
                      <div className="space-y-3">
                        {schedule.fromDSC.map((slot, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                                {slot.time}
                              </span>
                              <span className="text-xs text-gray-500">
                                {slot.buses.length} bus
                                {slot.buses.length !== 1 ? "es" : ""} assigned
                              </span>
                            </div>
                            {slot.buses.length > 0 ? (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {slot.buses.map((bus, busIdx) => (
                                  <div
                                    key={busIdx}
                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                  >
                                    <FaBus className="text-xs" />
                                    <span>
                                      {bus.busName} ({bus.busNumber})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 mt-2">
                                No bus assigned
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {schedule.details && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FiMapPin /> <span className="font-medium">Route Details</span>
                    </div>
                    <p className="text-gray-700 text-sm">{schedule.details}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => navigate("/transportSchedule")}
                    className="btn btn-outline btn-sm flex items-center gap-2"
                  >
                    View Full Schedule <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSchedule;