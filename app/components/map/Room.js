"use client";

import styles from '../../map/map.module.css';
import Tile from './Tile';

import { useMapStore } from '../../store/mapStore';

export default function Room({ room }) {
  const gridSize = useMapStore(state => state.gridSize);
  const xPos = room.position.x * gridSize;
  const yPos = room.position.y * gridSize;

  return (
    <div
      className={styles.room}
      style={{
        left: `${xPos}px`,
        top: `${yPos}px`,
        width: `${room.width * gridSize}px`,
        height: `${room.height * gridSize}px`
      }}
    >
      {room.tiles.map(tile => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  );
}
