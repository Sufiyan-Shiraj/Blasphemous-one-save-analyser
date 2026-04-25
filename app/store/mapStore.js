import { create } from 'zustand';
import { sampleArea } from '../data/sampleMapData';

// Helper to load initial flat tiles from Area
const initialTiles = {};
if (sampleArea && sampleArea.rooms) {
  sampleArea.rooms.forEach(room => {
    room.tiles.forEach(tile => {
      const tx = tile.x !== undefined ? tile.x : tile.local_position?.x;
      const ty = tile.y !== undefined ? tile.y : tile.local_position?.y;

      if (tx !== undefined && ty !== undefined) {
        initialTiles[`${tx}_${ty}`] = {
          ...tile,
          x: tx,
          y: ty,
          area: tile.area || 'Cvstodia Map',
          room: tile.room || room.room_name
        };
      }
    });
  });
}

export const useMapStore = create((set, get) => ({
  activeFilters: { showNGPlus: true, showCompleted: true, showBosses: true, showCollectibles: true },
  selectedTiles: [], // array of selected tile ids
  completionState: {},

  isEditMode: false,
  flatTiles: initialTiles,
  editorAreaName: 'Albero',
  editorRoomName: 'Room 1',
  editorColor: '#45a29e',
  editorTool: 'paint',
  isDragging: false,
  hoverCoords: { x: 0, y: 0 },
  showGridLines: true,
  showBackgroundImage: true,
  globalTileOpacity: 1.0,
  gridSize: 40,
  bgOffsetY: -81,
  hoveredRoom: null,
  sidebarOpen: true,

  highlightedArea: '',
  highlightedRoom: '',

  toggleFilter: (f) => set((s) => ({ activeFilters: { ...s.activeFilters, [f]: !s.activeFilters[f] } })),
  setEditMode: (v) => set({ isEditMode: v }),
  setEditorAreaName: (n) => set({ editorAreaName: n }),
  setEditorRoomName: (n) => set({ editorRoomName: n }),
  setEditorColor: (c) => set({ editorColor: c }),
  setEditorTool: (t) => set({ editorTool: t }),
  setIsDragging: (v) => set({ isDragging: v }),
  setHoverCoords: (coords) => set({ hoverCoords: coords }),
  setShowGridLines: (v) => set({ showGridLines: v }),
  setShowBackgroundImage: (v) => set({ showBackgroundImage: v }),
  setGlobalTileOpacity: (v) => set({ globalTileOpacity: v }),
  setGridSize: (s) => set({ gridSize: s }),
  setHoveredRoom: (r) => set({ hoveredRoom: r }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setHighlightedArea: (a) => set({ highlightedArea: a }),
  setHighlightedRoom: (r) => set({ highlightedRoom: r }),

  setSelectedTiles: (ids) => set({ selectedTiles: ids }),
  clearSelection: () => set({ selectedTiles: [], lastSelectedTile: null }),
  addSelectTile: (id) => set(s => ({ selectedTiles: s.selectedTiles.includes(id) ? s.selectedTiles : [...s.selectedTiles, id] })),
  removeSelectTile: (id) => set(s => ({ selectedTiles: s.selectedTiles.filter(t => t !== id) })),

  lastSelectedTile: null,
  setLastSelectedTile: (x, y) => set({ lastSelectedTile: { x, y } }),

  selectBox: (x1, y1, x2, y2) => set(state => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const newSelection = new Set(state.selectedTiles);

    Object.values(state.flatTiles).forEach(t => {
      if (t.x >= minX && t.x <= maxX && t.y >= minY && t.y <= maxY) {
        newSelection.add(t.id);
      }
    });
    return { selectedTiles: Array.from(newSelection) };
  }),

  addTile: (x, y) => set((state) => {
    const key = `${x}_${y}`;
    const newTile = {
      id: `tile_${x}_${y}`,
      local_position: { x, y },
      x, y,
      color: state.editorColor,
      area: state.editorAreaName,
      room: state.editorRoomName,
      tags: [],
      contents: [],
      openings: { top: null, bottom: null, left: null, right: null } // dynamic unless true/false
    };
    return { flatTiles: { ...state.flatTiles, [key]: newTile } };
  }),

  removeTile: (x, y) => set((state) => {
    const key = `${x}_${y}`;
    const newTiles = { ...state.flatTiles };
    delete newTiles[key];
    return { flatTiles: newTiles };
  }),

  updateTilesBulk: (ids, partial) => set(state => {
    const newTiles = { ...state.flatTiles };
    ids.forEach(id => {
      // Find the tile key
      const key = Object.keys(newTiles).find(k => newTiles[k].id === id);
      if (key) {
        newTiles[key] = { ...newTiles[key], ...partial };
      }
    });
    return { flatTiles: newTiles };
  }),

  updateTileOpenings: (id, openings) => set(state => {
    const newTiles = { ...state.flatTiles };
    const key = Object.keys(newTiles).find(k => newTiles[k].id === id);
    if (key) {
      newTiles[key] = { ...newTiles[key], openings: { ...newTiles[key].openings, ...openings } };
    }
    return { flatTiles: newTiles };
  }),

  updateCompletion: (tId, d) => set(s => ({ completionState: { ...s.completionState, [tId]: { ...s.completionState[tId], ...d } } }))
}));
