export class sfrpgbbActor extends Actor {

    /** @override */
    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }
    
    /** @override */
    prepareBaseData() {
        // Data modifications in this step occur before processing embedded
        // documents or derived data.
    }

    /**
    * @override
    * Augment the basic actor data with additional dynamic data. Typically,
    * you'll want to handle most of your calculated/derived data in this step.
    * Data calculated in this step should generally not exist in template.json
    * (such as ability modifiers rather than ability scores) and should be
    * available both inside and outside of character sheets (such as if an actor
    * is queried and has a roll executed directly from it).
    */
    prepareDerivedData() {
        const actorData = this.data;
        const data = actorData.data;

        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        this._prepareCharacterData(actorData);
        this._prepareNpcData(actorData);
    }

    // Calculate values (such as ability scores)
    _prepareCharacterData(actorData) {
        if (actorData.type !== 'character') return;

        const data = actorData.data;

        //print out the data structure in the console if needed
        //console.log(data);

        //data.abilities.str = Math.floor((data.abilities.strength - 10) / 2);
        for (let [key, ability] of Object.entries(data.abilities)) {
            // Calculate the modifier using d20 rules.
            ability.mod = Math.floor((ability.value - 10) / 2);
        }

        // Character Sheet Stuff
        // Calculate character level based on XP
        this._calculateLevel(actorData);
        // Calculate character initiative
        this._calculateInitiative(actorData);
        // Enforce maximum and minimum HP and RP amounts
        this._enforceMaxPoints(actorData);
        // Calculate Armor Class
        this._calculateAC(actorData);
        // Calculate Saving Throws
        this._calculateSaves(actorData);
        // Calculate Attack
        this._calculateAttack(actorData);
        // Calculate Skills
        this._calculateSkills(actorData);

        // Owned Items and related stuff
        data.equipment = actorData.items.filter(function (item) { return ((item.type == "gear") || (item.type == "armorUpgrade") || (item.type == "weaponFusion")) });
        data.weapons = actorData.items.filter(function (item) { return ((item.type == "weapon") || (item.type == "grenade")) });
        data.armor = actorData.items.filter(function (item) { return item.type == "armor"});
        data.spellList = actorData.items.filter(function (item) { return item.type == "spell"});

        // Output data to a console (for debugging)
        console.log(actorData);
    }

    /**
    * Prepare NPC type specific data.
    */
    _prepareNpcData(actorData) {
        if (actorData.type !== 'npc') return;
    
        // Make modifications to data here. For example:
        const data = actorData.data;

        // Enforce maximum and minimum HP and RP amounts
        this._enforceMaxPoints(actorData);
        
        // Output data to a console (for debugging)
        console.log(actorData);

    }

    /**
     * Calculate character level and next level xp
     */
    _calculateLevel(actorData) {
        const data = actorData.data;
        const XP = data.information.xp;
        const levelXP = [0, 1300, 3300, 6000];
        let lvl = 0;
        let nextXP = 0;
        
        for (const lvlXP of levelXP) {
            if (XP >= lvlXP) {
                lvl += 1;
            } else {
                nextXP = lvlXP - XP;
                break;
            }
        }
        data.information.level = lvl;
        data.information.nextXP = nextXP;
    }

    /**
     * Calculate character initiative
     */
    _calculateInitiative(actorData) {
        const data = actorData.data;
        const dex = data.abilities.dexterity.mod;
        const misc = data.movement.miscInitiative;
        data.movement.initiative = dex + misc;
    }

    /**
     * Enforce Maximum HP, RP, and Spell Slots
     */
    _enforceMaxPoints(actorData) {
        const data = actorData.data;
        
        // HP and RP
        const HP = data.defence.hp.value;
        const maxHP = data.defence.hp.max;
        const RP = data.defence.rp.value;
        const maxRP = data.defence.rp.max;

        if (HP > maxHP) {
            actorData.data.defence.hp.value = maxHP;
        } else if (HP < 0){
            actorData.data.defence.hp.value = 0;
        }

        if (RP > maxRP) {
            actorData.data.defence.rp.value = maxRP;
        } else if (RP < 0){
            actorData.data.defence.rp.value = 0;
        }

        // Spell Slots
        const lvl1Slots = data.spells.lvl1.value;
        const maxLvl1Slots = data.spells.lvl1.max;
        const lvl2Slots = data.spells.lvl2.value;
        const maxLvl2Slots = data.spells.lvl2.max;
        
        if (lvl1Slots > maxLvl1Slots) {
            actorData.data.spells.lvl1.value = maxLvl1Slots;
        } else if (lvl1Slots < 0){
            actorData.data.spells.lvl1.value = 0;
        }

        if (lvl2Slots > maxLvl2Slots) {
            actorData.data.spells.lvl2.value = maxLvl2Slots;
        } else if (lvl2Slots < 0){
            actorData.data.spells.lvl2.value = 0;
        }
    }

    /**
     * Calculate Armor Class
     */
    _calculateAC(actorData) {
        const data = actorData.data;
        const dex = data.abilities.dexterity.mod;
        const armor = data.defence.armor.armorBonus;
        const misc = data.defence.armor.misc;

        data.defence.armor.ac = 10 + dex + armor + misc;
    }

    /**
     * Calculate Saving Throws
     */
    _calculateSaves(actorData) {
        const data = actorData.data;

        // Fortitude
        const con = data.abilities.constitution.mod;
        const fortitudeClass = data.defence.save.fortitude.class;
        const fortitudeMisc = data.defence.save.fortitude.misc;

        // Reflex
        const dex = data.abilities.dexterity.mod;
        const reflexClass = data.defence.save.reflex.class;
        const reflexMisc = data.defence.save.reflex.misc;
        
        // Will
        const wis = data.abilities.wisdom.mod;
        const willClass = data.defence.save.will.class;
        const willMisc = data.defence.save.will.misc;

        // Calculations
        data.defence.save.fortitude.value = con + fortitudeClass + fortitudeMisc;
        data.defence.save.reflex.value = dex + reflexClass + reflexMisc;
        data.defence.save.will.value = wis + willClass + willMisc;
    }

    /**
     * Calculate Attack
     */
    _calculateAttack(actorData) {
        const data = actorData.data;
        const str = data.abilities.strength.mod;
        const dex = data.abilities.dexterity.mod;
        const meleeClass = data.attack.bonus.melee.class;
        const rangedClass = data.attack.bonus.ranged.class;
        data.attack.bonus.melee.value = str + meleeClass;
        data.attack.bonus.ranged.value = dex + rangedClass;
    }

    /**
     * Calculate Skills
     * 
     * Code isn't very efficient, but I think it gives good intuition as to how things are being calculated
     */
    _calculateSkills(actorData) {
        const data = actorData.data;

        // Character Level
        const charLevel = data.information.level;
        
        // Ability Score Modifiers
        const str = data.abilities.strength.mod;
        const dex = data.abilities.dexterity.mod;
        const con = data.abilities.constitution.mod;
        const int = data.abilities.intelligence.mod;
        const wis = data.abilities.wisdom.mod;
        const cha = data.abilities.charisma.mod;

        // Skills
        let athletics = data.skills.athletics;
        let culture = data.skills.culture;
        let interaction = data.skills.interaction;
        let medicine = data.skills.medicine;
        let mysticism = data.skills.mysticism;
        let perception = data.skills.perception;
        let science = data.skills.science;
        let stealth = data.skills.stealth;
        let survival = data.skills.survival;
        let technology = data.skills.technology;

        // Add appropriate Ability mods to the data structure
        athletics.abilityMod = str;
        culture.abilityMod = int;
        interaction.abilityMod = cha;
        medicine.abilityMod = int;
        mysticism.abilityMod = wis;
        perception.abilityMod = wis;
        science.abilityMod = int;
        stealth.abilityMod = dex;
        survival.abilityMod = wis;
        technology.abilityMod = int;
        
        // Store skills in array
        const skillList = {
            athletics,
            culture,
            interaction,
            medicine,
            mysticism,
            perception,
            science,
            stealth,
            survival,
            technology
        };

        // Calculate values based on level and skill proficiencies
        for (let key in skillList) {
            if (!skillList.hasOwnProperty(key)) continue;
            
            // Update skill values
            let skill = skillList[key];
            if (skill.classSkill) {
                skill.class = 3;
                skill.level = charLevel;
            } else {
                skill.class = 0;
                skill.level = 0;
            }
            if (skill.trainedSkill) {
                skill.level = charLevel;
            } else if (!skill.classSkill) {
                skill.level = 0;
            }

            // Calculate total skill bonuses
            skill.value = skill.abilityMod + skill.class + skill.level + skill.misc;
        }
    }
}