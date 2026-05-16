import React from 'react';
import { ILead } from '../types';
import { useAuth } from '../context/AuthContext';

interface LeadTableProps {
  leads: ILead[];
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Qualified: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
};

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, loading }) => {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-gray-500 text-lg">Loading leads...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-gray-500 text-lg">No leads found</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-4 text-gray-600 font-semibold">Name</th>
            <th className="text-left p-4 text-gray-600 font-semibold">Email</th>
            <th className="text-left p-4 text-gray-600 font-semibold">Status</th>
            <th className="text-left p-4 text-gray-600 font-semibold">Source</th>
            <th className="text-left p-4 text-gray-600 font-semibold">Created At</th>
            <th className="text-left p-4 text-gray-600 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-gray-800">{lead.name}</td>
              <td className="p-4 text-gray-600">{lead.email}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="p-4 text-gray-600">{lead.source}</td>
              <td className="p-4 text-gray-600">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 flex gap-2">
                <button
                  onClick={() => onEdit(lead)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                >
                  Edit
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;