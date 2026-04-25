import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Group tiles by Area and Room
    // Expected incoming format: flat array of tiles containing {x, y, area, room, color, manualOpenings, ...}
    
    const areasObj = {};
    for (const tile of data.tiles) {
      const aName = tile.area || "Unknown Area";
      const rName = tile.room || "room_0";
      
      if (!areasObj[aName]) areasObj[aName] = {};
      if (!areasObj[aName][rName]) areasObj[aName][rName] = [];
      
      areasObj[aName][rName].push(tile);
    }

    // Since we output just one global area in `mapsystem.md` usually, or maybe we support multiple areas!
    // But currently `sampleMapData.js` exports a single object `sampleArea`. Let's build it so 
    // it's one large unified Area with rooms, or array of areas. Let's make it a single 'world' area.
    
    let globalRoomIdx = 1;
    const finalRooms = [];

    // Flatten areas into rooms (assuming the map component renders sampleArea.rooms)
    for (const [aName, roomsData] of Object.entries(areasObj)) {
      for (const [rName, tiles] of Object.entries(roomsData)) {
        finalRooms.push({
          id: `room_${globalRoomIdx++}`,
          area_id: aName,
          room_name: rName,
          position: { x: 0, y: 0 },
          width: 0, // dynamic
          height: 0,
          tiles: tiles
        });
      }
    }

    const exportData = {
      id: "blasphemous_world",
      name: "Cvstodia",
      map_bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 },
      rooms: finalRooms
    };

    const filePath = path.join(process.cwd(), 'app', 'data', 'sampleMapData.js');
    const fileContent = "export const sampleArea = " + JSON.stringify(exportData, null, 2) + ";\n";
    
    fs.writeFileSync(filePath, fileContent, 'utf8');
    
    return Response.json({ success: true, message: 'Map data saved to sampleMapData.js' });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
