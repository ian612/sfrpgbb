export default class sfrpgbbActorSheet extends ActorSheet {
    get template() {
        return `systems/sfrpgbb/templates/sheets/${this.document.type}-sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 850,
            height: 875,
            classes: ["sfrpgbb", "sheet", "character", "npc"]
        });
    }

    getData() {
        let sheetData = {
            owner: this.document.isOwner,
            editable: this.isEditable,
            actor: this.document,
            system: this.document.system,
            items: this.document.items,
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
        //html.find('.item-create').click(ev => this._onItemCreate(ev));;

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

        // Roll skill checks
        html.find('.btn-roll').click(this._rollstuff.bind(this));
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
        if(item.system.type == "npcAbility") {
            return item.update({ "system.value": quantity });
        }
        else{
            return item.update({ "system.quantity": quantity });
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
        //console.log(equipped)
        return item.update({ "system.equipped": equipped });
    }

    /**
     * Roll some dice
     * @param {Event} event        The triggering click event.
     * @returns {Promise<Item5e>}  Updated item.
     * @private
     */
    async _rollstuff(event) {
        event.preventDefault();
        const tmp = this.object.system.skills.athletics.value;
        console.log(tmp);

        // Build the roll
        let r = new Roll("1d20 + @mod", {mod: tmp});

        // The parsed terms of the roll formula
        console.log(r.terms);    // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
        
        // Execute the roll
        await r.evaluate();

        // The resulting equation after it was rolled
        console.log(r.result);   // 16 + 2 + 4

        // The total resulting from the roll
        console.log(r.total);    // 22
    }
}