"use client";

import { useState, useEffect, useMemo } from 'react';
import { BEADS_LIST, ROSARY_DATA } from '../data/rosary';

export default function Checklist() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTags, setActiveTags] = useState(new Set());
  const [logicMode, setLogicMode] = useState('AND');
  const [checkedBeads, setCheckedBeads] = useState({});
  const [openPanels, setOpenPanels] = useState(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('blasphemous_beads');
    if (saved) setCheckedBeads(JSON.parse(saved));
  }, []);

  const toggleCheck = (name) => {
    const newChecked = { ...checkedBeads, [name]: !checkedBeads[name] };
    setCheckedBeads(newChecked);
    localStorage.setItem('blasphemous_beads', JSON.stringify(newChecked));
  };

  const toggleTag = (tag) => {
    const newTags = new Set(activeTags);
    if (newTags.has(tag)) newTags.delete(tag);
    else newTags.add(tag);
    setActiveTags(newTags);
  };

  const togglePanel = (name) => {
    const newPanels = new Set(); // Close others
    if (!openPanels.has(name)) newPanels.add(name);
    setOpenPanels(newPanels);
  };

  const filteredBeads = useMemo(() => {
    return BEADS_LIST.filter(bead => {
      const matchSearch = bead.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchStatus = true;
      const isChecked = !!checkedBeads[bead.name];
      if (statusFilter === 'checked') matchStatus = isChecked;
      if (statusFilter === 'unchecked') matchStatus = !isChecked;

      let matchTags = true;
      if (activeTags.size > 0) {
        const selectedTagsArray = Array.from(activeTags);
        if (logicMode === 'AND') {
          matchTags = selectedTagsArray.every(tag => bead.tags.includes(tag));
        } else {
          matchTags = selectedTagsArray.some(tag => bead.tags.includes(tag));
        }
      }

      return matchSearch && matchStatus && matchTags;
    });
  }, [searchTerm, statusFilter, activeTags, logicMode, checkedBeads]);

  const checkedVisible = filteredBeads.filter(b => checkedBeads[b.name]).length;
  const totalVisible = filteredBeads.length;
  const progressPercent = totalVisible > 0 ? (checkedVisible / totalVisible) * 100 : 0;
  
  const progressStyle = {
    width: `${progressPercent}%`,
    background: totalVisible > 0 && checkedVisible === totalVisible ? 'linear-gradient(90deg, #d4af37, #fff)' : 'linear-gradient(90deg, #8b0000, #ff0000)',
    boxShadow: totalVisible > 0 && checkedVisible === totalVisible ? '0 0 20px #d4af37' : '0 0 10px #ff0000',
  };

  const clearAll = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setActiveTags(new Set());
    setLogicMode('AND');
  };

  if (!isClient) {
    // Return a skeleton or static layout to avoid hydration mismatch while loading
    return <div className="container" style={{ minHeight: '100vh' }}></div>;
  }

  return (
    <div className="container">
        <header>
            <h1>Rosary Beads</h1>
            <p className="subtitle">Cvstodia Collection Checklist</p>

            <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search for a bead..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoComplete="off" 
                />
                <span className="search-icon">⚲</span>
            </div>

            <div className="filter-section">
                <div className="filter-group">
                    <span className="filter-label">Status:</span>
                    <div className="filter-chips">
                        <button className={`chip ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
                        <button className={`chip ${statusFilter === 'checked' ? 'active' : ''}`} onClick={() => setStatusFilter('checked')}>Checked</button>
                        <button className={`chip ${statusFilter === 'unchecked' ? 'active' : ''}`} onClick={() => setStatusFilter('unchecked')}>Unchecked</button>
                    </div>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Categories:</span>
                    <div className="filter-chips">
                        {['normal', 'dlc', 'ng-plus', 'secret', 'missable', 'true-ending'].map(tag => (
                          <button 
                            key={tag}
                            className={`chip ${activeTags.has(tag) ? 'active' : ''}`} 
                            onClick={() => toggleTag(tag)}
                          >
                            {tag === 'ng-plus' ? 'NG+' : tag === 'true-ending' ? 'True Ending' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </button>
                        ))}
                    </div>
                </div>

                <div className="filter-controls">
                    <div className="logic-toggle-container" title="Determine how multiple categories combine">
                        <span>Logic:</span>
                        <div className="logic-switch">
                            <span className={`logic-option ${logicMode === 'AND' ? 'active' : ''}`} onClick={() => setLogicMode('AND')}>AND</span>
                            <span className={`logic-option ${logicMode === 'OR' ? 'active' : ''}`} onClick={() => setLogicMode('OR')}>OR</span>
                        </div>
                    </div>
                    <button className="clear-btn" onClick={clearAll}>Clear All</button>
                </div>
            </div>

            <div className="progress-section">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={progressStyle}></div>
                </div>
                <span>{checkedVisible} / {totalVisible}</span>
            </div>
        </header>

        <main>
            <ul className="bead-list">
                {filteredBeads.map(bead => {
                  const data = ROSARY_DATA[bead.name] || ROSARY_DATA.Data?.[bead.name];
                  const isOpen = openPanels.has(bead.name);
                  
                  return (
                    <li key={bead.name} className="bead-item">
                      <div className="item-main">
                        {data && data.thumb && <img src={data.thumb} className="bead-thumb" alt={bead.name} />}
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={!!checkedBeads[bead.name]} 
                            onChange={() => toggleCheck(bead.name)}
                          />
                          <span className="checkmark"></span>
                          <span className="item-name">
                             {bead.name}
                             {bead.tags.filter(t => t !== 'normal').map(t => (
                               <span key={t} className={`tag ${t === 'ng-plus' ? 'ng-plus' : ''}`}>
                                 {t === 'ng-plus' ? 'NG+' : t === 'true-ending' ? 'True Ending' : t.charAt(0).toUpperCase() + t.slice(1)}
                               </span>
                             ))}
                          </span>
                        </label>
                        <button className={`details-toggle ${isOpen ? 'active' : ''}`} onClick={() => togglePanel(bead.name)}>&gt;</button>
                      </div>
                      
                      <div className={`details-panel ${isOpen ? 'open' : ''}`}>
                        {data ? (
                          <div className="details-content">
                              <div className="details-header">
                                  <img src={data.thumb} className="bead-large" alt={bead.name} />
                                  <div className="details-title-row">
                                      <span className="bead-info-label">Artifact</span>
                                      <span className="bead-info-value">{bead.name}</span>
                                  </div>
                              </div>
                              <div className="bead-info-row"><span className="bead-info-label">Effect</span><span className="bead-info-value">{data.effect}</span></div>
                              <div className="bead-info-row"><span className="bead-info-label">Location</span><span className="bead-info-value">{data.location}</span></div>
                              <a href={data.map} target="_blank" rel="noreferrer" className="map-btn">View Wiki Map</a>
                          </div>
                        ) : (
                          <div className="details-content">No further details unearthed for this bead.</div>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
        </main>

        <footer>
            <p>For twisted are the paths of the Miracle.</p>
        </footer>
    </div>
  );
}
