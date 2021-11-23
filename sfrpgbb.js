import {sfrpgbb} from "./module/config.js";
import sfrpgbbItemSheet from "./module/sheets/sfrpgbbItemSheet.js";

Hooks.once("init", function() {
    console.log("sfrpgbb | Initializing Starfinder Beginner Box System");

    CONFIG.sfrpgbb = sfrpgbb;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sfrpgbb", sfrpgbbItemSheet, {makeDefault: true});
});