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
});