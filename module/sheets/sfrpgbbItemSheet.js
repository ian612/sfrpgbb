export default class sfrpgbbItemSheet extends ItemSheet {
    get template() {
        return `systems/sfrpgbb/templates/sheets/${this.document.type}-sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 400,
            classes: ["sfrpgbb", "sheet", "item"]
        });
    }

    getData() {
        let sheetData = {
            owner: this.document.isOwner,
            editable: this.isEditable,
            item: this.document,
            system: this.document.system,
            config: CONFIG.sfrpgbb
        };
        return sheetData;
    }
}