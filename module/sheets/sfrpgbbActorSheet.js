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
            items: baseData.actor.data.items,
            config: CONFIG.sfrpgbb
        };
        return sheetData;
    }

    /** @override */
    activateListeners(html) {
    super.activateListeners(html);
  
    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
  
    // Add Inventory Item
    html.find('.item-create').click(this.actor.createEmbeddedDocuments("Item"));
  
    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });
  
    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
      li.slideUp(200, () => this.render(false));
    });
  }
}