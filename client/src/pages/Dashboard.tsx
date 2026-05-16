import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { ILead, IPagination } from '../types';
import { useAuth } from '../context/AuthContext';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import useDebounce from '../hooks/useDebounce';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<ILead[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState<ILead | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10, sort };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (source) params.source = source;

      const res = await API.get('/leads', { params });
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, source, sort]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await API.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete lead', err);
    }
  };

  const handleEdit = (lead: ILead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  const handleExportCSV = async () => {
    try {
      const res = await API.get('/leads/export/csv', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Smart Leads Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Leads</h2>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                setEditLead(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          search={search}
          status={status}
          source={source}
          sort={sort}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          onStatusChange={(val) => { setStatus(val); setPage(1); }}
          onSourceChange={(val) => { setSource(val); setPage(1); }}
          onSortChange={(val) => { setSort(val); setPage(1); }}
        />

        {/* Lead Table */}
        <LeadTable
          leads={leads}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && leads.length > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={editLead}
          onClose={() => setShowForm(false)}
          onSuccess={fetchLeads}
        />
      )}
    </div>
  );
};

export default Dashboard;