"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from '../../map/map.module.css';
import MapGrid from './MapGrid';
import { useMapStore } from '../../store/mapStore';

export default function MapContainer() {
  const {
    showBackgroundImage, gridSize,
    hoveredRoom
  } = useMapStore();

  // Proportional scaling: 16px original tile -> gridSize
  const scale = gridSize / 16;
  const bgWidth = 1472 * scale;
  const bgHeight = 864 * scale;

  // Permanent offsets at 40px grid: -40, -81
  const curOffX = -40 * (gridSize / 40);
  const curOffY = -81 * (gridSize / 40);

  // Dynamic CSS for Room Hovering (High Performance)
  const hoverStyles = hoveredRoom ? `
    [data-room="${hoveredRoom}"] {
      filter: brightness(1.3) sepia(0.2) !important;
      background-color: rgba(212, 175, 55, 0.15) !important;
    }
    [data-room="${hoveredRoom}"][data-wall-top="true"] { border-top: 2px solid rgba(212, 175, 55, 1.0) !important; }
    [data-room="${hoveredRoom}"][data-wall-bottom="true"] { border-bottom: 2px solid rgba(212, 175, 55, 1.0) !important; }
    [data-room="${hoveredRoom}"][data-wall-left="true"] { border-left: 2px solid rgba(212, 175, 55, 1.0) !important; }
    [data-room="${hoveredRoom}"][data-wall-right="true"] { border-right: 2px solid rgba(212, 175, 55, 1.0) !important; }
  ` : '';

  return (
    <div className={styles.mapViewport}>
      <style>{hoverStyles}</style>
      <TransformWrapper
        initialScale={1.5}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.2}
        maxScale={5}
        centerOnInit={true}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        panning={{ activationKeys: ["Shift"] }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div className={styles.mapCanvas} style={{
            width: `3560px`,
            height: `2000px`,
            position: 'relative',
            touchAction: 'none',
            // Global background removed as tiles now act as masks
            backgroundColor: '#050505'
          }}>
            <MapGrid width={3560} height={2000} />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div >
  );
}
