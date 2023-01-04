import {sfrpgbb} from "./module/config.js";
import {sfrpgbbActor} from "./module/documents/sfrpgbbActor.js";
import sfrpgbbItemSheet from "./module/sheets/sfrpgbbItemSheet.js";
import sfrpgbbActorSheet from "./module/sheets/sfrpgbbActorSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/sfrpgbb/templates/partials/character-abilities.hbs",
        "systems/sfrpgbb/templates/partials/character-attack.hbs",
        "systems/sfrpgbb/templates/partials/character-defence.hbs",
        "systems/sfrpgbb/templates/partials/character-equipment.hbs",
        "systems/sfrpgbb/templates/partials/character-information.hbs",
        "systems/sfrpgbb/templates/partials/character-movement.hbs",
        "systems/sfrpgbb/templates/partials/character-proficiencies.hbs",
        "systems/sfrpgbb/templates/partials/character-skills.hbs",
        "systems/sfrpgbb/templates/partials/character-spellList.hbs",
        "systems/sfrpgbb/templates/partials/character-spells.hbs",
        "systems/sfrpgbb/templates/partials/character-traits-features-feats.hbs",
        "systems/sfrpgbb/templates/partials/npc-defence.hbs",
        "systems/sfrpgbb/templates/partials/npc-description.hbs",
        "systems/sfrpgbb/templates/partials/npc-equipment.hbs",
        "systems/sfrpgbb/templates/partials/npc-infobar.hbs",
        "systems/sfrpgbb/templates/partials/npc-offence.hbs",
        "systems/sfrpgbb/templates/partials/npc-specialAbilities.hbs",
        "systems/sfrpgbb/templates/partials/npc-statistics.hbs"
    ];

    return loadTemplates(templatePaths);
}

function registerSystemSettings() {
    game.settings.register("sfrpgbb", "systemMigrationVersion", {
        config: false,
        scope: "world",
        type: String,
        default: ""
    });
}

function migrateActorData(actor) {
    let updateData = {};

    if (actor.type != "npc") {
        return updateData;
    }

    let atk = actor.system.attack;
    //let updateTemp = {};
    //console.log(actor)
    //console.log(atk.bonus.melee.value)
    //console.log(atk.melee.attackBonus)

    // Move attack and damage bonuses to new locations
    if (!atk.bonus.melee.value) {
        if (!(atk.melee.attackBonus == null)) {
            updateData["system.attack.bonus.melee.value"] = atk.melee.attackBonus;
        }
    }
    if (!atk.bonus.ranged.value) {
        if (!(atk.ranged.attackBonus == null)) {
            updateData["system.attack.bonus.ranged.value"] = atk.ranged.attackBonus;
        }
    }
    if (!atk.bonus.melee.damageBonus) {
        if (!(atk.melee.damageBonus == null)) {
            updateData["system.attack.bonus.melee.damageBonus"] = atk.melee.damageBonus;
        }
    }
    if (!atk.bonus.ranged.damageBonus) {
        if (!(atk.ranged.damageBonus == null)) {
            updateData["system.attack.bonus.ranged.damageBonus"] = atk.ranged.damageBonus;
        }
    }

    //console.log(updateTemp);
    //console.log(updateData);
    //updateData.system = actor.system;
    return updateData;
}

async function migrateWorld() {
    // Migrate Actors in Actor List
    for (let actor of game.actors.contents) {
        const updateData = migrateActorData(actor);
        if (!foundry.utils.isEmpty(updateData)) {
            console.log(`Migrating Actor entity ${actor.name}.`);
            await actor.update(updateData);
        }
        else {
            console.log(`Actor ${actor.name} needs no migration.`);
        }
    }

    // Migrate Actors in the compendiums

    // Migrate Actors in Scenes

}

Hooks.once("init", function() {
    console.log("sfrpgbb | Initializing Starfinder Beginner Box System");

    CONFIG.sfrpgbb = sfrpgbb;

    // Define custom Document classes
    CONFIG.Actor.documentClass = sfrpgbbActor;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sfrpgbb", sfrpgbbItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("sfrpgbb", sfrpgbbActorSheet, {makeDefault: true});

    preloadHandlebarsTemplates();

    registerSystemSettings();

    // Handlebars replace newline characters with html newline in textarea display
    Handlebars.registerHelper('breaklines', function(text) {
        text = Handlebars.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '&#10;');
        return new Handlebars.SafeString(text);
    });

    // Handlebars for loop
    Handlebars.registerHelper("times", function (n, content){
        let result = "";
        for (let i = 0; i < n; ++i) {
            result += content.fn(i);
        }
        return result;
    });

    // Handlebars switch/case
    Handlebars.registerHelper('switch', function(value, options) {
        this.switch_value = value;
        return options.fn(this);
    });

    Handlebars.registerHelper('case', function(value, options) {
        if (value == this.switch_value) {
            return options.fn(this);
        }
    });

    // Handlebars console log
    Handlebars.registerHelper("log", function(something) {
        console.log(something);
    });

    // Handlebars concatenation
    Handlebars.registerHelper('concat', function() {
        var outStr = '';
        for(var arg in arguments){
            if(typeof arguments[arg]!='object'){
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    // Handlebars check if negative
    Handlebars.registerHelper('fetchPositive', function(value, options) {
        if(value < 0 || value == null) {
          return '';
        }
        return '+';
    });
    
    // Handlebars return true if value is null
    Handlebars.registerHelper('isNull', function(value, options) {
        if(value == null) {
          return "nullBox";
        }
        return "fullBox";
    });
    
    // Handlebars check if an array is empty
    Handlebars.registerHelper('hasData', function(value, options) {
        if(value === undefined){
            return false;
        }
        if(value == null){
            return false;
        }
        if(value.length) {
            return true;
        }
        return false;
    });

    // Handlebars check if two values are equal
    Handlebars.registerHelper('isEqual', function(value, target, dontInvert, options) {
        if(value == target) {
            if(dontInvert) {
                return true;
            }
            return false;
        }
        if(dontInvert) {
            return false;
        }
        return true;
    });
    
    // Remove html tags from text that is to be displayed
    Handlebars.registerHelper('stripTags', function(param) {
        var regex = /(<([^>]+)>)/ig
        if(param === undefined) {
            return param;
        }
        if(param == null) {
            return param;
        }
        
        // Reduce preview length
        /*
        * if(param.length > 200) {
        *    let tmpString = param.slice(0,200)
        *    return new Handlebars.SafeString(tmpString.replace(regex, ""));
        * }
        */

        return new Handlebars.SafeString(param.replace(regex, ""));
    });

    // Add two numbers
    Handlebars.registerHelper('add', function(one, two) {
        return (one+two);
    });

    Hooks.once("ready", function () {
        if (!game.user.isGM) {
            return;
        }

        const currentVersion = game.settings.get("sfrpgbb", "systemMigrationVersion");
        const NEEDS_MIGRATION_VERSION = 1.2;
        const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion)

        if (needsMigration) {
            console.log("We need to migrate");
            migrateWorld();
        }
    });
});