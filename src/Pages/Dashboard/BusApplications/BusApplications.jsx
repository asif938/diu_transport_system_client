import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import useAxios from '../../hooks/useAxios';
import { 
  FiFilter, 
  FiSearch, 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiRefreshCw,
  FiCalendar,
  FiUsers,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiDownload,
  FiPrinter,
  FiMessageSquare,
  FiAlertCircle,
  FiDollarSign,
  FiCheck
} from 'react-icons/fi';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import useAxios from '../../../hooks/useAxios';

const BusApplications = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    dateRange: 'all',
    busType: 'all',
    search: ''
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [assignForm, setAssignForm] = useState({
    assignedBus: '',
    assignedDriver: '',
    cost: 0,
    paymentStatus: 'pending'
  });

  // Fetch all applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-bus-applications'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/borrow-bus/applications');
      return res.data?.data || [];
    },
  });

  // Fetch available buses
  const { data: buses } = useQuery({
    queryKey: ['available-buses'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/buses/available');
      return res.data?.data || [];
    },
  });

  // Fetch drivers
  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/drivers');
      return res.data?.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status, remarks }) => {
      const res = await axios.put(`/api/admin/borrow-bus/applications/${applicationId}/status`, {
        status,
        remarks
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bus-applications'] });
      setShowDetailsModal(false);
      setRemarks('');
    },
  });

  const assignBusMutation = useMutation({
    mutationFn: async ({ applicationId, data }) => {
      const res = await axios.post(`/api/admin/borrow-bus/applications/${applicationId}/assign`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bus-applications'] });
      setShowAssignModal(false);
      setAssignForm({
        assignedBus: '',
        assignedDriver: '',
        cost: 0,
        paymentStatus: 'pending'
      });
    },
  });

  // Filter applications
  const filteredApplications = applications?.filter(app => {
    // Status filter
    if (filters.status !== 'all' && app.status !== filters.status) return false;
    
    // Department filter
    if (filters.department !== 'all' && app.department !== filters.department) return false;
    
    // Bus type filter
    if (filters.busType !== 'all' && app.busType !== filters.busType) return false;
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const appDate = parseISO(app.eventDate);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (!isSameDay(appDate, today)) return false;
          break;
        case 'upcoming':
          if (!isAfter(appDate, today)) return false;
          break;
        case 'past':
          if (!isBefore(appDate, today)) return false;
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (isBefore(appDate, today) || isAfter(appDate, weekFromNow)) return false;
          break;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        app.eventName?.toLowerCase().includes(searchLower) ||
        app.applicationId?.toLowerCase().includes(searchLower) ||
        app.contactPerson?.toLowerCase().includes(searchLower) ||
        app.studentName?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }) || [];

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleStatusUpdate = (status) => {
    if (!selectedApplication) return;
    updateStatusMutation.mutate({
      applicationId: selectedApplication._id,
      status,
      remarks
    });
  };

  const handleAssignBus = () => {
    if (!selectedApplication) return;
    assignBusMutation.mutate({
      applicationId: selectedApplication._id,
      data: assignForm
    });
  };

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Bus Applications Report', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 105, 30, { align: 'center' });
    
    // Summary
    doc.setFontSize(12);
    doc.text('Summary', 14, 40);
    
    const summaryData = [
      ['Total Applications', applications?.length || 0],
      ['Pending', applications?.filter(a => a.status === 'pending').length || 0],
      ['Approved', applications?.filter(a => a.status === 'approved').length || 0],
      ['Rejected', applications?.filter(a => a.status === 'rejected').length || 0],
      ['Completed', applications?.filter(a => a.status === 'completed').length || 0]
    ];
    
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Count']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Detailed Table
    doc.text('Application Details', 14, doc.lastAutoTable.finalY + 10);
    
    const tableData = filteredApplications.map(app => [
      app.applicationId,
      app.eventName,
      app.department,
      app.busType,
      format(parseISO(app.eventDate), 'dd/MM/yyyy'),
      app.status,
      app.cost || 'N/A'
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['ID', 'Event', 'Department', 'Bus Type', 'Date', 'Status', 'Cost']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        6: { cellWidth: 25 }
      }
    });

    doc.save(`bus-applications-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentName = (code) => {
    const departments = {
      'cse': 'Computer Science & Engineering',
      'eee': 'Electrical & Electronic Engineering',
      'bba': 'Business Administration',
      'law': 'Law',
      'english': 'English',
      'other': 'Other'
    };
    return departments[code] || code;
  };

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(a => a.status === 'pending').length || 0,
    approved: applications?.filter(a => a.status === 'approved').length || 0,
    rejected: applications?.filter(a => a.status === 'rejected').length || 0,
    completed: applications?.filter(a => a.status === 'completed').length || 0
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bus Applications Management</h1>
          <p className="text-gray-600 mt-1">Manage and process special bus service requests</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            className="btn btn-outline flex items-center gap-2"
          >
            <FiDownload /> Export Report
          </button>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-bus-applications'] })}
            className="btn btn-outline flex items-center gap-2"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500', icon: <FiCalendar /> },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', icon: <FiAlertCircle /> },
          { label: 'Approved', value: stats.approved, color: 'bg-green-500', icon: <FiCheckCircle /> },
          { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', icon: <FiXCircle /> },
          { label: 'Completed', value: stats.completed, color: 'bg-purple-500', icon: <FiCheck /> }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter />
          <h3 className="font-bold">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by event, ID, or contact..."
                className="input input-bordered w-full pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Department Filter */}
          <select
            className="select select-bordered"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="all">All Departments</option>
            <option value="cse">CSE</option>
            <option value="eee">EEE</option>
            <option value="bba">BBA</option>
            <option value="law">Law</option>
            <option value="english">English</option>
            <option value="other">Other</option>
          </select>

          {/* Date Range Filter */}
          <select
            className="select select-bordered"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Next 7 Days</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            className="select select-bordered"
            value={filters.busType}
            onChange={(e) => setFilters({ ...filters, busType: e.target.value })}
          >
            <option value="all">All Bus Types</option>
            <option value="non-ac">Non-AC Bus</option>
            <option value="ac">AC Bus</option>
            <option value="minibus">Minibus</option>
            <option value="microbus">Microbus</option>
          </select>
          
          <button
            onClick={() => setFilters({
              status: 'all',
              department: 'all',
              dateRange: 'all',
              busType: 'all',
              search: ''
            })}
            className="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <FiSearch className="text-4xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">Try changing your filters or check back later</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th>Application ID</th>
                  <th>Event Details</th>
                  <th>Contact Info</th>
                  <th>Date & Time</th>
                  <th>Bus Type</th>
                  <th>People</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td>
                      <div className="font-bold text-blue-600">{application.applicationId}</div>
                      <div className="text-xs text-gray-500">{getDepartmentName(application.department)}</div>
                    </td>
                    <td>
                      <div className="font-medium">{application.eventName}</div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="text-xs" />
                          {application.pickupLocation} → {application.dropoffLocation}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{application.contactPerson}</div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiPhone className="text-xs" />
                          {application.contactPhone}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMail className="text-xs" />
                          {application.contactEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {format(parseISO(application.eventDate), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiClock className="text-xs" />
                          {application.eventTime} • {application.durationHours}h
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        application.busType === 'ac' ? 'bg-blue-100 text-blue-800' :
                        application.busType === 'minibus' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {application.busType?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FiUsers className="text-gray-400" />
                        {application.numberOfPeople}
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status?.toUpperCase()}
                      </span>
                      {application.cost > 0 && (
                        <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <FiDollarSign /> {application.cost} BDT
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailsModal(true);
                          }}
                          className="btn btn-sm btn-outline flex items-center gap-1"
                        >
                          <FiEye /> View
                        </button>
                        {application.status === 'pending' && (
                          <div className="dropdown dropdown-left">
                            <label tabIndex={0} className="btn btn-sm btn-primary">Actions</label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li>
                                <button onClick={() => {
                                  setSelectedApplication(application);
                                  setRemarks('');
                                  updateStatusMutation.mutate({
                                    applicationId: application._id,
                                    status: 'approved',
                                    remarks: ''
                                  });
                                }}>
                                  <FiCheckCircle /> Approve
                                </button>
                              </li>
                              <li>
                                <button onClick={() => {
                                  setSelectedApplication(application);
                                  setShowAssignModal(true);
                                }}>
                                  <FiCheckCircle /> Assign Bus
                                </button>
                              </li>
                              <li>
                                <button onClick={() => {
                                  setSelectedApplication(application);
                                  setRemarks('');
                                  setShowDetailsModal(true);
                                }}>
                                  <FiMessageSquare /> Add Remarks
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-2xl mb-6">Application Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="label">Application ID</label>
                  <div className="font-bold text-lg">{selectedApplication.applicationId}</div>
                </div>
                
                <div>
                  <label className="label">Event Information</label>
                  <div className="space-y-2">
                    <div className="font-medium">{selectedApplication.eventName}</div>
                    <div className="text-sm text-gray-600">
                      Purpose: {selectedApplication.purpose?.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Department: {getDepartmentName(selectedApplication.department)}
                    </div>
                    {selectedApplication.facultyInCharge && (
                      <div className="text-sm text-gray-600">
                        Faculty In-Charge: {selectedApplication.facultyInCharge}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Date & Time</label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      {format(parseISO(selectedApplication.eventDate), 'PPPP')}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      {selectedApplication.eventTime} • Duration: {selectedApplication.durationHours} hours
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Transport Details</label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-green-500" />
                      Pickup: {selectedApplication.pickupLocation}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-red-500" />
                      Drop-off: {selectedApplication.dropoffLocation}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers />
                      {selectedApplication.numberOfPeople} people • {selectedApplication.busType?.toUpperCase()} Bus
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="label">Contact Information</label>
                  <div className="space-y-2">
                    <div className="font-medium">{selectedApplication.contactPerson}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiPhone />
                      {selectedApplication.contactPhone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiMail />
                      {selectedApplication.contactEmail}
                    </div>
                    {selectedApplication.studentName && (
                      <div className="text-sm text-gray-600">
                        Student: {selectedApplication.studentName} ({selectedApplication.studentId})
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Special Requirements</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {selectedApplication.specialRequirements || 'No special requirements'}
                  </div>
                </div>

                <div>
                  <label className="label">Current Status</label>
                  <div className={`inline-block px-3 py-1 rounded-full ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status?.toUpperCase()}
                  </div>
                  {selectedApplication.remarks && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                      <strong>Remarks:</strong> {selectedApplication.remarks}
                    </div>
                  )}
                  {selectedApplication.assignedBus && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <strong>Assigned Bus:</strong> {selectedApplication.assignedBus?.busNumber} - {selectedApplication.assignedBus?.busName}
                    </div>
                  )}
                  {selectedApplication.cost > 0 && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-sm flex items-center gap-1">
                      <FiDollarSign />
                      <strong>Cost:</strong> {selectedApplication.cost} BDT • Payment: {selectedApplication.paymentStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            {selectedApplication.status === 'pending' && (
              <div className="border-t pt-6 mt-6">
                <h4 className="font-bold mb-4">Update Status</h4>
                <div className="space-y-4">
                  <div>
                    <label className="label">Remarks (Optional)</label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Add remarks for the applicant..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows="3"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      className="btn btn-success flex-1"
                      disabled={updateStatusMutation.isPending}
                    >
                      <FiCheckCircle /> Approve Application
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      className="btn btn-error flex-1"
                      disabled={updateStatusMutation.isPending}
                    >
                      <FiXCircle /> Reject Application
                    </button>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="btn btn-primary flex-1"
                    >
                      Assign Bus
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setRemarks('');
                }}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Bus Modal */}
      {showAssignModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-6">Assign Bus to Application</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Select Bus</label>
                <select
                  className="select select-bordered w-full"
                  value={assignForm.assignedBus}
                  onChange={(e) => setAssignForm({ ...assignForm, assignedBus: e.target.value })}
                >
                  <option value="">Select a bus</option>
                  {buses?.filter(bus => bus.status === 'available').map(bus => (
                    <option key={bus._id} value={bus._id}>
                      {bus.busNumber} - {bus.busName} ({bus.type?.toUpperCase()}, {bus.capacity} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Select Driver</label>
                <select
                  className="select select-bordered w-full"
                  value={assignForm.assignedDriver}
                  onChange={(e) => setAssignForm({ ...assignForm, assignedDriver: e.target.value })}
                >
                  <option value="">Select a driver</option>
                  {drivers?.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} - {driver.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Cost (BDT)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={assignForm.cost}
                  onChange={(e) => setAssignForm({ ...assignForm, cost: parseInt(e.target.value) || 0 })}
                  min="0"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Enter 0 for free service or waived charges
                </div>
              </div>

              <div>
                <label className="label">Payment Status</label>
                <select
                  className="select select-bordered w-full"
                  value={assignForm.paymentStatus}
                  onChange={(e) => setAssignForm({ ...assignForm, paymentStatus: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="waived">Waived</option>
                  <option value="free">Free Service</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAssignBus}
                  className="btn btn-primary flex-1"
                  disabled={assignBusMutation.isPending || !assignForm.assignedBus}
                >
                  {assignBusMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Assigning...
                    </>
                  ) : (
                    'Assign & Approve'
                  )}
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusApplications;