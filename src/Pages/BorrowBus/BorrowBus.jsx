import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import { 
  FiCalendar, 
  FiUsers, 
  FiMapPin, 
  FiClock, 
  FiBriefcase,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiHelpCircle
} from 'react-icons/fi';
import { format } from 'date-fns';

const BorrowBus = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  
  const [applicationForm, setApplicationForm] = useState({
    purpose: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    numberOfPeople: 1,
    busType: 'non-ac',
    specialRequirements: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    durationHours: 1,
    department: '',
    facultyInCharge: ''
  });

  const [activeStep, setActiveStep] = useState(1);
  const [showGuidelines, setShowGuidelines] = useState(true);

  // Fetch user's previous applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['borrow-bus-applications'],
    queryFn: async () => {
      const res = await axios.get('/api/borrow-bus/applications');
      return res.data?.data || [];
    },
  });

  // Fetch available bus types
  const { data: busTypes } = useQuery({
    queryKey: ['bus-types'],
    queryFn: async () => {
      const res = await axios.get('/api/buses/types');
      return res.data?.data || [];
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('/api/borrow-bus/apply', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrow-bus-applications'] });
      setActiveStep(4); // Show success step
      setApplicationForm({
        purpose: '',
        eventName: '',
        eventDate: '',
        eventTime: '',
        pickupLocation: '',
        dropoffLocation: '',
        numberOfPeople: 1,
        busType: 'non-ac',
        specialRequirements: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        durationHours: 1,
        department: '',
        facultyInCharge: ''
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      submitApplicationMutation.mutate(applicationForm);
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 1:
        return applicationForm.purpose && applicationForm.eventName && applicationForm.eventDate;
      case 2:
        return applicationForm.pickupLocation && applicationForm.dropoffLocation && applicationForm.numberOfPeople > 0;
      case 3:
        return applicationForm.contactPerson && applicationForm.contactPhone && applicationForm.contactEmail;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setActiveStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const applicationPurposes = [
    { value: 'academic', label: 'Academic Trip/Field Visit', icon: '📚' },
    { value: 'cultural', label: 'Cultural Event/Program', icon: '🎭' },
    { value: 'sports', label: 'Sports Competition', icon: '⚽' },
    { value: 'workshop', label: 'Workshop/Seminar', icon: '💼' },
    { value: 'competition', label: 'Competition/Contest', icon: '🏆' },
    { value: 'other', label: 'Other Special Requirement', icon: '📋' }
  ];

  const busTypeOptions = [
    { value: 'non-ac', label: 'Non-AC Bus (40 seats)', capacity: 40 },
    { value: 'ac', label: 'AC Bus (35 seats)', capacity: 35 },
    { value: 'minibus', label: 'Minibus (25 seats)', capacity: 25 },
    { value: 'microbus', label: 'Microbus (12 seats)', capacity: 12 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Special Bus Service Request
          </h1>
          <p className="text-gray-600">
            Apply for special bus services for events, trips, or group transportation needs
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Application Form */}
          <div className="lg:col-span-2">
            {/* Guidelines */}
            {showGuidelines && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    <FiHelpCircle /> Important Guidelines
                  </h3>
                  <button 
                    onClick={() => setShowGuidelines(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Hide
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Applications must be submitted at least 72 hours before the event</li>
                  <li>• Department approval is required for all applications</li>
                  <li>• Bus availability is subject to existing schedules</li>
                  <li>• Additional charges may apply for special requirements</li>
                  <li>• Contact transport office for urgent requests</li>
                </ul>
              </div>
            )}

            {/* Application Form Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8 relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex flex-col items-center relative">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                      ${activeStep >= step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'}
                    `}>
                      {activeStep > step ? <FiCheckCircle /> : step}
                    </div>
                    <span className="text-sm mt-2 font-medium">
                      {step === 1 && 'Event Details'}
                      {step === 2 && 'Transport Info'}
                      {step === 3 && 'Contact Info'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                {/* Step 1: Event Details */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Event Information</h3>
                    
                    {/* Purpose Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Purpose of Request *</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {applicationPurposes.map(purpose => (
                          <button
                            key={purpose.value}
                            type="button"
                            onClick={() => handleChange({ target: { name: 'purpose', value: purpose.value } })}
                            className={`
                              p-4 border rounded-xl text-left transition-all
                              ${applicationForm.purpose === purpose.value 
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                          >
                            <div className="text-2xl mb-2">{purpose.icon}</div>
                            <div className="font-medium">{purpose.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Name & Date */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Event Name *</span>
                        </label>
                        <input
                          type="text"
                          name="eventName"
                          value={applicationForm.eventName}
                          onChange={handleChange}
                          placeholder="e.g., Annual Cultural Fest, Field Trip"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Event Date *</span>
                        </label>
                        <input
                          type="date"
                          name="eventDate"
                          value={applicationForm.eventDate}
                          onChange={handleChange}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                    </div>

                    {/* Time & Duration */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Event Time *</span>
                        </label>
                        <input
                          type="time"
                          name="eventTime"
                          value={applicationForm.eventTime}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Duration (hours) *</span>
                        </label>
                        <select
                          name="durationHours"
                          value={applicationForm.durationHours}
                          onChange={handleChange}
                          className="select select-bordered w-full"
                          required
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                            <option key={hour} value={hour}>{hour} {hour === 1 ? 'hour' : 'hours'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Department & Faculty */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Department *</span>
                        </label>
                        <select
                          name="department"
                          value={applicationForm.department}
                          onChange={handleChange}
                          className="select select-bordered w-full"
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="cse">Computer Science & Engineering</option>
                          <option value="eee">Electrical & Electronic Engineering</option>
                          <option value="bba">Business Administration</option>
                          <option value="law">Law</option>
                          <option value="english">English</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Faculty In-Charge</span>
                        </label>
                        <input
                          type="text"
                          name="facultyInCharge"
                          value={applicationForm.facultyInCharge}
                          onChange={handleChange}
                          placeholder="Faculty name (if applicable)"
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Transport Information */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Transport Details</h3>
                    
                    {/* Pickup & Dropoff Locations */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            <FiMapPin /> Pickup Location *
                          </span>
                        </label>
                        <input
                          type="text"
                          name="pickupLocation"
                          value={applicationForm.pickupLocation}
                          onChange={handleChange}
                          placeholder="e.g., DIU Main Gate, Sector-4"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            <FiMapPin /> Drop-off Location *
                          </span>
                        </label>
                        <input
                          type="text"
                          name="dropoffLocation"
                          value={applicationForm.dropoffLocation}
                          onChange={handleChange}
                          placeholder="e.g., National Museum, Farmgate"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                    </div>

                    {/* Number of People & Bus Type */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium flex items-center gap-2">
                            <FiUsers /> Number of People *
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="numberOfPeople"
                            value={applicationForm.numberOfPeople}
                            onChange={handleChange}
                            min="1"
                            max="100"
                            className="input input-bordered w-full"
                            required
                          />
                          <div className="absolute right-3 top-3 text-gray-500">
                            persons
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Bus Type Preference *</span>
                        </label>
                        <select
                          name="busType"
                          value={applicationForm.busType}
                          onChange={handleChange}
                          className="select select-bordered w-full"
                          required
                        >
                          {busTypeOptions.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Bus Capacity Warning */}
                    {applicationForm.numberOfPeople > busTypeOptions.find(b => b.value === applicationForm.busType)?.capacity && (
                      <div className="alert alert-warning">
                        <FiAlertCircle />
                        <span>
                          Number of people ({applicationForm.numberOfPeople}) exceeds capacity of selected bus type. 
                          Consider requesting multiple buses or a larger bus.
                        </span>
                      </div>
                    )}

                    {/* Special Requirements */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Special Requirements</span>
                      </label>
                      <textarea
                        name="specialRequirements"
                        value={applicationForm.specialRequirements}
                        onChange={handleChange}
                        placeholder="Any special requirements (wheelchair access, extra luggage space, specific timing, etc.)"
                        className="textarea textarea-bordered w-full h-32"
                        rows="4"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                    
                    {/* Contact Person */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Contact Person Name *</span>
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={applicationForm.contactPerson}
                        onChange={handleChange}
                        placeholder="Full name of contact person"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    {/* Contact Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Phone Number *</span>
                        </label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={applicationForm.contactPhone}
                          onChange={handleChange}
                          placeholder="01XXXXXXXXX"
                          pattern="[0-9]{11}"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">Email Address *</span>
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={applicationForm.contactEmail}
                          onChange={handleChange}
                          placeholder="your.email@diu.edu.bd"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary" 
                            required 
                          />
                          <span className="label-text">
                            I agree to the terms and conditions. I understand that:
                            <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
                              <li>This application is subject to approval by the transport department</li>
                              <li>I am responsible for the group's behavior during the trip</li>
                              <li>Any damages to the bus will be charged accordingly</li>
                              <li>I must ensure the bus returns on time as scheduled</li>
                            </ul>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Step */}
                {activeStep === 4 && (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiCheckCircle className="text-4xl text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Your special bus request has been submitted. You'll receive a confirmation email within 24 hours. 
                      Application ID: <span className="font-bold">SB#{Date.now().toString().slice(-6)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep(1);
                        setShowGuidelines(true);
                      }}
                      className="btn btn-primary"
                    >
                      Submit Another Request
                    </button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {activeStep <= 3 && (
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`btn btn-outline ${activeStep === 1 ? 'invisible' : ''}`}
                    >
                      Previous
                    </button>
                    
                    {activeStep === 3 ? (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitApplicationMutation.isPending}
                      >
                        {submitApplicationMutation.isPending ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <FiArrowRight className="ml-2" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                        disabled={!validateStep()}
                      >
                        Continue
                        <FiArrowRight className="ml-2" />
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Information & Previous Applications */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiBriefcase /> Important Information
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <FiClock className="text-blue-600 mt-1" />
                  <span>Processing Time: 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertCircle className="text-blue-600 mt-1" />
                  <span>Minimum notice: 72 hours before event</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiUsers className="text-blue-600 mt-1" />
                  <span>Minimum group size: 15 people</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiFileText className="text-blue-600 mt-1" />
                  <span>Department approval required</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Need urgent assistance?</p>
                <a href="tel:+880XXXXXXXXXX" className="font-bold text-blue-600 hover:text-blue-800">
                  📞 Contact Transport Office: +880 XX-XXXX-XXXX
                </a>
              </div>
            </div>

            {/* Previous Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText /> Previous Applications
              </h3>
              
              {isLoading ? (
                <div className="text-center py-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : applications?.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No previous applications
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {applications?.slice(0, 5).map((app, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{app.eventName}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {new Date(app.eventDate).toLocaleDateString()} • {app.numberOfPeople} people
                      </div>
                      <div className="text-xs text-gray-500">
                        Bus: {app.busType?.toUpperCase()} • ID: {app.applicationId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {applications?.length > 0 && (
                <button className="btn btn-outline btn-sm w-full mt-4">
                  View All Applications
                </button>
              )}
            </div>

            {/* Bus Types Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Available Bus Types</h3>
              <div className="space-y-3">
                {busTypeOptions.map(type => (
                  <div key={type.value} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{type.label.split('(')[0]}</div>
                      <div className="text-sm text-gray-600">Capacity: {type.capacity} seats</div>
                    </div>
                    <div className="text-sm font-medium">
                      {type.value === 'ac' ? 'Premium' : 'Standard'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowBus;