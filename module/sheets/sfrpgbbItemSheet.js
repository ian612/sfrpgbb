export default class sfrpgbbItemSheet extends ItemSheet {
    get template() {
        return `systems/sfrpgbb/templates/sheets/${this.item.data.type}-sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 400,
            classes: ["sfrpgbb", "sheet", "item"]
        });
    }

    getData() {
        const baseData = super.getData();
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.item.isEditable,
            item: baseData.item,
            data: baseData.item.data.data,
            config: CONFIG.sfrpgbb
        };
        //Debugging code
        console.log(sheetData.data);

        return sheetData;
    }
}