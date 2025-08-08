import React, { useState, useEffect } from 'react';
import moment from 'moment';

const BorrowBus = () => {
  const [form, setForm] = useState({
    reason: '',
    startTime: '',
    endTime: '',
    selectedBus: '',
    passengers: 1,
    files: []
  });
  const [availableBuses, setAvailableBuses] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('request');
  const [validationErrors, setValidationErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [conflictingSchedules, setConflictingSchedules] = useState([]);

  const mockBuses = [
    { id: 'bus1', name: 'Shurjomukhi (45 seats)', capacity: 45 },
    { id: 'bus2', name: 'Dolphin (48 seats)', capacity: 50 },
    { id: 'bus3', name: 'Aparajita (50 seats)', capacity: 48 },
  ];

  const mockSchedules = [
    {
      id: 1,
      busId: 'bus1',
      title: 'Field Trip - Biology Class',
      start: new Date(2023, 10, 15, 8, 0),
      end: new Date(2023, 10, 15, 16, 0),
      status: 'approved'
    },
    {
      id: 2,
      busId: 'bus2',
      title: 'Sports Competition',
      start: new Date(2023, 10, 16, 9, 0),
      end: new Date(2023, 10, 16, 18, 0),
      status: 'approved'
    },
    {
      id: 3,
      busId: 'bus3',
      title: 'Pending: Debate Competition',
      start: new Date(2023, 10, 17, 10, 0),
      end: new Date(2023, 10, 17, 14, 0),
      status: 'pending'
    },
  ];

  const findConflictingSchedules = (busId, startTime, endTime) => {
    if (!startTime || !endTime) return [];
    
    return mockSchedules.filter(schedule => {
      if (schedule.busId !== busId) return false;
      
      const scheduleStart = new Date(schedule.start);
      const scheduleEnd = new Date(schedule.end);
      const requestedStart = new Date(startTime);
      const requestedEnd = new Date(endTime);
      
      return (
        (requestedStart >= scheduleStart && requestedStart < scheduleEnd) ||
        (requestedEnd > scheduleStart && requestedEnd <= scheduleEnd) ||
        (requestedStart <= scheduleStart && requestedEnd >= scheduleEnd)
      );
    });
  };

  useEffect(() => {
    if (form.startTime && form.endTime) {
      const start = new Date(form.startTime);
      const end = new Date(form.endTime);
      
      if (start >= end) {
        setValidationErrors(prev => ({
          ...prev,
          timeRange: 'End time must be after start time'
        }));
        return;
      } else {
        setValidationErrors(prev => {
          const { timeRange, ...rest } = prev;
          return rest;
        });
      }

      const available = mockBuses.filter(bus => {
        const conflicts = findConflictingSchedules(bus.id, form.startTime, form.endTime);
        return conflicts.length === 0;
      });
      
      setAvailableBuses(available);
      
      if (form.selectedBus) {
        setConflictingSchedules(
          findConflictingSchedules(form.selectedBus, form.startTime, form.endTime)
        );
      }
      
      if (form.selectedBus && !available.some(bus => bus.id === form.selectedBus)) {
        setForm(prev => ({ ...prev, selectedBus: '' }));
      }
    }
  }, [form.startTime, form.endTime, form.selectedBus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;
    
    const validFiles = files.filter(file => {
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setFileError('Only PDF, JPG, PNG, or DOC files under 5MB are allowed');
    } else {
      setFileError('');
    }

    if (validFiles.length > 0) {
      setForm(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles]
      }));
    }
  };

  const removeFile = (index) => {
    setForm(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.reason) errors.reason = 'Reason is required';
    if (!form.startTime) errors.startTime = 'Start time is required';
    if (!form.endTime) errors.endTime = 'End time is required';
    if (form.startTime && form.endTime && new Date(form.startTime) >= new Date(form.endTime)) {
      errors.timeRange = 'End time must be after start time';
    }
    if (!form.selectedBus) errors.selectedBus = 'Please select a bus';
    if (form.passengers < 1) errors.passengers = 'Must have at least 1 passenger';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setShowConfirmation(true);
  };

  const confirmRequest = () => {
    const selectedBus = mockBuses.find(bus => bus.id === form.selectedBus);
    
    const newRequest = {
      id: Date.now(),
      busId: form.selectedBus,
      busName: selectedBus.name,
      title: form.reason,
      start: new Date(form.startTime),
      end: new Date(form.endTime),
      passengers: form.passengers,
      files: form.files,
      status: 'pending',
      submittedAt: new Date()
    };
    
    setSubmittedRequests(prev => [newRequest, ...prev]);
    
    setForm({
      reason: '',
      startTime: '',
      endTime: '',
      selectedBus: '',
      passengers: 1,
      files: []
    });
    
    setShowConfirmation(false);
    setActiveTab('history');
  };

  const ConflictDisplay = ({ conflicts }) => {
    if (conflicts.length === 0) return null;
  
    return (
      <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
        <h4 className="font-bold text-red-800">⚠️ Bus Already Booked For:</h4>
        <ul className="mt-2 space-y-2">
          {conflicts.map((conflict, index) => (
            <li key={index} className="text-sm text-red-700">
              • <span className="font-medium">{conflict.title}</span>: {moment(conflict.start).format('MMM D, h:mm A')} - {moment(conflict.end).format('h:mm A')}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-red-600">
          Please choose a different time or bus.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
        Apply For A Bus
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Request a bus for special events by selecting an available bus and submitting your purpose and schedule.
      </p>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'request' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('request')}
        >
          New Request
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('history')}
        >
          My Requests
        </button>
      </div>

      {activeTab === 'request' && (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-100"
        >
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Reason for Borrowing
            </label>
            <textarea
              name="reason"
              rows="4"
              placeholder="Enter reason (e.g., field trip, competition, etc.)"
              className={`w-full p-3 border ${validationErrors.reason ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={handleChange}
              value={form.reason}
              required
            />
            {validationErrors.reason && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.reason}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Number of Passengers
            </label>
            <input
              type="number"
              name="passengers"
              min="1"
              className={`w-full p-3 border ${validationErrors.passengers ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={handleChange}
              value={form.passengers}
              required
            />
            {validationErrors.passengers && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.passengers}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              className={`w-full p-3 border ${validationErrors.startTime || validationErrors.timeRange ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={handleChange}
              value={form.startTime}
              required
            />
            {validationErrors.startTime && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.startTime}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              className={`w-full p-3 border ${validationErrors.endTime || validationErrors.timeRange ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={handleChange}
              value={form.endTime}
              required
            />
            {(validationErrors.endTime || validationErrors.timeRange) && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.endTime || validationErrors.timeRange}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Choose Available Bus
              {form.startTime && form.endTime && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Showing availability for selected time)
                </span>
              )}
            </label>
            <select
              name="selectedBus"
              className={`w-full p-3 border ${validationErrors.selectedBus ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={handleChange}
              value={form.selectedBus}
              required
              disabled={!form.startTime || !form.endTime}
            >
              <option value="">{form.startTime && form.endTime ? 'Select a bus' : 'Select time first'}</option>
              {availableBuses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} (Capacity: {bus.capacity})
                </option>
              ))}
            </select>
            {validationErrors.selectedBus && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.selectedBus}</p>
            )}
            {availableBuses.length === 0 && form.startTime && form.endTime && !validationErrors.timeRange && (
              <p className="mt-2 text-sm text-yellow-600">No buses available for the selected time range.</p>
            )}
            
            {form.selectedBus && (
              <ConflictDisplay conflicts={conflictingSchedules} />
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Supporting Documents (PDF, JPG, PNG, DOC - Max 5MB each)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
            
            {form.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="space-y-1">
                  {form.files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
              disabled={availableBuses.length === 0 || conflictingSchedules.length > 0}
            >
              Submit Request
            </button>
          </div>
        </form>
      )}

      {activeTab === 'history' && (
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">My Bus Requests</h3>
          {submittedRequests.length === 0 ? (
            <p className="text-gray-500">You haven't submitted any requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submittedRequests.map(request => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{request.busName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(request.start).format('MMM D, YYYY h:mm A')} - {moment(request.end).format('h:mm A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.passengers}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.files.length > 0 ? (
                          <span className="text-blue-600">Attached ({request.files.length})</span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Bus Request</h3>
            <p className="mb-2"><strong>Bus:</strong> {mockBuses.find(b => b.id === form.selectedBus)?.name}</p>
            <p className="mb-2"><strong>Reason:</strong> {form.reason}</p>
            <p className="mb-2"><strong>Passengers:</strong> {form.passengers}</p>
            <p className="mb-2"><strong>Files:</strong> {form.files.length} attached</p>
            <p className="mb-4">
              <strong>Time:</strong> {moment(form.startTime).format('MMM D, YYYY h:mm A')} - {moment(form.endTime).format('h:mm A')}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmRequest}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowBus;