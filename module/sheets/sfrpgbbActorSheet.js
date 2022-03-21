export default class sfrpgbbActorSheet extends ActorSheet {
    get template() {
        return `systems/sfrpgbb/templates/sheets/${this.actor.data.type}-sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 850,
            height: 875,
            classes: ["sfrpgbb", "sheet", "character", "npc"]
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
        // html.find('.item-create').click(ev => this._onItemCreate(ev));;

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

        // Update Inventory Item Quantity
        html.find(".item-quantity input").click(ev => ev.target.select()).change(this._onQuantityChange.bind(this));

        // Update Inventory Item Equipped Status
        html.find(".item-equipped input").click(ev => ev.target.select()).change(this._onEquippedChange.bind(this));
    }

    /**
     * Change the quantity of an Owned Item within the Actor.
     * @param {Event} event        The triggering click event.
     * @returns {Promise<Item5e>}  Updated item.
     * @private
     */
    async _onQuantityChange(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const quantity = parseInt(event.target.value);
        event.target.value = quantity;
        if(item.data.type == "npcAbility") {
            return item.update({ "data.value": quantity });
        }
        else{
            return item.update({ "data.quantity": quantity });
        }
    }

    /**
     * Change the equipped status of an Owned Item within the Actor.
     * @param {Event} event        The triggering click event.
     * @returns {Promise<Item5e>}  Updated item.
     * @private
     */
     async _onEquippedChange(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const equipped = event.target.checked;
        event.target.value = equipped;
        console.log(equipped)
        return item.update({ "data.equipped": equipped });
    }
}