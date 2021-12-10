export default class sfrpgbbCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/sfrpgbb/templates/sheets/character-sheet.hbs",
            classes: ["sfrpgbb", "sheet", "character"]
        });
    }

    getData() {
        let baseData = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.actor.isEditable,
            item: baseData.actor,
            data: baseData.actor.data.data,
            config: CONFIG.sfrpgbb,
            //weapons: data.items.filter(function (item) { return item.type == "weapon"}),
            //armor: data.items.filter(function (item) { return item.type == "armor"})
        };

        return sheetData;
    }
}