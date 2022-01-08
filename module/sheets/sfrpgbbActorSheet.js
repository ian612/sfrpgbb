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
            config: CONFIG.sfrpgbb,

            //weapons: data.items.filter(function (item) { return item.type == "weapon"}),
            //armor: data.items.filter(function (item) { return item.type == "armor"})
        };

        return sheetData;
    }
}