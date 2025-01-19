'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [grimoires, setGrimoires] = useState([]);
  const [selectedGrimoires, setSelectedGrimoires] = useState([]);
  const [filters, setFilters] = useState({
    oblivion: true,
    spirituality: true,
    salvation: true,
    awakening: true
  });

  // Load grimoires from JSON
  useEffect(() => {
    fetch('grimoires.json')
      .then(response => response.json())
      .then(data => setGrimoires(data.grimoires || []))
      .catch(error => console.error('Error fetching grimoires:', error));
  }, []);

  // Load selected grimoires from localStorage
  useEffect(() => {
    const storedGrimoires = JSON.parse(localStorage.getItem('selectedGrimoires')) || [];
    setSelectedGrimoires(storedGrimoires);
  }, []);

  // Add or remove grimoire from localStorage
  const handleCardClick = (grimoire) => {
    const isAlreadySelected = selectedGrimoires.some(selected => selected.name === grimoire.name);
    let updatedGrimoires;

    if (isAlreadySelected) {
      updatedGrimoires = selectedGrimoires.filter(selected => selected.name !== grimoire.name);
    } else {
      updatedGrimoires = [...selectedGrimoires, grimoire];
    }

    setSelectedGrimoires(updatedGrimoires);
    localStorage.setItem('selectedGrimoires', JSON.stringify(updatedGrimoires));
  };

  // Check if a grimoire is selected
  const isGrimoireSelected = (grimoire) => selectedGrimoires.some(selected => selected.name === grimoire.name);

  // Handle filter changes
  const handleFilterChange = (category) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: !prevFilters[category]
    }));
  };

  // Filter grimoires based on active filters
  const filteredGrimoires = grimoires.filter(grimoire => filters[grimoire.category]);

  // Group grimoires by category
  const groupedGrimoires = filteredGrimoires.reduce((acc, grimoire) => {
    if (!acc[grimoire.category]) {
      acc[grimoire.category] = [];
    }
    acc[grimoire.category].push(grimoire);
    return acc;
  }, {});

  return (
    <div>
      <div className='control-panel'>
        <h3>Filter by Category:</h3>
        {Object.keys(filters).map(category => (
          <label key={category} style={{ marginRight: '10px' }}>
            <input
              type='checkbox'
              checked={filters[category]}
              onChange={() => handleFilterChange(category)}
            />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </label>
        ))}
      </div>

      <div className='grimoire-container'>
        {Object.entries(groupedGrimoires).map(([category, grimoires]) => (
          <div key={category}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            {grimoires.map((grimoire, index) => (
              <div
                className={`grimoire-card ${grimoire.category} ${isGrimoireSelected(grimoire) ? 'selected' : ''}`}
                key={grimoire.name}
                onClick={() => handleCardClick(grimoire)}
              >
                <h2>{grimoire.name}</h2>
                <p>{grimoire.source}</p>
                <span>{grimoire.full_text}</span>
                <footer>{grimoire.index}</footer>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
