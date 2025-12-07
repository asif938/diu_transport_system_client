import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const AddNotice = () => {

    const axios = useAxios();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "schedule",
        priority: "normal",
        author: "",
        date: "",
        time: "",
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Backend API Mutation
    const mutation = useMutation({
        mutationFn: async (newNotice) => {
            const res = await axios.post(
                `/notices`,
                newNotice
            );
            return res.data;
        },
        onSuccess: () => {
            alert("Notice added successfully!");
            setFormData({
                title: "",
                content: "",
                category: "schedule",
                priority: "normal",
                author: "",
                date: "",
                time: "",
            });
        },
        onError: () => {
            alert("Failed to add notice.");
        },
    });

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <FaPlusCircle className="text-3xl text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-800">Add New Notice</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter notice title"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Write notice details..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    {/* Category + Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Category */}
                        <div>
                            <label className="block text-gray-600 font-medium mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="schedule">Schedule</option>
                                <option value="route">Route</option>
                                <option value="holiday">Holiday</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="security">Security</option>
                                <option value="weather">Weather</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-gray-600 font-medium mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="normal">Normal</option>
                            </select>
                        </div>

                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Transport Department, Admin, etc."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-gray-600 font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium mb-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {mutation.isPending ? "Adding..." : "Add Notice"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNotice;
