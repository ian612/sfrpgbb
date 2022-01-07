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
        // Calculate armor class
        this._calculateAC(actorData);

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
}