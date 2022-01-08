export default class sfrpgbbActorSheet extends ActorSheet {
    get template() {
        return `systems/sfrpgbb/templates/sheets/${this.actor.data.type}-sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 850,
            height: 875,
            classes: ["sfrpgbb", "sheet", "character"]
        });
    }

    getData() {
        const baseData = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.actor.isEditable,
            actor: baseData.actor,
            data: baseData.actor.data.data,
            config: CONFIG.sfrpgbb
        };
        if (sheetData.actor.items) {
            sheetData.data.weapons = sheetData.actor.items.filter(function (item) { return item.type == "weapon"});
        } else {
            sheetData.data.weapons = [];
        }
        if (sheetData.actor.items) {
            sheetData.data.armor = sheetData.actor.items.filter(function (item) { return item.type == "armor"});
        } else {
            sheetData.data.armor = [];
        }

        return sheetData;
    }
}