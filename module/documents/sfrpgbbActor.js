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

        //data.abilities.str = Math.floor((data.abilities.strength - 10) / 2);
        for (let [key, ability] of Object.entries(data.abilities)) {
            // Calculate the modifier using d20 rules.
            ability.mod = Math.floor((ability.value - 10) / 2);
        }
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
}