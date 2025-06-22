import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { SymptomTemplate } from '../types';
import { symptomDatabase, symptomCategories } from '../data/symptomDatabase';

interface SymptomSelectorProps {
  onSymptomSelect: (symptom: SymptomTemplate) => void;
  selectedSymptomIds: string[];
}

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  onSymptomSelect,
  selectedSymptomIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredSymptoms = useMemo(() => {
    return symptomDatabase.filter(symptom => {
      const matchesSearch = symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           symptom.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || symptom.category === selectedCategory;
      const notAlreadySelected = !selectedSymptomIds.includes(symptom.id);
      
      return matchesSearch && matchesCategory && notAlreadySelected;
    });
  }, [searchTerm, selectedCategory, selectedSymptomIds]);

  const groupedSymptoms = useMemo(() => {
    const groups: { [key: string]: SymptomTemplate[] } = {};
    filteredSymptoms.forEach(symptom => {
      if (!groups[symptom.category]) {
        groups[symptom.category] = [];
      }
      groups[symptom.category].push(symptom);
    });
    return groups;
  }, [filteredSymptoms]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Add Symptoms from Database</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className={`h-4 w-4 mr-1 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
          {isExpanded ? 'Close' : 'Browse Symptoms'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                <option value="All">All Categories</option>
                {symptomCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {filteredSymptoms.length} symptom{filteredSymptoms.length !== 1 ? 's' : ''} available
          </div>

          {/* Symptom Groups */}
          <div className="max-h-96 overflow-y-auto space-y-4">
            {Object.keys(groupedSymptoms).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No symptoms found matching your criteria.</p>
                <p className="text-sm mt-1">Try adjusting your search or filter.</p>
              </div>
            ) : (
              Object.entries(groupedSymptoms).map(([category, symptoms]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {symptoms.map(symptom => (
                      <button
                        key={symptom.id}
                        onClick={() => onSymptomSelect(symptom)}
                        className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-blue-700">
                          {symptom.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {symptom.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Common locations: {symptom.commonLocations.slice(0, 2).join(', ')}
                          {symptom.commonLocations.length > 2 && '...'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};