document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const state = {
        searchTerm: '',
        statusFilter: 'all',
        activeTags: new Set(),
        logicMode: 'AND'
    };

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const searchInput = document.getElementById('searchInput');
    const totalItems = checkboxes.length;

    // --- ROSARY BEAD DATA ---
    const ROSARY_DATA = {
        "Amber Eye": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Amber_Eye.png", effect: "Increases resistance to Lightning damage.", location: "Library of the Negated Words. Found in a chest guarded by a ghost.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Amber_Eye_Location.png" },
        "Big Bead of Blue Wax": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Big_Bead_of_Blue_Wax.png", effect: "Significantly increases maximum Fervour.", location: "Brotherhood of the Silent Sorrow. Complete the Redento questline steps.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Bead_of_Blue_Wax_Location.png" },
        "Big Bead of Red Wax": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Big_Bead_of_Red_Wax.png", effect: "Significantly increases maximum Health.", location: "Mercy Dreams. Found in a chest after a platforming section.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Bead_of_Red_Wax_Location.png" },
        "Big Toe made of Limestone": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Big_Toe_made_of_Limestone.png", effect: "Allows for an extra jump/thrust in the air (contextual).", location: "Reward for assisting Redento in his pilgrimage.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Calcified Eye of Erudition": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Calcified_Eye_of_Erudition.png", effect: "Allows the Penitent One to see the health bars of enemies.", location: "Graveyard of the Peaks. Found in a hidden room.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Calcified_Eye_of_Erudition_Location.png" },
        "Consecrated Amethyst": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Consecrated_Amethyst.png", effect: "Greatly increases resistance to Magical damage.", location: "Mother of Mothers. Found in a chest near the top.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Consecrated_Amethyst_Location.png" },
        "Dove Skull": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Dove_Skull.png", effect: "Increases the Penitent One's overall physical defense.", location: "Albero. Reward from Tirso for bringing him early-game herbs.", map: "https://blasphemous.fandom.com/wiki/Albero" },
        "Drop of Coagulated Ink": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Drop_of_Coagulated_Ink.png", effect: "Increases the damage and effectiveness of Prayers.", location: "Library of the Negated Words. Behind a breakable wall.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Drop_of_Coagulated_Ink_Location.png" },
        "Ember of the Holy Cremation": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Ember_of_the_Holy_Cremation.png", effect: "Increases physical defense (Base 15%).", location: "Graveyard of the Peaks. Purchased from Candelaria.", map: "https://blasphemous.fandom.com/wiki/Graveyard_of_the_Peaks" },
        "Embers of a Broken Star": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Embers_of_a_Broken_Star.png", effect: "Increases the amount of Fervour gained from hitting enemies.", location: "Graveyard of the Peaks. Found near the elevators.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Fourth Toe Made of Limestone": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Fourth_Toe_Made_of_Limestone.png", effect: "Reduces the cooldown of the dodge capability.", location: "Reward from Redento in the Patio of the Silent Steps.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Frozen Olive": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Frozen_Olive.png", effect: "Significantly increases defense when health is low (below 20%).", location: "Graveyard of the Peaks. Reward for completing Gemino's quest.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Frozen_Olive_Location.png" },
        "Hollow Pearl": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Hollow_Pearl.png", effect: "Generates Fervour when destroying scenery objects.", location: "Desecrated Cistern. Found in a chest.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Knot of Hair": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Knot_of_Hair.png", effect: "Slightly increases the damage of Mea Culpa.", location: "Grievance Ascends. Found in the poisonous gas area.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Knot_of_Hair_Location.png" },
        "Little Toe Made of Limestone": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Little_Toe_Made_of_Limestone.png", effect: "Increases the distance of the dodge.", location: "Reward from Redento in the Wasteland of the Buried Churches.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Moss Preserved in Glass": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Moss_Preserved_in_Glass.png", effect: "Increases resistance to toxic clouds and gas.", location: "Mercy Dreams. Behind a hidden wall in the vertical room.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Moss_Preserved_in_Glass_Location.png" },
        "Muted Bell": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Muted_Bell.png", effect: "Increases resistance to Magic damage.", location: "Graveyard of the Peaks. Found in a chest.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Painted Wood Bead": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Painted_Wood_Bead.png", effect: "Increases damage against targets with low health.", location: "Desecrated Cistern. Behind a secret wall.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Pelican Effigy": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Pelican_Effigy.png", effect: "Provides invulnerability while using a Bile Flask.", location: "Jondo. Found in a chest guarded by a bell-ringer.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Pelican_Effigy_Location.png" },
        "Perpetva's Protection": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Perpetva%27s_Protection.png", effect: "Protects against Lightning damage.", location: "Mountains of the Endless Dusk. Reward for defeating Perpetva.", map: "https://blasphemous.fandom.com/wiki/Mountains_of_the_Endless_Dusk" },
        "Piece of a Golden Mask": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Piece_of_a_Golden_Mask.png", effect: "Greatly increases resistance to Fire damage.", location: "Convent of Our Lady of the Charred Visage. In a chest.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Piece_of_a_Golden_Mask_Location.png" },
        "Piece of a Tombstone": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Piece_of_a_Tombstone.png", effect: "Reduces the recovery time after a large fall.", location: "Graveyard of the Peaks. Near the top area.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Quirce's Scorched Bead": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Quirce%27s_Scorched_Bead.png", effect: "Greatly increases resistance to Fire damage.", location: "Wall of the Holy Prohibitions. Reward for defeating Quirce.", map: "https://blasphemous.fandom.com/wiki/Quirce" },
        "Scaly Coin": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Scaly_Coin.png", effect: "Increases Tears of Atonement gained from killing enemies.", location: "Desecrated Cistern. Hidden in the water area.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Seashell of the Inverted Spiral": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Seashell_of_the_Inverted_Spiral.png", effect: "Increases resistance to all elemental damage types.", location: "The Sleeping Canvases. Purchased from Candelaria.", map: "https://blasphemous.fandom.com/wiki/The_Sleeping_Canvases" },
        "Silver Grape": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Silver_Grape.png", effect: "Significantly increases physical defense.", location: "Desecrated Cistern. Complete the switch puzzle in the dark room.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads?file=Silver_Grape_Location.png" },
        "Sphere of the Sacred Smoke": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Sphere_of_the_Sacred_Smoke.png", effect: "Restores Fervour when performing an Execution.", location: "Wall of the Holy Prohibitions. In a cell.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Thorned Symbol": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Thorned_Symbol.png", effect: "Protects against damage from touching enemies directly.", location: "Patio of the Silent Steps. Found in a chest.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Uvula of Proclamation": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Uvula_of_Proclamation.png", effect: "Chance to earn Tears of Atonement from breaking objects.", location: "Library of the Negated Words. In a hidden chest.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Wicker Knot": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Wicker_Knot.png", effect: "Increases resistance to Toxic damage.", location: "Albero. Reward from Tirso after several herb donations.", map: "https://blasphemous.fandom.com/wiki/Albero" },
        "Reliquary of the Fervent Heart": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Reliquary_of_the_Fervent_Heart.png", effect: "Slowly regenerates Health over time after using a Bile Flask.", location: "NG+ Reward. Complete the game with the Penitence of the Bleeding Heart.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Reliquary of the Sorrowful Heart": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Reliquary_of_the_Sorrowful_Heart.png", effect: "Bile Flasks now restore Fervour instead of Health.", location: "NG+ Reward. Complete the game with the Penitence of the Unwavering Faith.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Reliquary of the Suffering Heart": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Reliquary_of_the_Suffering_Heart.png", effect: "Changes health into spheres; and improves Mea Culpa damage based on Guilt.", location: "NG+ Reward. Complete the game with the Penitence of the True Guilt.", map: "https://blasphemous.fandom.com/wiki/Rosary_Beads" },
        "Bead of Gold Thread": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Bead_of_Gold_Thread.png", effect: "Greatly increases resistance to Magical damage.", location: "Hall of the Dawning. Found during the Amanecidas questline.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "Aspirant's Rosary Bead": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Aspirant%27s_Rosary_Bead.png", effect: "Increases the amount of Fervour gained.", location: "Hall of the Dawning. Found during the Amanecidas questline.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "Saeta of the Golden Rose": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Saeta_of_the_Golden_Rose.png", effect: "Slightly increases Mea Culpa damage.", location: "Reward from the Amanecida of the Golden Rose.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "Young Man's Face": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Young_Man%27s_Face.png", effect: "Increases the damage of Prayers.", location: "Reward from the Amanecida of the Young Man.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "Old Man's Face": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Old_Man%27s_Face.png", effect: "Increases physical defense.", location: "Reward from the Amanecida of the Old Man.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "Crown of Gnawed Iron": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Crown_of_Gnawed_Iron.png", effect: "Increases the damage of Mea Culpa combos.", location: "Reward from the Amanecida of the Gnawed Iron.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "Solitude": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Solitude.png", effect: "Increases Fire resistance.", location: "Hall of the Dawning. Awarded for progressing the DLC quest.", map: "https://blasphemous.fandom.com/wiki/Amanecidas_of_the_Miracle" },
        "The Young Mason's Wheel": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/The_Young_Mason%27s_Wheel.png", effect: "Slightly increases the movement speed of the Penitent One.", location: "Library of the Negated Words. Complete the quest for Diosdado (the Library Watchman) by finding the ghost behind the secret wall.", map: "https://blasphemous.fandom.com/wiki/Diosdado" },
        "Crimson Heart of a Miura": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Crimson_Heart_of_a_Miura.png", effect: "Increases attack speed significantly when health is low.", location: "Library of the Negated Words. Complete all 5 Miriam challenges (Strife and Ruin).", map: "https://blasphemous.fandom.com/wiki/Miriam" },
        "Light of the Lady of the Lamp": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Light_of_the_Lady_of_the_Lamp.png", effect: "Increases all defenses when Bile Flasks are empty.", location: "Mourning and Havoc. Found in a chest in the lower areas.", map: "https://blasphemous.fancy.site" },
        "Cloistered Sapphire": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Cloistered_Sapphire.png", effect: "Generate a surge of energy upon striking an enemy after a dodge.", location: "Albero. Donate 75,000 Tears of Atonement to the church.", map: "https://blasphemous.fandom.com/wiki/Albero" },
        "Cloistered Ruby": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Cloistered_Ruby.png", effect: "Emits a wave of light on Mea Culpa strikes (costs Fervour).", location: "Albero. Donate 50,000 Tears of Atonement to the church.", map: "https://blasphemous.fandom.com/wiki/Albero" },
        "Scale of Burnished Gold": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Scale_of_Burnished_Gold.png", effect: "Reduces damage taken from consecutive hits.", location: "Echoes of Salt. Found in a hidden area.", map: "https://blasphemous.fandom.com/wiki/Echoes_of_Salt" },
        "Scale of Burnished Alabaster": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Scale_of_Burnished_Alabaster.png", effect: "Allows the Penitent One to block certain attacks originating from behind.", location: "Echoes of Salt. Found in a hidden area near the elevator.", map: "https://blasphemous.fandom.com/wiki/Echoes_of_Salt" },
        "Salt-covered Spear Point": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Salt-covered_Spear_Point.png", effect: "Increases resistance to all physical damage.", location: "Echoes of Salt. Found in a chest at the end of a platforming path.", map: "https://blasphemous.fandom.com/wiki/Echoes_of_Salt" },
        "Concentrated Sphere of Guilt": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Concentrated_Sphere_of_Guilt.png", effect: "Cleanses Guilt upon picking up remnants; increases Tear gain when Guilt is low.", location: "Albero Confessional. Interacting with the Father Confessor and cleansing guilt 7 times.", map: "https://blasphemous.fandom.com/wiki/Albero" },
        "Bead of the Immaculate / Weight of True Guilt": { thumb: "https://blasphemous.wiki.gg/wiki/Special:FilePath/Weight_of_True_Guilt.png", effect: "Immaculate: Protects against Guilt; Weight: Key to Ending C / Dungeons.", location: "Brotherhood of the Silent Sorrow. Transforms after dying 3 times with it equipped.", map: "https://blasphemous.fandom.com/wiki/Weight_of_True_Guilt" }
    };

    // --- DOM ELEMENTS ---
    const beadListItems = document.querySelectorAll('.bead-item');
    const statusChips = document.querySelectorAll('#statusFilters .chip');
    const tagChips = document.querySelectorAll('#tagFilters .chip');
    const logicOptions = document.querySelectorAll('.logic-option');
    const clearBtn = document.getElementById('clearFilters');

    // --- INITIALIZATION ---
    beadListItems.forEach(item => {
        const input = item.querySelector('input');
        const name = input.getAttribute('data-name');
        const data = ROSARY_DATA[name];

        // Wrap label and add toggle
        const label = item.querySelector('label');
        const mainDiv = document.createElement('div');
        mainDiv.className = 'item-main';
        item.insertBefore(mainDiv, label);
        
        // Add thumbnail if exists
        if (data && data.thumb) {
            const thumb = document.createElement('img');
            thumb.src = data.thumb;
            thumb.className = 'bead-thumb';
            thumb.alt = name;
            mainDiv.appendChild(thumb);
        }

        mainDiv.appendChild(label);

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'details-toggle';
        toggleBtn.innerText = '>';
        mainDiv.appendChild(toggleBtn);

        // Details Panel
        const panel = document.createElement('div');
        panel.className = 'details-panel';
        if (data) {
            panel.innerHTML = `
                <div class="details-content">
                    <div class="details-header">
                        <img src="${data.thumb}" class="bead-large" alt="${name}">
                        <div class="details-title-row">
                            <span class="bead-info-label">Artifact</span>
                            <span class="bead-info-value">${name}</span>
                        </div>
                    </div>
                    <div class="bead-info-row"><span class="bead-info-label">Effect</span><span class="bead-info-value">${data.effect}</span></div>
                    <div class="bead-info-row"><span class="bead-info-label">Location</span><span class="bead-info-value">${data.location}</span></div>
                    <a href="${data.map}" target="_blank" class="map-btn">View Wiki Map</a>
                </div>`;
        } else {
            panel.innerHTML = `<div class="details-content">No further details unearthed for this bead.</div>`;
        }
        item.appendChild(panel);

        toggleBtn.addEventListener('click', () => {
            const isOpen = panel.classList.contains('open');
            document.querySelectorAll('.details-panel.open').forEach(p => {
                if (p !== panel) {
                    p.classList.remove('open');
                    p.previousElementSibling.querySelector('.details-toggle').classList.remove('active');
                }
            });
            panel.classList.toggle('open');
            toggleBtn.classList.toggle('active');
        });
    });

    // --- FILTERING LOGIC ---
    const applyFilters = () => {
        beadListItems.forEach(item => {
            const input = item.querySelector('input');
            const name = input.getAttribute('data-name').toLowerCase();
            const isChecked = input.checked;
            const itemTags = item.getAttribute('data-tags').split(',').map(t => t.trim());

            // 1. Search Condition
            const matchesSearch = name.includes(state.searchTerm.toLowerCase());

            // 2. Status Condition
            let matchesStatus = true;
            if (state.statusFilter === 'checked') matchesStatus = isChecked;
            if (state.statusFilter === 'unchecked') matchesStatus = !isChecked;

            // 3. Tag Condition
            let matchesTags = true;
            if (state.activeTags.size > 0) {
                const selectedTagsArray = Array.from(state.activeTags);
                if (state.logicMode === 'AND') {
                    matchesTags = selectedTagsArray.every(tag => itemTags.includes(tag));
                } else {
                    matchesTags = selectedTagsArray.some(tag => itemTags.includes(tag));
                }
            }

            // Combine
            if (matchesSearch && matchesStatus && matchesTags) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
                // Close panel if hidden
                const panel = item.querySelector('.details-panel');
                panel.classList.remove('open');
                item.querySelector('.details-toggle').classList.remove('active');
            }
        });
        updateProgress();
    };

    // --- EVENT LISTENERS ---

    // Search
    searchInput.addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        applyFilters();
    });

    // Status Chips
    statusChips.forEach(chip => {
        chip.addEventListener('click', () => {
            statusChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.statusFilter = chip.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Tag Chips
    tagChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const tag = chip.getAttribute('data-tag');
            if (state.activeTags.has(tag)) {
                state.activeTags.delete(tag);
                chip.classList.remove('active');
            } else {
                state.activeTags.add(tag);
                chip.classList.add('active');
            }
            applyFilters();
        });
    });

    // Logic Switch
    logicOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            logicOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            state.logicMode = opt.getAttribute('data-logic');
            applyFilters();
        });
    });

    // Clear All
    clearBtn.addEventListener('click', () => {
        state.searchTerm = '';
        state.statusFilter = 'all';
        state.activeTags.clear();
        state.logicMode = 'AND';

        searchInput.value = '';
        statusChips.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
        tagChips.forEach(c => c.classList.remove('active'));
        logicOptions.forEach(o => o.classList.remove('active'));
        document.querySelector('[data-logic="AND"]').classList.add('active');

        applyFilters();
    });

    // Checklist Changes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveState();
            applyFilters(); // Re-apply to handle "Checked/Unchecked" filters
        });
    });

    // --- DATA PERSISTENCE ---
    const saveState = () => {
        const checkboxState = {};
        checkboxes.forEach(checkbox => {
            const name = checkbox.getAttribute('data-name');
            checkboxState[name] = checkbox.checked;
        });
        localStorage.setItem('blasphemous_beads', JSON.stringify(checkboxState));
    };

    const loadState = () => {
        const savedData = JSON.parse(localStorage.getItem('blasphemous_beads')) || {};
        checkboxes.forEach(checkbox => {
            const name = checkbox.getAttribute('data-name');
            if (savedData[name]) {
                checkbox.checked = true;
            }
        });
        updateProgress();
    };

    const updateProgress = () => {
        const visibleItems = document.querySelectorAll('.bead-item:not(.hidden)');
        const totalVisible = visibleItems.length;
        const checkedVisible = Array.from(visibleItems).filter(item => item.querySelector('input').checked).length;
        
        const percentage = totalVisible > 0 ? (checkedVisible / totalVisible) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.innerText = `${checkedVisible} / ${totalVisible}`;

        if (totalVisible > 0 && checkedVisible === totalVisible) {
            progressBar.style.background = 'linear-gradient(90deg, #d4af37, #fff)';
            progressBar.style.boxShadow = '0 0 20px #d4af37';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #8b0000, #ff0000)';
            progressBar.style.boxShadow = '0 0 10px #ff0000';
        }
    };

    loadState();
    applyFilters();
});
