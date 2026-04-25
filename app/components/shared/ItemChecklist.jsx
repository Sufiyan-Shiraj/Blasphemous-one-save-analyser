"use client";

import { useState, useEffect, useMemo } from 'react';

export default function ItemChecklist({ 
  title, 
  subtitle, 
  items, 
  detailsData, 
  storageKey, 
  categories = [], 
  detailLabels = { primary: 'Effect', secondary: 'Location' } 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTags, setActiveTags] = useState(new Set());
  const [logicMode, setLogicMode] = useState('AND');
  const [checkedItems, setCheckedItems] = useState({});
  const [openPanels, setOpenPanels] = useState(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(storageKey);
    if (saved) setCheckedItems(JSON.parse(saved));
  }, [storageKey]);

  const toggleCheck = (name) => {
    const newChecked = { ...checkedItems, [name]: !checkedItems[name] };
    setCheckedItems(newChecked);
    localStorage.setItem(storageKey, JSON.stringify(newChecked));
  };

  const toggleTag = (tag) => {
    const newTags = new Set(activeTags);
    if (newTags.has(tag)) newTags.delete(tag);
    else newTags.add(tag);
    setActiveTags(newTags);
  };

  const togglePanel = (name) => {
    const newPanels = new Set(); 
    if (!openPanels.has(name)) newPanels.add(name);
    setOpenPanels(newPanels);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchStatus = true;
      const isChecked = !!checkedItems[item.name];
      if (statusFilter === 'checked') matchStatus = isChecked;
      if (statusFilter === 'unchecked') matchStatus = !isChecked;

      let matchTags = true;
      if (activeTags.size > 0 && item.tags) {
        const selectedTagsArray = Array.from(activeTags);
        if (logicMode === 'AND') {
          matchTags = selectedTagsArray.every(tag => item.tags.includes(tag));
        } else {
          matchTags = selectedTagsArray.some(tag => item.tags.includes(tag));
        }
      }

      return matchSearch && matchStatus && matchTags;
    });
  }, [searchTerm, statusFilter, activeTags, logicMode, checkedItems, items]);

  const checkedVisible = filteredItems.filter(i => checkedItems[i.name]).length;
  const totalVisible = filteredItems.length;
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

  const formatTag = (tag) => {
    if (tag === 'ng-plus') return 'NG+';
    if (tag === 'true-ending') return 'True Ending';
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  };

  if (!isClient) return <div className="container" style={{ minHeight: '100vh' }}></div>;

  return (
    <div className="container">
      <header>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>

        <div className="search-container">
          <input 
            type="text" 
            placeholder={`Search for ${title.toLowerCase()}...`} 
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

          {categories.length > 0 && (
            <div className="filter-group">
              <span className="filter-label">Categories:</span>
              <div className="filter-chips">
                {categories.map(tag => (
                  <button 
                    key={tag}
                    className={`chip ${activeTags.has(tag) ? 'active' : ''}`} 
                    onClick={() => toggleTag(tag)}
                  >
                    {formatTag(tag)}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          {filteredItems.map(item => {
            const data = (detailsData && detailsData[item.name]) || (detailsData?.Data && detailsData.Data[item.name]);
            const isOpen = openPanels.has(item.name);
            
            return (
              <li key={item.name} className="bead-item">
                <div className="item-main">
                  {data?.thumb && <img src={data.thumb} className="bead-thumb" alt={item.name} />}
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={!!checkedItems[item.name]} 
                      onChange={() => toggleCheck(item.name)}
                    />
                    <span className="checkmark"></span>
                    <span className="item-name">
                      {item.name}
                      {item.tags?.filter(t => t !== 'normal').map(t => (
                        <span key={t} className={`tag ${t === 'ng-plus' ? 'ng-plus' : ''}`}>
                          {formatTag(t)}
                        </span>
                      ))}
                    </span>
                  </label>
                  <button className={`details-toggle ${isOpen ? 'active' : ''}`} onClick={() => togglePanel(item.name)}>&gt;</button>
                </div>
                
                <div className={`details-panel ${isOpen ? 'open' : ''}`}>
                  {data ? (
                    <div className="details-content">
                      <div className="details-header">
                        {data.thumb && <img src={data.thumb} className="bead-large" alt={item.name} />}
                        <div className="details-title-row">
                          <span className="bead-info-label">Item</span>
                          <span className="bead-info-value">{item.name}</span>
                        </div>
                      </div>
                      {data.effect && <div className="bead-info-row"><span className="bead-info-label">{detailLabels.primary}</span><span className="bead-info-value">{data.effect}</span></div>}
                      {data.location && <div className="bead-info-row"><span className="bead-info-label">{detailLabels.secondary}</span><span className="bead-info-value">{data.location}</span></div>}
                      {data.map && <a href={data.map} target="_blank" rel="noreferrer" className="map-btn">View Wiki Map</a>}
                    </div>
                  ) : (
                    <div className="details-content">No further details unearthed for this item.</div>
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
