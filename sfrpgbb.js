import {sfrpgbb} from "./module/config.js";
import sfrpgbbItemSheet from "./module/sheets/sfrpgbbItemSheet.js";
import sfrpgbbActorSheet from "./module/sheets/sfrpgbbActorSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/sfrpgbb/templates/partials/character-abilities.hbs",
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function() {
    console.log("sfrpgbb | Initializing Starfinder Beginner Box System");

    CONFIG.sfrpgbb = sfrpgbb;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sfrpgbb", sfrpgbbItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("sfrpgbb", sfrpgbbActorSheet, {makeDefault: true});

    preloadHandlebarsTemplates();

    Handlebars.registerHelper("times", function (n, content){
        let result = "";
        for (let i = 0; i < n; ++i) {
            result += content.fn(i);
        }

        return result;
    });
});