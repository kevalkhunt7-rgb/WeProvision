import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, Clock, Eye, Trash2, ShieldAlert } from 'lucide-react';
import SearchFilterBar from '../components/SearchFilterBar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import InquiryDetailModal from '../components/InquiryDetailModal';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

import { toast } from 'react-hot-toast';

const InquiriesManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await api.getInquiries();
        const data = res.data || res;
        if (Array.isArray(data)) {
          setInquiries(data);
        }
      } catch (err) {
        console.warn('API inquiries fetch error:', err.message);
        setInquiries([]);
      }
    };
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      await api.updateInquiryStatus(id, newStatus);
      toast.success(`Inquiry status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry record?')) {
      try {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        await api.deleteInquiry(id);
        toast.success('Inquiry record deleted permanently');
      } catch (err) {
        toast.error(err.message || 'Failed to delete inquiry from server');
        // Sync back on failure
        const res = await api.getInquiries().catch(() => null);
        if (res) {
          const data = res.data || res;
          if (Array.isArray(data)) setInquiries(data);
        }
      }
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Client / Company',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.name}</div>
          <div className="text-[11px] text-slate-400">{row.company}</div>
        </div>
      )
    },
    {
      header: 'Service Requested',
      accessor: 'service',
      render: (row) => <span className="text-xs font-semibold text-purple-300">{row.service}</span>
    },
    {
      header: 'Budget Range',
      accessor: 'budget',
      render: (row) => <span className="text-xs font-semibold text-emerald-400">{row.budget}</span>
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <Badge variant={row.priority === 'Urgent' ? 'danger' : row.priority === 'High' ? 'purple' : 'default'}>
          {row.priority}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Unread' ? 'purple' : row.status === 'In Progress' ? 'warning' : 'success'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span className="text-xs text-slate-400">{row.date}</span>
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (row.status === 'Unread') handleUpdateStatus(row.id, 'In Progress');
              setSelectedInquiry(row);
            }}
            className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-purple-600 hover:text-white transition-colors"
            title="View Inquiry Details"
          >
            <Eye size={16} />
          </button>
          <select
            value={row.status}
            onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="Unread">Unread</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button
            onClick={() => handleDeleteInquiry(row.id)}
            className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Inquiry"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Mail className="text-purple-400" />
            <span>Contact Inquiries Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and process business leads and enterprise quote requests from WeProvision Contact Page
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search by client name, company, or service..."
        />

        <div className="flex items-center gap-2 mb-6">
          {['All', 'Unread', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <DataTable
        columns={columns}
        data={filteredInquiries}
        emptyMessage="No client inquiries match the specified filter criteria"
      />

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          inquiry={selectedInquiry}
          onInquiryUpdated={(updated) => {
            setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setSelectedInquiry(updated);
          }}
        />
      )}
    </div>
  );
};

export default InquiriesManager;
