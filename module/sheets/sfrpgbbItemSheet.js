export default class sfrpgbbItemSheet extends ItemSheet {
    get template() {
        return `systems/sfrpgbb/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.sfrpgbb;

        return data;
    }
}