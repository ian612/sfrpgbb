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
        //const actorData = this.data;
        //console.log(this)

        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        //this._prepareCharacterData(actorData);
        //this._prepareNpcData(actorData);
        this._prepareCharacterData();
        this._prepareNpcData();
    }

    // Calculate values for character sheet (such as ability scores, AC, etc.)
    _prepareCharacterData() {
        if (this.type !== 'character') return;

        const data = this.system;
        const items = this.items;

        //print out the data structure in the console if needed
        //console.log(this);

        //data.abilities.str = Math.floor((data.abilities.strength - 10) / 2);
        for (let [key, ability] of Object.entries(data.abilities)) {
            // Calculate the modifier using d20 rules.
            ability.mod = Math.floor((ability.value - 10) / 2);
        }

        // Owned Items and related stuff
        data.equipment = this.items.filter(function (item) { return ((item.type == "gear") || (item.type == "armorUpgrade") || (item.type == "weaponFusion")) });
        data.weapons = this.items.filter(function (item) { return ((item.type == "weapon") || (item.type == "grenade")) });
        data.armor = this.items.filter(function (item) { return item.type == "armor"});
        data.spellList = {};
        data.spellList.zero = this.items.filter(function (item) { return ((item.type == "spell") && (item.system.level == 0))});
        data.spellList.one = this.items.filter(function (item) { return ((item.type == "spell") && (item.system.level == 1))});
        data.spellList.two = this.items.filter(function (item) { return ((item.type == "spell") && (item.system.level == 2))});
        // If any NPC Abilities get added, file them here
        data.npcAbilities = this.items.filter(function (item) { return item.type == "npcAbility"});

        // Character Sheet Stuff
        // Calculate character level based on XP
        this._calculateLevel(data);
        // Calculate character initiative
        this._calculateInitiative(data);
        // Enforce maximum and minimum HP and RP amounts
        this._enforceMaxPoints(data);
        // Calculate Armor Class
        this._calculateAC(data);
        // Calculate Saving Throws
        this._calculateSaves(data);
        // Calculate Attack
        this._calculateAttack(data);
        // Calculate Skills
        this._calculateSkills(data);

        // Delete NPC abilities that have been added to character sheets by accident
        this._deleteNPCAbilities(items);

        // Output data to a console (for debugging)
        //console.log(actorData);
    }

    /**
    * Prepare NPC type specific data.
    */
    _prepareNpcData() {
        if (this.type !== 'npc') return;
    
        // Make modifications to data here. For example:
        const data = this.system;
        const items = this.items;
        
        // Owned Items and related stuff
        data.equipment = items.filter(function (item) { return ((item.type == "gear") || (item.type == "armorUpgrade") || (item.type == "weaponFusion")) });
        data.rangedWeapons = items.filter(function (item) { return (item.type == "weapon" && (item.system.weaponType == "smallArms" || item.system.weaponType == "longArms")) || (item.type == "grenade") });
        data.meleeWeapons = items.filter(function (item) { return (item.type == "weapon" && (item.system.weaponType == "meleeBasic" || item.system.weaponType == "meleeAdvanced")) });
        data.armor = items.filter(function (item) { return item.type == "armor"});
        data.spellList = {};
        data.spellList.zero = items.filter(function (item) { return ((item.type == "spell") && (item.system.level == 0))});
        data.spellList.one = items.filter(function (item) { return ((item.type == "spell") && (item.system.level == 1))});
        data.spellList.two = items.filter(function (item) { return ((item.type == "spell") && (item.system.level == 2))});
        data.npcAbilities = {};
        data.npcAbilities.defence = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "defence"))});
        data.npcAbilities.energyResist = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "energyResist"))});
        data.npcAbilities.immunity = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "immunity"))});
        data.npcAbilities.movement = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "movement"))});
        data.npcAbilities.offence = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "offence"))});
        data.npcAbilities.other = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "other"))});
        data.npcAbilities.weakness = items.filter(function (item) { return ((item.type == "npcAbility") && (item.system.type == "weakness"))});

        // Enforce maximum and minimum HP and RP amounts
        this._enforceMaxPoints(data);
        // Calculate XP based on CR
        this._calculateXP(data);
        // Calculate multiattack bonus
        this._calcMultiattack(data);

        // Output data to a console (for debugging)
        //console.log(actorData);

    }

    /**
     * Calculate character level and next level xp
     */
    _calculateLevel(data) {
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
    _calculateInitiative(data) {
        const dex = data.abilities.dexterity.mod;
        const misc = data.movement.miscInitiative;
        data.movement.initiative = dex + misc;
    }

    /**
     * Enforce Maximum HP, RP, and Spell Slots
     */
    _enforceMaxPoints(data) {
        // HP and RP
        const HP = data.defence.hp.value;
        const maxHP = data.defence.hp.max;
        const RP = data.defence.rp.value;
        const maxRP = data.defence.rp.max;

        if (HP > maxHP) {
            data.defence.hp.value = maxHP;
        } else if (HP < 0){
            data.defence.hp.value = 0;
        }

        if (RP > maxRP) {
            data.defence.rp.value = maxRP;
        } else if (RP < 0){
            data.defence.rp.value = 0;
        }

        // Spell Slots
        const lvl1Slots = data.spells.lvl1.value;
        const maxLvl1Slots = data.spells.lvl1.max;
        const lvl2Slots = data.spells.lvl2.value;
        const maxLvl2Slots = data.spells.lvl2.max;
        
        if (lvl1Slots > maxLvl1Slots) {
            data.spells.lvl1.value = maxLvl1Slots;
        } else if (lvl1Slots < 0){
            data.spells.lvl1.value = 0;
        }

        if (lvl2Slots > maxLvl2Slots) {
            data.spells.lvl2.value = maxLvl2Slots;
        } else if (lvl2Slots < 0){
            data.spells.lvl2.value = 0;
        }
    }

    /**
     * Calculate Armor Class
     */
    _calculateAC(data) {
        const dex = data.abilities.dexterity.mod;
        const armor = data.defence.armor.armorBonus;
        const misc = data.defence.armor.misc;
        
        // placeholder for total of equipped armor bonuses
        let AC = 0;

        // Add equipped armor AC to character armor AC
        for (let [key, armorItem] of Object.entries(data.armor)) {
            //console.log(armorItem);
            if (armorItem.system.equipped) {
                AC += armorItem.system.ac;
            }
        }

        data.defence.armor.armorBonus = AC;

        data.defence.armor.ac = 10 + dex + data.defence.armor.armorBonus + misc;
    }

    /**
     * Calculate Saving Throws
     */
    _calculateSaves(data) {
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
    _calculateAttack(data) {
        const str = data.abilities.strength.mod;
        const dex = data.abilities.dexterity.mod;
        const meleeClass = data.attack.bonus.melee.class;
        const rangedClass = data.attack.bonus.ranged.class;
        data.attack.bonus.melee.value = str + meleeClass;
        data.attack.bonus.ranged.value = dex + rangedClass;

        if (data.spells.bonusAbility == "int") {
            data.spells.spellDCBonus = data.abilities.intelligence.mod + data.spells.spellDCMisc
        }
        if (data.spells.bonusAbility == "wis") {
            data.spells.spellDCBonus = data.abilities.wisdom.mod + data.spells.spellDCMisc
        }
    }

    /**
     * Calculate Skills
     * 
     * Code isn't very efficient, but I think it gives good intuition as to how things are being calculated
     */
    _calculateSkills(data) {
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

    /**
     * Delete NPC Ability items that have been added to player character sheets
     */
    _deleteNPCAbilities(items) {
        const npcAbilities = items.filter(function (item) { return item.type == "npcAbility"});

        // If there are any NPC abilities in the list of items, run this section
        if (npcAbilities.length > 0){
            for (let i = 0; i < npcAbilities.length; i++) {
                console.log("Invalid item for this sheet type (Player Character). Not added.")
                this.deleteEmbeddedDocuments("Item", [npcAbilities[i].id])
            }
        }

    }

    //
    // NPC-Only Functions
    //

    /**
     * Calculate XP based on NPC CR
     */
     _calculateXP(data) {
        const CRprog = ["1/3", "1/2", "1", "2", "3", "4", "5", "6", "7"];
        const XPprog = [135, 200, 400, 600, 800, 1200, 1600, 2400, 3200];
        
        // console.log(CRprog);
        // console.log(XPprog);
        // console.log(CRprog.includes(data.information.cr));
        // console.log(CRprog.indexOf(data.information.cr));
        
        if (CRprog.includes(data.information.cr)) {
            data.information.xp = XPprog[CRprog.indexOf(data.information.cr)];
        }
        else {
            data.information.xp = null;
        }
    }

    /**
     * Calculate NPC Multiattack attack bonus
     */
    _calcMultiattack(data) {
        // if statement catch to stop errors from unmigrated data created in versions prior to 1.2
        //console.log(data);
        if (!(data.attack?.bonus?.melee?.multiattackBonus == null)) {
            data.attack.bonus.melee.multiattackBonus = data.attack.bonus.melee.value - 6;
        }
    }
}