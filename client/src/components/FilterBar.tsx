import React from 'react';

interface FilterBarProps {
  search: string;
  status: string;
  source: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  status,
  source,
  sort,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onSortChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name or email..."
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      >
        <option value="">All Status</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      >
        <option value="">All Sources</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default FilterBar;