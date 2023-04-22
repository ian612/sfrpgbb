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
    // Version Migration
    game.settings.register("sfrpgbb", "systemMigrationVersion", {
        config: false,
        scope: "world",
        type: String,
        default: ""
    });

    // Diagonal Movement Rule
    game.settings.register("sfrpgbb", "diagonalMovement", {
        name: "SETTINGS.DiagName",
        hint: "SETTINGS.DiagHint",
        scope: "world",
        config: true,
        default: "5105",
        type: String,
        choices: {
            5105: "SETTINGS.Diag5105",
            555: "SETTINGS.Diag555",
            EUCL: "SETTINGS.DiagEucl"
        },
        onChange: rule => canvas.grid.diagonalRule = rule
    });
}

async function migrateWorld() {
    // Migrate Actors in Actor List
    for (let actor of game.actors.contents) {
        //console.log(actor);
        const updateData = migrateActorData(actor);
        if (!foundry.utils.isEmpty(updateData)) {
            console.log(`Migrating Actor entity ${actor.name}.`);
            await actor.update(updateData);
        }
        else {
            console.log(`No migration needed for Actor entity ${actor.name}.`);
        }
    }

    // Migrate Actors in Scenes
    for (let scene of game.scenes.contents) {
        //console.log(scene);
        let sceneUpdate = migrateSceneData(scene);
        if (!foundry.utils.isEmpty(sceneUpdate)) {
            console.log(`Migrating Scene ${scene.name}.`);
            await scene.update(sceneUpdate);
        }
        else {
            console.log(`No migration needed for Scene entity ${scene.name}.`);
        }
    }

    // Migrate Actors in the Compendiums
    for (let pack of game.packs) {
        /*if (pack.metadata.package != "world") {
            continue;
        }*/
    
        const packType = pack.metadata.type;
        if (!["Actor", "Scene"].includes(packType)) {
            continue;
        }
    
        const wasLocked = pack.locked;

        //console.log(pack);
        //console.log(pack.metadata.label);
        await pack.configure({ locked: false });
    
        await pack.migrate();
        const documents = await pack.getDocuments();
    
        for (let document of documents) {
            //console.log(document);
            let updateData = {};
            switch (packType) {
                case "Actor":
                    updateData = migrateActorData(document);
                    break;
                case "Scene":
                    updateData = migrateSceneData(document);
                    break;
            }
            if (foundry.utils.isEmpty(updateData)) {
                console.log(`No data to migrate in ${packType} entity ${document.name} in Compendium ${pack.collection}`);
                continue;
            }
            await document.update(updateData);
            //console.log(document);
            //console.log(updateData);
            console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
        }
    
        await pack.configure({ locked: wasLocked });
    }
    
    //console.log(game);
    game.settings.set('sfrpgbb', 'systemMigrationVersion', game.system.version);
    console.log("Needed data migration has been completed.")
    ui.notifications.info("World Data Migration is Complete.");
}


function migrateActorData(actor) {
    let updateData = {};

    if (actor.type != "npc") {
        return updateData;
    }

    //let updateTemp = {};
    //console.log("actor")
    //console.log(actor)
    //console.log(actor.system.attack?.bonus?.melee?.value)
    //console.log(actor.system.attack?.melee?.attackBonus)

    // Move attack and damage bonuses to new locations
    if (actor.system && actor.system.attack?.bonus?.melee?.value == null) {
        if (actor.system.attack?.melee && !(actor.system.attack?.melee?.attackBonus == null)) {
            updateData["system.attack.bonus.melee.value"] = actor.system.attack.melee.attackBonus;
        }
    }
    if (actor.system && actor.system.attack?.bonus?.ranged?.value == null) {
        if (actor.system.attack?.ranged && !(actor.system.attack?.ranged?.attackBonus == null)) {
            updateData["system.attack.bonus.ranged.value"] = actor.system.attack.ranged.attackBonus;
        }
    }
    if (actor.system && actor.system.attack?.bonus?.melee?.damageBonus == null) {
        if (actor.system.attack?.melee && !(actor.system.attack?.melee?.damageBonus == null)) {
            updateData["system.attack.bonus.melee.damageBonus"] = actor.system.attack.melee.damageBonus;
        }
    }
    if (actor.system && actor.system.attack?.bonus?.ranged?.damageBonus == null) {
        if (actor.system.attack?.ranged && !(actor.system.attack?.ranged?.damageBonus == null)) {
            updateData["system.attack.bonus.ranged.damageBonus"] = actor.system.attack.ranged.damageBonus;
        }
    }

    //console.log(updateTemp);
    //console.log("updateData")
    //console.log(updateData);
    //updateData.system = actor.system;
    return updateData;
}

