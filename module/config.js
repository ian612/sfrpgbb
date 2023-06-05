export const sfrpgbb = {};

sfrpgbb.attackTypes = {
    none: "",
    meleeBasic: "sfrpgbb.attack.meleeBasic",
    meleeAdvanced: "sfrpgbb.attack.meleeAdvanced",
    smallArms: "sfrpgbb.attack.smallArms",
    longArms: "sfrpgbb.attack.longArms"
}

sfrpgbb.armorTypes = {
    none: "",
    light: "sfrpgbb.armor.light",
    heavy: "sfrpgbb.armor.heavy"
}

sfrpgbb.damageTypes = {
    none: "sfrpgbb.general.none",
    kinetic: "sfrpgbb.damage.kinetic",
    acid: "sfrpgbb.damage.acid",
    cold: "sfrpgbb.damage.cold",
    electricity: "sfrpgbb.damage.electricity",
    fire: "sfrpgbb.damage.fire",
    radiation: "sfrpgbb.damage.radiation",
    sonic: "sfrpgbb.damage.sonic"
}

sfrpgbb.equipmentTypes = {
    none: "",
    armor: "sfrpgbb.equipment.armor",
    armorUpgrade: "sfrpgbb.equipment.armorUpgrade",
    weapon: "sfrpgbb.equipment.weapon",
    grenade: "sfrpgbb.equipment.grenade",
    weaponFusion: "sfrpgbb.equipment.weaponFusion",
    gear: "sfrpgbb.equipment.gear"
}

sfrpgbb.saveTypes = {
    none: "",
    fortitude: "sfrpgbb.defence.fortitude",
    reflex: "sfrpgbb.defence.reflex",
    will: "sfrpgbb.defence.will"
}

sfrpgbb.spellBonusAbility = {
    none: "",
    int: "sfrpgbb.ability.int",
    wis: "sfrpgbb.ability.wis"
}

sfrpgbb.spellTypes = {
    targetsAllies: "sfrpgbb.spell.targetsAllies",
    targetsEnemies: "sfrpgbb.spell.targetsEnemies",
    utilitySpell: "sfrpgbb.spell.utilitySpell"
}

sfrpgbb.spellImages = {
    targetsAllies: "systems\\sfrpgbb\\images\\spell_types\\target-allies.svg",
    targetsEnemies: "systems\\sfrpgbb\\images\\spell_types\\target-enemies.svg",
    utilitySpell: "systems\\sfrpgbb\\images\\spell_types\\utility-spell.svg"
}

sfrpgbb.weaponSpecials = {
    none: "None",
    blast: "sfrpgbb.weapon.blast",
    boost: "sfrpgbb.weapon.boost",
    blastBoost: "sfrpgbb.weapon.blastBoost"
}

sfrpgbb.weaponCriticals = {
    none: "None",
    knockdown: "sfrpgbb.weapon.knockdown",
    stagger: "sfrpgbb.weapon.stagger"
}

sfrpgbb.races = {
    none: "",
    android: "sfrpgbb.character.races.android",
    human: "sfrpgbb.character.races.human",
    lashunta: "sfrpgbb.character.races.lashunta",
    shirren: "sfrpgbb.character.races.shirren",
    vesk: "sfrpgbb.character.races.vesk",
    ysoki: "sfrpgbb.character.races.ysoki"
}

sfrpgbb.themes = {
    none: "",
    bountyHunter: "sfrpgbb.character.themes.bountyHunter",
    icon: "sfrpgbb.character.themes.icon",
    mercenary: "sfrpgbb.character.themes.mercenary",
    outlaw: "sfrpgbb.character.themes.outlaw",
    priest: "sfrpgbb.character.themes.priest",
    spacefarer: "sfrpgbb.character.themes.spacefarer"
}

sfrpgbb.classes = {
    none: "",
    envoy: "sfrpgbb.character.classes.envoy",
    mechanic: "sfrpgbb.character.classes.mechanic",
    mystic: "sfrpgbb.character.classes.mystic",
    operative: "sfrpgbb.character.classes.operative",
    soldier: "sfrpgbb.character.classes.soldier",
    technomancer: "sfrpgbb.character.classes.technomancer"
}

sfrpgbb.casterClasses = {
    innate: "sfrpgbb.general.innate",
    mystic: "sfrpgbb.character.classes.mystic",
    technomancer: "sfrpgbb.character.classes.technomancer"
}

sfrpgbb.alignments = {
    none: "",
    lawfulGood: "sfrpgbb.character.alignments.lawfulGood",
    neutralGood: "sfrpgbb.character.alignments.neutralGood",
    chaoticGood: "sfrpgbb.character.alignments.chaoticGood",
    lawfulNeutral: "sfrpgbb.character.alignments.lawfulNeutral",
    trueNeutral: "sfrpgbb.character.alignments.trueNeutral",
    chaoticNeutral: "sfrpgbb.character.alignments.chaoticNeutral",
    lawfulEvil: "sfrpgbb.character.alignments.lawfulEvil",
    neutralEvil: "sfrpgbb.character.alignments.neutralEvil",
    chaoticEvil: "sfrpgbb.character.alignments.chaoticEvil"
}

sfrpgbb.skills = {
    athletics: "sfrpgbb.skill.athletics",
    culture: "sfrpgbb.skill.culture",
    interaction: "sfrpgbb.skill.interaction",
    medicine: "sfrpgbb.skill.medicine",
    mysticism: "sfrpgbb.skill.mysticism",
    perception: "sfrpgbb.skill.perception",
    science: "sfrpgbb.skill.science",
    stealth: "sfrpgbb.skill.stealth",
    survival: "sfrpgbb.skill.survival",
    technology: "sfrpgbb.skill.technology",
}

sfrpgbb.npcAbilityTypes = {
    defence: "sfrpgbb.defence.defence",
    energyResist: "sfrpgbb.defence.energyResist",
    immunity: "sfrpgbb.defence.immunity",
    movement: "sfrpgbb.movement.movement",
    offence: "sfrpgbb.attack.offence",
    other: "sfrpgbb.general.other",
    weakness: "sfrpgbb.defence.weakness"
}

sfrpgbb.statusEffects = [
    {id: "dead",        label: "sfrpgbb.conditions.dead",        icon: "icons/svg/skull.svg"},
    {id: "asleep",      label: "sfrpgbb.conditions.asleep",      icon: "icons/svg/sleep.svg"},
    {id: "flat-footed", label: "sfrpgbb.conditions.flatFooted",  icon: "icons/svg/paralysis.svg"},
    {id: "frightened",  label: "sfrpgbb.conditions.frightened",  icon: "icons/svg/terror.svg"},
    {id: "hampered",    label: "sfrpgbb.conditions.hampered",    icon: "icons/svg/trap.svg"},
    {id: "helpless",    label: "sfrpgbb.conditions.helpless",    icon: "icons/svg/silenced.svg"},
    {id: "impaired",    label: "sfrpgbb.conditions.impaired",    icon: "icons/svg/daze.svg"},
    {id: "off-kilter",  label: "sfrpgbb.conditions.offKilter",   icon: "icons/svg/falling.svg"},
    {id: "staggered",   label: "sfrpgbb.conditions.staggered",   icon: "icons/svg/stoned.svg"},
    {id: "unconscious", label: "sfrpgbb.conditions.unconscious", icon: "icons/svg/unconscious.svg"}
]