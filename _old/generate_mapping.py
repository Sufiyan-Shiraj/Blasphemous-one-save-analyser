import hashlib

beads = [
    "Amber Eye", "Big Bead of Blue Wax", "Big Bead of Red Wax", "Big Toe made of Limestone",
    "Calcified Eye of Erudition", "Consecrated Amethyst", "Dove Skull", "Drop of Coagulated Ink",
    "Ember of the Holy Cremation", "Embers of a Broken Star", "Fourth Toe Made of Limestone",
    "Frozen Olive", "Hollow Pearl", "Knot of Hair", "Little Toe Made of Limestone",
    "Moss Preserved in Glass", "Muted Bell", "Painted Wood Bead", "Pelican Effigy",
    "Perpetva's Protection", "Piece of a Golden Mask", "Piece of a Tombstone",
    "Quirce's Scorched Bead", "Scaly Coin", "Seashell of the Inverted Spiral",
    "Silver Grape", "Sphere of the Sacred Smoke", "Thorned Symbol", "Uvula of Proclamation",
    "Wicker Knot", "Reliquary of the Fervent Heart", "Reliquary of the Sorrowful Heart",
    "Reliquary of the Suffering Heart", "Bead of Gold Thread", "Aspirant's Rosary Bead",
    "Saeta of the Golden Rose", "Young Man's Face", "Old Man's Face", "Crown of Gnawed Iron",
    "Solitude", "The Young Mason's Wheel", "Crimson Heart of a Miura", "Light of the Lady of the Lamp",
    "Cloistered Sapphire", "Cloistered Ruby", "Scale of Burnished Gold", "Scale of Burnished Alabaster",
    "Salt-covered Spear Point", "Concentrated Sphere of Guilt", "Bead of the Immaculate / Weight of True Guilt"
]

def get_wiki_url(name):
    # Handle specific naming quirks if necessary
    filename = name.replace(" ", "_") + ".png"
    # Special cases
    if name == "Bead of the Immaculate / Weight of True Guilt":
        filename = "Weight_of_True_Guilt.png" # The iconic one
    
    hash_obj = hashlib.md5(filename.encode('utf-8'))
    md5_hex = hash_obj.hexdigest()
    return f"https://static.wikia.nocookie.net/blasphemous/images/{md5_hex[0]}/{md5_hex[0:2]}/{filename}"

mapping = {name: get_wiki_url(name) for name in beads}

import json
print(json.dumps(mapping, indent=4))
