"use client";

import React from 'react';
import styles from '../../map/map.module.css';
import { useMapStore } from '../../store/mapStore';

const Tile = React.memo(({
  tile,
  isSelected,
  isEditMode,
  activeFilters,
  globalTileOpacity,
  highlightedArea,
  highlightedRoom,
  setHoveredRoom,
  gridSize,
  topState,
  bottomState,
  leftState,
  rightState
}) => {

  const handlePointerDown = (e) => {
    const state = useMapStore.getState();
    if (state.isEditMode && state.editorTool !== 'select') {
      // Original edit mode logic
      if (e.shiftKey) return;
      e.stopPropagation();
      if (state.editorTool === 'erase') state.removeTile(tile.x, tile.y);
      else if (state.editorTool === 'paint') state.addTile(tile.x, tile.y);
      return;
    }

    e.stopPropagation();

    const roomTiles = Object.values(state.flatTiles)
      .filter(t => t.room === tile.room)
      .map(t => t.id);

    const currentSelected = state.selectedTiles;

    // Check if the current selection is already the entire room
    const isEntireRoomSelected = currentSelected.length > 1 &&
      roomTiles.every(id => currentSelected.includes(id));

    if (!isEntireRoomSelected && roomTiles.length > 1) {
      // First click: Select entire room
      state.setSelectedTiles(roomTiles);
    } else {
      // Second click (or single tile room): Select specific tile
      state.setSelectedTiles([tile.id]);
    }

    state.setLastSelectedTile(tile.x, tile.y);
  };

  const handlePointerEnter = (e) => {
    const state = useMapStore.getState();
    if (state.isEditMode && state.isDragging && !e.shiftKey) {
      if (state.editorTool === 'erase') state.removeTile(tile.x, tile.y);
      else if (state.editorTool === 'paint') state.addTile(tile.x, tile.y);
    }
  };

  // Filter Logic check
  const isNGPlus = tile.tags.includes('NG+');
  const isHidden = tile.tags.includes('Hidden');
  const isBoss = tile.tags.includes('BossRoom');

  if (!isEditMode) {
    if (isNGPlus && !activeFilters.showNGPlus) return null;
    if (isBoss && !activeFilters.showBosses) return null;
  }

  const classes = [
    styles.tile,
    isSelected ? styles.tileSelected : '',
    isBoss ? styles.bossRoom : '',
    isHidden ? styles.hidden : '',
    tile.contents.some(c => c.type === 'collectible') ? styles.collectible : ''
  ].filter(Boolean).join(' ');

  const xPos = tile.x * gridSize;
  const yPos = tile.y * gridSize;

  let isDimmedByHighlight = false;
  if (highlightedArea && tile.area !== highlightedArea) isDimmedByHighlight = true;
  if (highlightedRoom && tile.room !== highlightedRoom) isDimmedByHighlight = true;

  const scale = gridSize / 16;
  const bgWidth = 1472 * scale;
  const bgHeight = 864 * scale;

  // Permanent offsets at 40px grid: -40, -81
  const curOffX = -40 * (gridSize / 40);
  const curOffY = -81 * (gridSize / 40);

  const posX = curOffX - (tile.x * gridSize);
  const posY = curOffY - (tile.y * gridSize);

  // Masking Logic:
  const isVisible = !highlightedArea && !highlightedRoom
    ? true
    : (highlightedRoom ? tile.room === highlightedRoom : tile.area === highlightedArea);

  const baseStyle = {
    backgroundImage: `url('/blasphemous-cvstodia-in-game-map-pc-map.png')`,
    backgroundSize: `${bgWidth}px ${bgHeight}px`,
    backgroundPosition: `${posX}px ${posY}px`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: isSelected ? 'rgba(139, 0, 0, 0.4)' : 'transparent',
    opacity: isVisible ? 1 : 0,
    filter: isSelected ? 'brightness(1.8) sepia(0.2)' : 'none',
    pointerEvents: isVisible ? 'auto' : 'none',
    left: `${xPos}px`,
    top: `${yPos}px`,
    width: `${gridSize}px`,
    height: `${gridSize}px`,
    border: isSelected ? '2px solid #d4af37' : 'none',
    zIndex: isSelected ? 10 : 1,
    transition: 'filter 0.15s ease, background-color 0.15s ease, border 0.15s ease'
  };

  const handlePointerEnterEnhanced = (e) => {
    handlePointerEnter(e);
    const state = useMapStore.getState();
    if (tile.room) state.setHoveredRoom(tile.room);
  };

  const handlePointerLeave = () => {
    const state = useMapStore.getState();
    state.setHoveredRoom(null);
  };

  return (
    <div
      className={classes}
      style={baseStyle}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnterEnhanced}
      onPointerLeave={handlePointerLeave}
      onContextMenu={(e) => e.preventDefault()}
      title={`${tile.area || 'Unknown Area'}\nRoom: ${tile.room || 'None'}\n[${tile.x}, ${tile.y}]`}
      data-room={tile.room}
      data-wall-top={topState === 'wall'}
      data-wall-bottom={bottomState === 'wall'}
      data-wall-left={leftState === 'wall'}
      data-wall-right={rightState === 'wall'}
    >
      {(isBoss || tile.contents.length > 0) && <div className={styles.tagIndicator} />}
    </div>
  );
});

export default Tile;
