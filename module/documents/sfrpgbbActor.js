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

        // Output data to a console (for debugging)
        console.log(data);
    }

    /**
    * Prepare NPC type specific data.
    */
    _prepareNpcData(actorData) {
        if (actorData.type !== 'npc') return;
    
        // Make modifications to data here. For example:
        const data = actorData.data;
        //data.xp = (data.cr * data.cr) * 100;
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
     * Enforce Maximum HP and RP
     */
    _enforceMaxPoints(actorData) {
        const data = actorData.data;
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

        const con = data.abilities.constitution.mod;
        const fortitudeClass = data.defence.save.fortitude.class;
        const fortitudeMisc = data.defence.save.fortitude.misc;

        const dex = data.abilities.dexterity.mod;
        const reflexClass = data.defence.save.reflex.class;
        const reflexMisc = data.defence.save.reflex.misc;
        
        const wis = data.abilities.wisdom.mod;
        const willClass = data.defence.save.will.class;
        const willMisc = data.defence.save.will.misc;

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
     */
         _calculateSkills(actorData) {
            const data = actorData.data;
            
            // Ability Score Modifiers
            const str = data.abilities.strength.mod;
            const dex = data.abilities.dexterity.mod;
            const con = data.abilities.constitution.mod;
            const int = data.abilities.intelligence.mod;
            const wis = data.abilities.wisdom.mod;
            const cha = data.abilities.charisma.mod;

            // Athletics
            const athleticsClass = data.skills.athletics.class;
            const athleticsLevel = data.skills.athletics.level;
            const athleticsMisc = data.skills.athletics.misc;
            
            // Culture
            const cultureClass = data.skills.culture.class;
            const cultureLevel = data.skills.culture.level;
            const cultureMisc = data.skills.culture.misc;

            // Interaction
            const interactionClass = data.skills.interaction.class;
            const interactionLevel = data.skills.interaction.level;
            const interactionMisc = data.skills.interaction.misc;

            // Medicine
            const medicineClass = data.skills.medicine.class;
            const medicineLevel = data.skills.medicine.level;
            const medicineMisc = data.skills.medicine.misc;

            // Mysticism
            const mysticismClass = data.skills.mysticism.class;
            const mysticismLevel = data.skills.mysticism.level;
            const mysticismMisc = data.skills.mysticism.misc;

            // Perception
            const perceptionClass = data.skills.perception.class;
            const perceptionLevel = data.skills.perception.level;
            const perceptionMisc = data.skills.perception.misc;

            // Science
            const scienceClass = data.skills.science.class;
            const scienceLevel = data.skills.science.level;
            const scienceMisc = data.skills.science.misc;

            // Stealth
            const stealthClass = data.skills.stealth.class;
            const stealthLevel = data.skills.stealth.level;
            const stealthMisc = data.skills.stealth.misc;

            // Survival
            const survivalClass = data.skills.survival.class;
            const survivalLevel = data.skills.survival.level;
            const survivalMisc = data.skills.survival.misc;

            // Technology
            const technologyClass = data.skills.technology.class;
            const technologyLevel = data.skills.technology.level;
            const technologyMisc = data.skills.technology.misc;
            
            // Calculations
            data.skills.athletics.value = str + athleticsClass + athleticsLevel + athleticsMisc;
            data.skills.culture.value = int + cultureClass + cultureLevel + cultureMisc;
            data.skills.interaction.value = cha + interactionClass + interactionLevel + interactionMisc;
            data.skills.medicine.value = int + medicineClass + medicineLevel + medicineMisc;
            data.skills.mysticism.value = wis + mysticismClass + mysticismLevel + mysticismMisc;
            data.skills.perception.value = wis + perceptionClass + perceptionLevel + perceptionMisc;
            data.skills.science.value = int + scienceClass + scienceLevel + scienceMisc;
            data.skills.stealth.value = dex + stealthClass + stealthLevel + stealthMisc;
            data.skills.survival.value = wis + survivalClass + survivalLevel + survivalMisc;
            data.skills.technology.value = int + technologyClass + technologyLevel + technologyMisc;

        }
}