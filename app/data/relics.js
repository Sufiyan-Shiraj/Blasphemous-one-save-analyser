export const RELICS_LIST = [
  { name: "Blood Perpetuated in Sand", tags: ["normal"] },
  { name: "Shroud of Dreamt Sins", tags: ["normal"] },
  { name: "Silvered Lung of Dolphos", tags: ["normal"] },
  { name: "Three Gnarled Tongues", tags: ["normal"] },
  { name: "Linen of Golden Thread", tags: ["normal"] },
  { name: "Incorrupt Hand of the Fraternal Master", tags: ["normal"] },
  { name: "Nail Uprooted from Dirt", tags: ["normal"] }
];

const getWikiPath = (name) => `https://blasphemous.wiki.gg/images/${name.replace(/ /g, '_')}.png`;

export const RELICS_DATA = {
  "Blood Perpetuated in Sand": {
    thumb: getWikiPath("Blood_Perpetuated_in_Sand"),
    effect: "Reveals hidden red-dust platforms.",
    location: "Brotherhood of the Silent Sorrow - Key of the Inquisitor needed.",
    map: "https://blasphemous.fandom.com/wiki/Blood_Perpetuated_in_Sand"
  },
  "Shroud of Dreamt Sins": {
    thumb: getWikiPath("Shroud_of_Dreamt_Sins"),
    effect: "Allows hearing memories of corpses.",
    location: "Albero - Bring Linen Cloth to the fountain.",
    map: "https://blasphemous.fandom.com/wiki/Shroud_of_Dreamt_Sins"
  },
  "Silvered Lung of Dolphos": {
    thumb: getWikiPath("Silvered_Lung_of_Dolphos"),
    effect: "Immunity to poisonous miasma.",
    location: "Grievance Ascends - Deep within the poison area.",
    map: "https://blasphemous.fandom.com/wiki/Silvered_Lung_of_Dolphos"
  },
  "Three Gnarled Tongues": {
    thumb: getWikiPath("Three_Gnarled_Tongues"),
    effect: "Grows roots to create platforms.",
    location: "Grievance Ascends - Complete Altasgracias' quest.",
    map: "https://blasphemous.fandom.com/wiki/Three_Gnarled_Tongues"
  },
  "Linen of Golden Thread": {
    thumb: getWikiPath("Linen_of_Golden_Thread"),
    effect: "Survive falls into bottomless pits.",
    location: "Sleeping Canvases - Rescue 20 Children of Moonlight.",
    map: "https://blasphemous.fandom.com/wiki/Linen_of_Golden_Thread"
  },
  "Incorrupt Hand of the Fraternal Master": {
    thumb: getWikiPath("Incorrupt_Hand_of_the_Fraternal_Master"),
    effect: "Rings a bell when secrets are nearby.",
    location: "Desecrated Cistern - Bless the Severed Hand.",
    map: "https://blasphemous.fandom.com/wiki/Incorrupt_Hand_of_the_Fraternal_Master"
  },
  "Nail Uprooted from Dirt": {
    thumb: getWikiPath("Nail_Uprooted_from_Dirt"),
    effect: "Negates movement penalties in mud/water.",
    location: "Mother of Mothers - Complete Redento's quest.",
    map: "https://blasphemous.fandom.com/wiki/Nail_Uprooted_from_Dirt"
  }
};
