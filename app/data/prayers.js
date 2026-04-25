export const PRAYERS_LIST = [
  { name: "Verdiales of the Forsaken Hamlet", tags: ["normal"] },
  { name: "Seguiriya to your Eyes like Stars", tags: ["normal"] },
  { name: "Saeta Dolorosa", tags: ["normal"] },
  { name: "Soleá of Excommunication", tags: ["normal"] },
  { name: "Debla of the Lights", tags: ["normal"] },
  { name: "Taranto to My Sister", tags: ["normal"] },
  { name: "Lorquiana", tags: ["normal"] },
  { name: "Romance to the Crimson Mist", tags: ["normal"] },
  { name: "Tiento to your Thorned Hairs", tags: ["normal"] },
  { name: "Zambra to the Resplendent Crown", tags: ["normal"] },
  { name: "Campanillero to the Sons of the Aurora", tags: ["normal"] },
  { name: "Cante Jondo of the Three Sisters", tags: ["normal"] },
  { name: "Zarabanda of the Safe Haven", tags: ["normal"] },
  { name: "Aubade of the Nameless Guardian", tags: ["dlc"] },
  { name: "Cantina of the Blue Rose", tags: ["dlc"] },
  { name: "Mirabras of the Return to Port", tags: ["dlc"] },
  { name: "Tirana of the Celestial Bastion", tags: ["dlc"] }
];

const getWikiPath = (name) => `https://blasphemous.wiki.gg/images/${name.replace(/ /g, '_')}.png`;

export const PRAYERS_DATA = {
  "Verdiales of the Forsaken Hamlet": {
    thumb: getWikiPath("Verdiales of the Forsaken Hamlet"),
    effect: "Creates a shockwave on the ground.",
    location: "The Holy Line - Found on a mandatory path early game.",
    map: "https://blasphemous.fandom.com/wiki/Verdiales_of_the_Forsaken_Hamlet"
  },
  "Seguiriya to your Eyes like Stars": {
    thumb: getWikiPath("Seguiriya to your Eyes like Stars"),
    effect: "Temporarily increases attack speed.",
    location: "Mercy Dreams - Side room near the Prie-Dieu.",
    map: "https://blasphemous.fandom.com/wiki/Seguiriya_to_your_Eyes_like_Stars"
  },
  "Saeta Dolorosa": {
    thumb: getWikiPath("Saeta_Dolorosa"),
    effect: "Heals the Penitent One on successful hits.",
    location: "Where the Olive Trees Wither - Complete Gemino's quest.",
    map: "https://blasphemous.fandom.com/wiki/Saeta_Dolorosa"
  },
  "Soleá of Excommunication": {
    thumb: getWikiPath("Soleá_of_Excommunication"),
    effect: "Fires a burst of holy energy.",
    location: "Jondo - Requires Three Gnarled Tongues relic.",
    map: "https://blasphemous.fandom.com/wiki/Sole%C3%A1_of_Excommunication"
  },
  "Debla of the Lights": {
    thumb: getWikiPath("Debla_of_the_Lights"),
    effect: "Summons a massive beam of holy light.",
    location: "Albero - Bring all 3 Tentudia's Remains to Ludovico.",
    map: "https://blasphemous.fandom.com/wiki/Debla_of_the_Lights"
  },
  "Taranto to My Sister": {
    thumb: getWikiPath("Taranto_to_My_Sister"),
    effect: "Wreathes the sword in holy lightning.",
    location: "Bridge of the Three Calvaries - Defeat Esdras.",
    map: "https://blasphemous.fandom.com/wiki/Taranto_to_My_Sister"
  },
  "Lorquiana": {
    thumb: getWikiPath("Lorquiana"),
    effect: "Fires long-range holy projectiles.",
    location: "Library of the Negated Words - Requires Blood Perpetuated in Sand.",
    map: "https://blasphemous.fandom.com/wiki/Lorquiana"
  },
  "Romance to the Crimson Mist": {
    thumb: getWikiPath("Romance_to_the_Crimson_Mist"),
    effect: "Creates a cloud of poisonous mist.",
    location: "Library of the Negated Words - Solve Anatomy Book puzzle.",
    map: "https://blasphemous.fandom.com/wiki/Romance_to_the_Crimson_Mist"
  },
  "Tiento to your Thorned Hairs": {
    thumb: getWikiPath("Tiento_to_your_Thorned_Hairs"),
    effect: "Grants brief invincibility.",
    location: "Albero - Complete Cleofas' questline.",
    map: "https://blasphemous.fandom.com/wiki/Tiento_to_your_Thorned_Hairs"
  },
  "Zambra to the Resplendent Crown": {
    thumb: getWikiPath("Zambra_to_the_Resplendent_Crown"),
    effect: "Increases Tears of Atonement gain.",
    location: "Desecrated Cistern - Requires jumping puzzles.",
    map: "https://blasphemous.fandom.com/wiki/Zambra_to_the_Resplendent_Crown"
  },
  "Campanillero to the Sons of the Aurora": {
    thumb: getWikiPath("Campanillero_to_the_Sons_of_the_Aurora"),
    effect: "Summons spectral children to attack.",
    location: "Sleeping Canvases - Rescue all 38 Children of Moonlight.",
    map: "https://blasphemous.fandom.com/wiki/Campanillero_to_the_Sons_of_the_Aurora"
  },
  "Cante Jondo of the Three Sisters": {
    thumb: getWikiPath("Cante_Jondo_of_the_Three_Sisters"),
    effect: "A sonic boom that damages all screen enemies.",
    location: "Archcathedral Rooftops - Behind a secret wall.",
    map: "https://blasphemous.fandom.com/wiki/Cante_Jondo_of_the_Three_Sisters"
  },
  "Zarabanda of the Safe Haven": {
    thumb: getWikiPath("Zarabanda_of_the_Safe_Haven"),
    effect: "Summons two orbiting shields.",
    location: "Desecrated Cistern - Near the exit to Albero.",
    map: "https://blasphemous.fandom.com/wiki/Zarabanda_of_the_Safe_Haven"
  },
  "Aubade of the Nameless Guardian": {
    thumb: getWikiPath("Aubade_of_the_Nameless_Guardian"),
    effect: "Summons a guardian spirit.",
    location: "Petrous - DLC Area.",
    map: "https://blasphemous.fandom.com/wiki/Aubade_of_the_Nameless_Guardian"
  },
  "Cantina of the Blue Rose": {
    thumb: getWikiPath("Cantina_of_the_Blue_Rose"),
    effect: "DLC Prayer",
    location: "DLC Content",
    map: "https://blasphemous.fandom.com/wiki/Cantina_of_the_Blue_Rose"
  },
  "Mirabras of the Return to Port": {
    thumb: getWikiPath("Mirabras_of_the_Return_to_Port"),
    effect: "DLC Prayer",
    location: "DLC Content",
    map: "https://blasphemous.fandom.com/wiki/Mirabras"
  },
  "Tirana of the Celestial Bastion": {
    thumb: getWikiPath("Tirana_of_the_Celestial_Bastion"),
    effect: "DLC Prayer",
    location: "DLC Content",
    map: "https://blasphemous.fandom.com/wiki/Tirana"
  }
};
