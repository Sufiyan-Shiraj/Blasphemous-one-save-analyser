# Blasphemous Map Analyzer Specification

## Overview
The Map Analyzer is a system designed to represent the full world map of **Blasphemous** in a structured and interactive way.  
Its primary purpose is to support a **100% save analyzer** by allowing players to inspect every room, tile, and collectible in the game.

The map system is hierarchical and dynamic:

Area → Room → Tile → Tile Metadata

Each element contains structured information that can be used for visualization, filtering, and completion tracking.

---

# Map Structure

## 1. Areas

An **Area** represents a major region of the game world.

Examples:
- Brotherhood of the Silent Sorrow
- Albero
- Wasteland of the Buried Churches
- Mercy Dreams
- Mother of Mothers
- The Sleeping Canvases
- Graveyard of the Peaks
- Library of the Negated Words
- The Archcathedral Rooftops

### Area Properties
- `id`
- `name`
- `rooms[]`
- `map_bounds`
- `description (optional)`

Example:

```json
{
  "id": "albero",
  "name": "Albero",
  "rooms": []
}
```

---

# 2. Rooms

A **Room** is the fundamental navigational unit of the game.

In Blasphemous, every time the player transitions through a screen boundary, they enter a new **room**.

A room may contain multiple tiles.

Examples of room sizes:
- 1x1
- 1x3
- 3x1
- 2x2
- 3x2
- 3x5

### Room Properties

- `id`
- `area_id`
- `position`
- `width`
- `height`
- `tiles[]`
- `connections`

Example:

```json
{
  "id": "albero_room_01",
  "area_id": "albero",
  "position": { "x": 10, "y": 4 },
  "width": 3,
  "height": 2,
  "tiles": []
}
```

---

# 3. Tiles

Tiles represent the **individual blocks seen on the in-game map**.

Every tile exists inside a room.

Tiles are the smallest navigable component in the system.

### Tile Properties

- `id`
- `room_id`
- `local_position`
- `tags`
- `contents`
- `connections`

Example:

```json
{
  "id": "tile_001",
  "room_id": "albero_room_01",
  "local_position": { "x": 1, "y": 0 },
  "tags": [],
  "contents": []
}
```

---

# Tile Metadata

Tiles may contain information about gameplay elements present in that section.

### Content Types

Tiles may contain:

- Collectibles
- Upgrades
- Enemies
- NPCs
- Bosses
- Quest triggers
- Movement challenges

### Content Object Example

```json
{
  "type": "collectible",
  "subtype": "rosary_bead",
  "name": "Silver Grape",
  "required_for_100": true
}
```

Example tile with content:

```json
{
  "id": "tile_045",
  "room_id": "albero_room_01",
  "local_position": { "x": 2, "y": 1 },
  "tags": [],
  "contents": [
    {
      "type": "collectible",
      "subtype": "bone",
      "name": "Bone of Someone"
    }
  ]
}
```

---

# Tile Tags

Tiles can contain **special gameplay tags**.

These tags modify how the tile is treated for completion tracking.

### Supported Tags

- `NG+`
- `NotRequired`
- `Missable`
- `Hidden`
- `Challenge`
- `BossRoom`
- `NPCInteraction`

Example:

```json
{
  "tags": ["NG+", "Hidden"]
}
```

Meaning:
- Only available in **New Game Plus**
- Hidden tile

---

# Completion Flags

Each tile can store completion state.

Example:

```json
{
  "visited": true,
  "items_collected": false,
  "fully_completed": false
}
```

---

# Map Overlay System (Meta Layer)

The system includes a **Meta Layer** used for strategy overlays and path visualization.

These overlays are not part of the game world itself but provide guidance.

Examples:

- Optimal routes
- Speedrun paths
- Achievement routes
- Puzzle solutions

---

# Overlay Object

```json
{
  "id": "bronze_medal_route",
  "name": "Bronze Medal Path",
  "type": "path",
  "coordinates": [
    { "x": 10, "y": 4 },
    { "x": 11, "y": 4 },
    { "x": 12, "y": 5 }
  ]
}
```

---

# Overlay Types

### Path Overlay
Shows recommended routes.

Example uses:
- Bronze Medal achievement
- Fast traversal routes

### Challenge Overlay
Shows how to complete complex traversal challenges.

Example:
- Inverted Verses challenge path

### Annotation Overlay
Displays notes or tips.

Example:

```json
{
  "type": "note",
  "text": "Use double jump + dash to reach this platform"
}
```

---

# Filtering System

The analyzer must support dynamic filtering.

Possible filters:

- Show NG+ only tiles
- Show incomplete tiles
- Show collectibles
- Show bosses
- Show upgrades
- Hide non-required tiles

Example filter:

```json
{
  "show_required_only": true,
  "show_ng_plus": false
}
```

---

# UI Interaction Model

### Map Navigation
- Zoom
- Pan
- Area switching

### Tile Interaction
Clicking a tile should open a detail panel containing:

- Room name
- Tile tags
- Contents
- Completion state
- Notes
- Related overlays

---

# Example Hierarchy

Example structure:

```
Area
 ├── Room
 │    ├── Tile
 │    │    ├── Tags
 │    │    ├── Contents
 │    │    └── Completion Data
 │
 └── Room
      └── Tiles
```

---

# Future Expansion

The system should support future additions:

- Blasphemous II compatibility
- Modded map data
- Save file auto-analysis
- Community annotations
- Multiple route overlays