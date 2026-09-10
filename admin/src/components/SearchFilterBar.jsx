import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';

const SearchFilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  categories = [], 
  selectedCategory, 
  onCategoryChange,
  onAddNew,
  addNewLabel = 'Add New',
  placeholder = 'Search items...'
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      {/* Search & Category Filter */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        {categories.length > 0 && (
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-4 pr-10 text-sm text-slate-300 focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        )}
      </div>

      {/* Add New Button */}
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>{addNewLabel}</span>
        </button>
      )}
    </div>
  );
};

export default SearchFilterBar;
