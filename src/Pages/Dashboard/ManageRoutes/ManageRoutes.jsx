import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const ManageRoutes = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    routeId: "",
    title: "",
    start: "",
    end: "",
    stops: "",
  });

  const { data: routesRes, isLoading } = useQuery({
    queryKey: ["admin-routes"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/routes");
      return res.data?.data || [];
    },
  });

  const createRouteMutation = useMutation({
    mutationFn: async (payload) => {
      const body = {
        ...payload,
        stops: payload.stops
          ? payload.stops.split(",").map((s) => s.trim())
          : [],
      };
      const res = await axios.post("/api/admin/routes", body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-routes"] });
      setForm({ routeId: "", title: "", start: "", end: "", stops: "" });
    },
  });

  const deleteRouteMutation = useMutation({
    mutationFn: async (routeId) => {
      const res = await axios.delete(`/api/admin/routes/${routeId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-routes"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.routeId || !form.title) return;
    createRouteMutation.mutate(form);
  };

  const routes = routesRes || [];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Manage Routes</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 grid md:grid-cols-2 gap-4"
      >
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Route ID (e.g. R1)"
            className="input input-bordered w-full"
            value={form.routeId}
            onChange={(e) => setForm({ ...form, routeId: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Title (e.g. Dhanmondi <> DSC)"
            className="input input-bordered w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Start location"
            className="input input-bordered w-full"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
          />
          <input
            type="text"
            placeholder="End location"
            className="input input-bordered w-full"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <textarea
            placeholder="Stops (comma separated)"
            className="textarea textarea-bordered w-full h-32"
            value={form.stops}
            onChange={(e) => setForm({ ...form, stops: e.target.value })}
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary w-full mt-2 flex items-center gap-2"
            disabled={createRouteMutation.isPending}
          >
            <FiPlus />{" "}
            {createRouteMutation.isPending ? "Saving..." : "Create Route"}
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-3">Existing Routes</h3>
        {isLoading ? (
          <p>Loading routes...</p>
        ) : routes.length === 0 ? (
          <p className="text-sm text-gray-500">No routes created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Route ID</th>
                  <th>Title</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r, idx) => (
                  <tr key={r._id || r.routeId}>
                    <td>{idx + 1}</td>
                    <td>{r.routeId}</td>
                    <td>{r.title}</td>
                    <td>{r.start}</td>
                    <td>{r.end}</td>
                    <td className="capitalize">{r.status}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-xs text-red-500"
                        onClick={() => deleteRouteMutation.mutate(r.routeId)}
                      >
                        <FiTrash2 />
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
  );
};

export default ManageRoutes;