function migrateSceneData(scene) {
    // We actually don't need this, I don't think, but I've left it in for weird corner cases
    // Any tokens in the scene won't have the new values that have been edited, so for these values they'll default back to the actor, which should be updated
    const tokens = scene.tokens.map(token => {
        const t = token.toJSON();
  
        if (!t.actorLink) {
            //console.log("t");
            //console.log(t);

            const actor = duplicate(t.actorData);
            actor.type = token.actor?.type;
            //console.log("actor");
            //console.log(actor);
            //console.log("token");
            //console.log(token);

            const update = migrateActorData(actor);
            mergeObject(t.actorData, update);
        }
        return t;
    });
  
    return { tokens };
}

/** @inheritDoc */
function measureDistances(segments, options={}) {
    if ( !options.gridSpaces ) return BaseGrid.prototype.measureDistances.call(this, segments, options);
    
    // Track the total number of diagonals
    let nDiagonal = 0;
    const rule = this.parent.diagonalRule;
    const d = canvas.dimensions;
    console.log("I'm running!");
    
    // Iterate over measured segments
    return segments.map(s => {
        let r = s.ray;
  
        // Determine the total distance traveled
        let nx = Math.abs(Math.ceil(r.dx / d.size));
        let ny = Math.abs(Math.ceil(r.dy / d.size));
    
        // Determine the number of straight and diagonal moves
        let nd = Math.min(nx, ny);
        let ns = Math.abs(ny - nx);
        nDiagonal += nd;
    
        // Starfinder Standard Movement
        if (rule === "5105") {
            let nd10 = Math.floor(nDiagonal / 2) - Math.floor((nDiagonal - nd) / 2);
            let spaces = (nd10 * 2) + (nd - nd10) + ns;
            return spaces * canvas.dimensions.distance;
        }
  
        // Euclidean Measurement
        else if (rule === "EUCL") {
            return Math.round(Math.hypot(nx, ny) * canvas.scene.grid.distance);
        }
        
        // 5e Standard, 5-5-5 movement
        else return (ns + nd) * canvas.scene.grid.distance;
    });
}
  
var canvas$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    measureDistances: measureDistances
});

/*
*
* Hooks
*
*/

Hooks.on("canvasInit", gameCanvas => {
    gameCanvas.grid.diagonalRule = game.settings.get("sfrpgbb", "diagonalMovement");
    console.log(gameCanvas);
    console.log(canvas);
    SquareGrid.prototype.measureDistances = canvas.measureDistances;
  });

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
});

Hooks.once("ready", function () {
    if (!game.user.isGM) {
        return;
    }

    const currentVersion = game.settings.get("sfrpgbb", "systemMigrationVersion");
    const MIGRATION_COMPATIBLE_VERSION = 0;
    const NEEDS_MIGRATION_VERSION = 1.2;
    // the or (||) statement from needsMigration and canMigrate may need to be removed in future releases
    const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
    const canMigrate = !currentVersion || isNewerVersion(currentVersion, MIGRATION_COMPATIBLE_VERSION);

    if (needsMigration) {
        console.log("We need to migrate to the new data template.");
        if (canMigrate) {
            const myDialog = new Dialog({
                title: "Migration Warning!",
                content: `This dialog box is to alert you that since the last update of the game system, significant changes were made to the data structure `
                            + `which require migration to function properly. <br><br> Just in case anything goes wrong, PLEASE MAKE A BACKUP COPY OF YOUR WORLD BEFORE MIGRATING!!!`,
                buttons: {
                    button1: {
                        label: "I have a backup. <br> Migrate my world data.",
                        callback: () => {
                            ui.notifications.info("World Data Migration Beginning...");
                            console.log("Migration Commencing");
                            migrateWorld();
                        }
                    },
                    button2: {
                        label: "Don't migrate data. <br> Use the world as-is. <br> (errors may occur)",
                        callback: () => {
                            ui.notifications.info("World Data Migration Cancelled.");
                            console.log("We need to migrate but the user has chosen not to.");
                        }
                    }
                }
            })
            myDialog.render(true);
        }
        else {
            console.log("The current system version is too old and we can't reliably migrate automatically :(");
        }
    }
    else {
        console.log("No need to migrate data today.");
    }
});