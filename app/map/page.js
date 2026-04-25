"use client";

import styles from './map.module.css';
import MapContainer from '../components/map/MapContainer';
import { useMapStore } from '../store/mapStore';
import { Settings2, Map as MapIcon, Database, PenTool, Eraser, Download, Save, MousePointer2, ChevronLeft, ChevronRight } from 'lucide-react';

const BLASPHEMOUS_AREAS = [
  "Albero",
  "All the Tears of the Sea",
  "Archcathedral Rooftops",
  "Bridge of the Three Calvaries",
  "Brotherhood of the Silent Sorrow",
  "Convent of Our Lady of the Charred Visage",
  "Deambulatory of His Holiness",
  "Desecrated Cistern",
  "Echoes of Salt",
  "Ferrous Tree",
  "Graveyard of the Peaks",
  "Grievance Ascends",
  "Hall of the Dawning",
  "Jondo",
  "Knot of the Three Words",
  "Library of the Negated Words",
  "Mercy Dreams",
  "Mother of Mothers",
  "Mountains of the Endless Dusk",
  "Mourning and Havoc",
  "Patio of the Silent Steps",
  "Petrous",
  "The Holy Line",
  "The Sleeping Canvases",
  "The Resting Place of the Sister",
  "Wall of the Holy Prohibitions",
  "Wasteland of the Buried Churches",
  "Where Olive Trees Wither"
];

