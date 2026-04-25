"use client";

import Tile from './Tile';
import { useMapStore } from '../../store/mapStore';
import styles from '../../map/map.module.css';

export default function MapGrid({ width, height }) {
  // Use isolated selectors to prevent re-rendering MapGrid continuously on hover
  const flatTiles = useMapStore(state => state.flatTiles);
  const isEditMode = useMapStore(state => state.isEditMode);
  const showGridLines = useMapStore(state => state.showGridLines);
  const selectedTiles = useMapStore(state => state.selectedTiles);
  const activeFilters = useMapStore(state => state.activeFilters);
  const globalTileOpacity = useMapStore(state => state.globalTileOpacity);
  const highlightedArea = useMapStore(state => state.highlightedArea);
  const highlightedRoom = useMapStore(state => state.highlightedRoom);
  const gridSize = useMapStore(state => state.gridSize);

  const getGridCoords = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = rect.width / width;
    const x = Math.floor(((e.clientX - rect.left) / scale) / gridSize);
    const y = Math.floor(((e.clientY - rect.top) / scale) / gridSize);
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (!isEditMode) return;
    if (e.shiftKey) return; // Delegate to pan library

    const state = useMapStore.getState();
    state.setIsDragging(true);

    if (state.editorTool === 'select') {
      state.clearSelection();
    }

    if (state.editorTool !== 'select') {
      const { x, y } = getGridCoords(e);
      if (state.editorTool === 'paint') state.addTile(x, y);
      else if (state.editorTool === 'erase') state.removeTile(x, y);
    }
  };

  const handlePointerMove = (e) => {
    if (!isEditMode) return;
    const { x, y } = getGridCoords(e);

    const state = useMapStore.getState();
    state.setHoverCoords({ x, y });

    if (state.isDragging && !e.shiftKey) {
      if (state.editorTool === 'paint') state.addTile(x, y);
      else if (state.editorTool === 'erase') state.removeTile(x, y);
    }
  };

  const handlePointerUp = () => {
    if (isEditMode) {
      useMapStore.getState().setIsDragging(false);
    }
  };

  const tilesList = Object.values(flatTiles);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
      {tilesList.map(tile => {
        const getNeighbor = (dx, dy) => flatTiles[`${tile.x + dx}_${tile.y + dy}`];

        const processEdge = (dirName, neighbor, oppDirName) => {
          const manual = tile.openings?.[dirName];
          const neighborManual = neighbor ? neighbor.openings?.[oppDirName] : null;

          if (manual === true || neighborManual === true) {
            if (!neighbor || neighbor.room !== tile.room) return 'door';
            return 'open';
          }
          if (manual === false || neighborManual === false) return 'wall';
          if (!neighbor) return 'wall';
          if (neighbor.room === tile.room) return 'open';
          return 'wall';
        };

        const topNeighbor = getNeighbor(0, -1);
        const bottomNeighbor = getNeighbor(0, 1);
        const leftNeighbor = getNeighbor(-1, 0);
        const rightNeighbor = getNeighbor(1, 0);

        const isTileVis = (t) => {
          if (!t) return false;
          if (isEditMode) return true;
          if (t.tags.includes('NG+') && !activeFilters.showNGPlus) return false;
          if (t.tags.includes('BossRoom') && !activeFilters.showBosses) return false;
          return true;
        };

        const isTileHighlighted = (t) => {
          if (!t) return false;
          let dimmed = false;
          if (highlightedArea && t.area !== highlightedArea) dimmed = true;
          if (highlightedRoom && t.room !== highlightedRoom) dimmed = true;
          return !dimmed;
        };

        const ownsEdge = (t1, t2, preferT1) => {
          if (!t2) return true;
          if (!isTileVis(t2)) return true;
          const h1 = isTileHighlighted(t1);
          const h2 = isTileHighlighted(t2);
          if (h1 && !h2) return true;
          if (!h1 && h2) return false;
          return preferT1;
        };

        const topState = ownsEdge(tile, topNeighbor, false) ? processEdge('top', topNeighbor, 'bottom') : 'none';
        const bottomState = ownsEdge(tile, bottomNeighbor, true) ? processEdge('bottom', bottomNeighbor, 'top') : 'none';
        const leftState = ownsEdge(tile, leftNeighbor, false) ? processEdge('left', leftNeighbor, 'right') : 'none';
        const rightState = ownsEdge(tile, rightNeighbor, true) ? processEdge('right', rightNeighbor, 'left') : 'none';

        const isSelected = selectedTiles.includes(tile.id);

        return (
          <Tile
            key={tile.id}
            tile={tile}
            isSelected={isSelected}
            isEditMode={isEditMode}
            activeFilters={activeFilters}
            globalTileOpacity={globalTileOpacity}
            highlightedArea={highlightedArea}
            highlightedRoom={highlightedRoom}
            gridSize={gridSize}
            topState={topState}
            bottomState={bottomState}
            leftState={leftState}
            rightState={rightState}
          />
        );
      })}
    </div>
  );
}