export default function MapPage() {
  const {
    flatTiles, isEditMode, setEditMode,
    editorAreaName, setEditorAreaName,
    editorRoomName, setEditorRoomName,
    editorColor, setEditorColor,
    editorTool, setEditorTool,
    activeFilters, toggleFilter,
    selectedTiles,
    updateTileOpenings, updateTilesBulk,
    hoverCoords,
    globalTileOpacity, setGlobalTileOpacity,
    highlightedArea, setHighlightedArea,
    highlightedRoom, setHighlightedRoom,
    showBackgroundImage, setShowBackgroundImage,
    gridSize, setGridSize,
    sidebarOpen, toggleSidebar
  } = useMapStore();

  const handleSave = async () => {
    const dataToSave = { tiles: Object.values(flatTiles) };
    try {
      const res = await fetch('/api/saveMap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      if (res.ok) alert('Saved Map successfully');
      else alert('Failed to save');
    } catch (e) {
      console.error(e);
      alert('Error triggering save');
    }
  };

  const getTile = (id) => Object.values(flatTiles).find(t => t.id === id);
  const firstSelected = selectedTiles.length > 0 ? getTile(selectedTiles[0]) : null;

  const existingRooms = Array.from(new Set(Object.values(flatTiles)
    .filter(t => !highlightedArea || t.area === highlightedArea)
    .map(t => t.room).filter(Boolean)));

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      {/* Floating Coordinates Tracker */}
      {isEditMode && (
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, background: 'rgba(0,0,0,0.8)', padding: '10px 15px', borderRadius: '8px', border: '1px solid #45a29e', color: '#66fcf1', fontWeight: 'bold' }}>
          X: {hoverCoords.x} | Y: {hoverCoords.y}
        </div>
      )}

      {/* Sidebar UI */}
      <div 
        className={styles.sidebar}
        style={{ 
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: sidebarOpen ? '400px' : '0',
          minWidth: sidebarOpen ? '400px' : '0',
          padding: sidebarOpen ? '24px' : '0',
          opacity: sidebarOpen ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          borderRight: sidebarOpen ? '1px solid rgba(138, 109, 59, 0.4)' : 'none',
          overflow: 'visible' // Allow button to be visible when width is 0
        }}
      >
        <h1 className={styles.title}>Map Analyzer</h1>

        <button
          className={styles.button}
          onClick={() => setEditMode(!isEditMode)}
          style={{ background: isEditMode ? 'rgba(183, 28, 28, 0.3)' : '', borderColor: isEditMode ? '#b71c1c' : '' }}
        >
          <PenTool size={16} /> {isEditMode ? 'Exit Editor' : 'Map Editor Mode'}
        </button>

        <div className={styles.panel}>
          <div className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapIcon size={16} /> Visual Focus</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input 
                  type="number" 
                  min="4" 
                  max="128" 
                  defaultValue={gridSize || 16} 
                  onBlur={(e) => setGridSize(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setGridSize(Number(e.target.value));
                  }}
                  style={{ width: '45px', background: '#0b0c10', color: '#66fcf1', border: '1px solid #45a29e', padding: '2px', borderRadius: '4px', textAlign: 'center' }} 
                />
                <span style={{ fontSize: '0.75rem', color: '#8892b0' }}>px</span>
              </div>
              <label style={{ fontSize: '0.75rem', color: '#8892b0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="checkbox" checked={showBackgroundImage} onChange={(e) => setShowBackgroundImage(e.target.checked)} />
                BG Image
              </label>
              {(highlightedArea || highlightedRoom) && (
                <input
                  type="color"
                  title={highlightedRoom ? "Recolor Focused Room" : "Recolor Focused Area"}
                  value={
                    Object.values(flatTiles).find(t => highlightedRoom ? t.room === highlightedRoom : t.area === highlightedArea)?.color || '#45a29e'
                  }
                  onChange={(e) => {
                    const targetTiles = Object.values(flatTiles)
                      .filter(t => highlightedRoom ? t.room === highlightedRoom : t.area === highlightedArea)
                      .map(t => t.id);
                    updateTilesBulk(targetTiles, { color: e.target.value });
                  }}
                  style={{ width: '20px', height: '20px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <select
              style={{ flex: 1, background: '#0b0c10', color: '#c5c6c7', border: '1px solid #45a29e', padding: '4px', fontSize: '0.8rem' }}
              value={highlightedArea}
              onChange={e => { setHighlightedArea(e.target.value); setHighlightedRoom(''); }}
            >
              <option value="">-- View All Areas --</option>
              {BLASPHEMOUS_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <select
              style={{ flex: 1, background: '#0b0c10', color: '#c5c6c7', border: '1px solid #45a29e', padding: '4px', fontSize: '0.8rem' }}
              value={highlightedRoom}
              onChange={e => setHighlightedRoom(e.target.value)}
              disabled={!highlightedArea}
            >
              <option value="">-- View All Rooms --</option>
              {existingRooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {isEditMode ? (
          <div className={styles.panel}>
            <div className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PenTool size={16} /> Editor Tools</span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8892b0', marginBottom: '5px' }}>Area Palette Settings</label>
              <select value={editorAreaName} onChange={(e) => setEditorAreaName(e.target.value)} style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid #45a29e', color: '#c5c6c7', marginBottom: '8px' }}>
                {BLASPHEMOUS_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <input type="color" value={editorColor} onChange={(e) => setEditorColor(e.target.value)} style={{ width: '100%', height: '30px', cursor: 'pointer', background: 'none', border: 'none' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.8rem', color: '#d4af37' }}>Global Tile Opacity</label>
                <span style={{ fontSize: '0.75rem', color: '#d4af37' }}>{Math.round(globalTileOpacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={globalTileOpacity} onChange={(e) => setGlobalTileOpacity(parseFloat(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button 
                className={styles.button}
                onClick={() => setEditorTool('select')}
                style={{ flex: 1, background: editorTool === 'select' ? 'rgba(139, 0, 0, 0.4)' : '', borderColor: editorTool === 'select' ? '#b71c1c' : '' }}
              >
                <MousePointer2 size={16} /> Select
              </button>
              <button 
                className={styles.button}
                onClick={() => setEditorTool('paint')}
                style={{ flex: 1, background: editorTool === 'paint' ? 'rgba(139, 0, 0, 0.4)' : '', borderColor: editorTool === 'paint' ? '#b71c1c' : '' }}
              >
                <PenTool size={16} /> Paint
              </button>
              <button 
                className={styles.button}
                onClick={() => setEditorTool('erase')}
                style={{ flex: 1, background: editorTool === 'erase' ? 'rgba(139, 0, 0, 0.4)' : '', borderColor: editorTool === 'erase' ? '#b71c1c' : '' }}
              >
                <Eraser size={16} /> Erase
              </button>
            </div>

            <button className={styles.button} style={{ width: '100%', justifyContent: 'center' }} onClick={handleSave}>
              <Save size={16} /> Save to Disk
            </button>
          </div>
        ) : (
          <div className={styles.panel}>
            <div className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={16} /> Filters
            </div>
            <label className={styles.filterToggle}><span>NG+ Tiles</span><input type="checkbox" checked={activeFilters.showNGPlus} onChange={() => toggleFilter('showNGPlus')} /></label>
            <label className={styles.filterToggle}><span>Boss Rooms</span><input type="checkbox" checked={activeFilters.showBosses} onChange={() => toggleFilter('showBosses')} /></label>
            <label className={styles.filterToggle}><span>Collectibles</span><input type="checkbox" checked={activeFilters.showCollectibles} onChange={() => toggleFilter('showCollectibles')} /></label>
          </div>
        )}

        <div className={styles.panel}>
          <div className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapIcon size={16} /> Selection Details
          </div>
          {selectedTiles.length > 0 ? (
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>{selectedTiles.length} Tile(s) Selected</p>

              {isEditMode && (
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#d4af37', display: 'block', marginBottom: '8px' }}>ROOM MANAGEMENT</span>

                  <button className={styles.button} style={{ width: '100%', fontSize: '0.8rem', padding: '4px', marginBottom: '8px' }} onClick={() => {
                    const newId = `room_${Date.now()}`;
                    updateTilesBulk(selectedTiles, { room: newId });
                  }}>
                    Group into New Room
                  </button>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select
                      style={{ flex: 1, background: '#0b0c10', color: '#d4af37', border: '1px solid #8a6d3b', padding: '2px', fontSize: '0.8rem' }}
                      id="mergeRoomSelect"
                    >
                      {existingRooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button className={styles.button} style={{ fontSize: '0.8rem', padding: '4px' }} onClick={() => {
                      const sel = document.getElementById('mergeRoomSelect');
                      if (sel && sel.value) updateTilesBulk(selectedTiles, { room: sel.value });
                    }}>Merge</button>
                  </div>

                  <hr style={{ borderColor: 'rgba(212, 175, 55, 0.2)', margin: '10px 0' }} />

                  <button className={styles.button} style={{ width: '100%', fontSize: '0.8rem', padding: '4px' }} onClick={() => updateTilesBulk(selectedTiles, { area: editorAreaName, color: editorColor })}>
                    Apply Palette Colors
                  </button>
                </div>
              )}

              {selectedTiles.length === 1 && firstSelected && (
                <>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                    <span style={{ color: '#d4af37', fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>MANUAL OPENINGS OVERRIDE</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                      {['top', 'bottom', 'left', 'right'].map(dir => {
                        const val = firstSelected.openings?.[dir]; 
                        return (
                          <select
                            key={dir}
                            style={{ background: '#0b0c10', color: '#d4af37', border: '1px solid #8a6d3b', padding: '2px', fontSize: '0.8rem' }}
                            value={val === null ? 'dynamic' : val.toString()}
                            onChange={(e) => {
                              const v = e.target.value === 'dynamic' ? null : e.target.value === 'true';
                              updateTileOpenings(selectedTiles[0], { [dir]: v });
                            }}
                          >
                            <option value="dynamic">{dir}: Dynamic</option>
                            <option value="true">{dir}: Force Open</option>
                            <option value="false">{dir}: Force Wall</option>
                          </select>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>AREA</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: '4px 0 0 0', color: '#66fcf1' }}>{firstSelected.area || 'Unknown'}</p>
                      {isEditMode && <button className={styles.button} style={{ fontSize: '0.7rem', padding: '2px 6px' }} onClick={() => {
                        const ids = Object.values(flatTiles).filter(t => t.area === firstSelected.area).map(t => t.id);
                        useMapStore.getState().setSelectedTiles(ids);
                      }}>Select All</button>}
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>ROOM</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: '4px 0 0 0', color: '#66fcf1' }}>{firstSelected.room || 'Unknown'}</p>
                      {isEditMode && <button className={styles.button} style={{ fontSize: '0.7rem', padding: '2px 6px' }} onClick={() => {
                        const ids = Object.values(flatTiles).filter(t => t.room === firstSelected.room).map(t => t.id);
                        useMapStore.getState().setSelectedTiles(ids);
                      }}>Select All</button>}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.9rem' }}>Click a map tile to view details.</p>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} /> Area Stats
          </div>
          <p style={{ margin: '0 0 5px', fontSize: '0.85rem' }}>Total Tiles: {Object.keys(flatTiles).length}</p>
        </div>
      </div>

      {/* Main Map Viewport */}
      <MapContainer />

      {/* Floating Toggle Button */}
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          left: sidebarOpen ? '410px' : '20px',
          top: '20px',
          zIndex: 9999,
          background: '#140f0d',
          border: '1px solid #8a6d3b',
          color: '#d4af37',
          borderRadius: '2px',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          fontFamily: "'Crimson Text', 'Georgia', serif"
        }}
        title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {sidebarOpen ? 'Hide' : 'Menu'}
        </span>
      </button>
    </div>
  );
}
