import blank from "./assets/blank.png";
import craft_arrow from "./assets/craft_arrow.png";
import logo from "./assets/logo.png";
import movement from "./assets/movement.png";
import build from "./assets/build.png";
import error from "./assets/error.png";
import no_tick from "./assets/no-tick.png";
import inventory from "./assets/inventory.png";
import movement_cardinal from "./assets/movement-cardinal.png";
import ok_tick from "./assets/ok-tick.png";
import craft from "./assets/craft.png";
import movement_diagonal from "./assets/movement-diagonal.png";
import options from "./assets/options.png";

import beach from "./assets/map/beach.png";
import coal from "./assets/map/coal.png";
import copper from "./assets/map/copper.png";
import deep_water from "./assets/map/deep_water.png";
import deer from "./assets/map/deer.png";
import desert from "./assets/map/desert.png";
import field from "./assets/map/field.png";
import fish from "./assets/map/fish.png";
import forest from "./assets/map/forest.png";
import gold from "./assets/map/gold.png";
import hills from "./assets/map/hills.png";
import iron from "./assets/map/iron.png";
import knight from "./assets/map/knight.png";
import knightSleeping from "./assets/map/knightSleeping.png";
import mountain from "./assets/map/mountain.png";
import oil from "./assets/map/oil.png";
import plain from "./assets/map/plain.png";
import salt from "./assets/map/salt.png";
import shallow_water from "./assets/map/shallow_water.png";
import tin from "./assets/map/tin.png";

import coal_item from "./assets/items/coal.png";
import cooked_meat from "./assets/items/cooked_meat.png";
import copper_bar from "./assets/items/copper_bar.png";
import copper_helmet from "./assets/items/copper_helmet.png";
import copper_ore from "./assets/items/copper_ore.png";
import glass from "./assets/items/glass.png";
import gold_bar from "./assets/items/gold_bar.png";
import gold_necklace from "./assets/items/gold_necklace.png";
import gold_ore from "./assets/items/gold_ore.png";
import iron_bar from "./assets/items/iron_bar.png";
import iron_ore from "./assets/items/iron_ore.png";
import iron_sword from "./assets/items/iron_sword.png";
import meat from "./assets/items/meat.png";
import oil_item from "./assets/items/oil.png";
import salt_item from "./assets/items/salt.png";
import sand from "./assets/items/sand.png";
import stone from "./assets/items/stone.png";
import tin_ore from "./assets/items/tin_ore.png";
import wood from "./assets/items/wood.png";
import wooden_shield from "./assets/items/wooden_shield.png";

import boots from "./assets/items/placeholder/boots.png";
import cape from "./assets/items/placeholder/cape.png";
import chest from "./assets/items/placeholder/chest.png";
import gauntlets from "./assets/items/placeholder/gauntlets.png";
import head from "./assets/items/placeholder/head.png";
import legs from "./assets/items/placeholder/legs.png";
import mainhand from "./assets/items/placeholder/mainhand.png";
import offhand from "./assets/items/placeholder/offhand.png";
import pauldrons from "./assets/items/placeholder/pauldrons.png";
import ring from "./assets/items/placeholder/ring.png";
import shirt from "./assets/items/placeholder/shirt.png";
import trinket from "./assets/items/placeholder/trinket.png";

import fire from "./assets/buildings/fire.png";
import fireplace from "./assets/buildings/fireplace.png";
import forge from "./assets/buildings/forge.png";
import foundry from "./assets/buildings/foundry.png";
import sand_castle1 from "./assets/buildings/sand_castle1.png";
import sand_castle2 from "./assets/buildings/sand_castle2.png";
import sand_castle3 from "./assets/buildings/sand_castle3.png";
import smithy from "./assets/buildings/smithy.png";
import wheat_field from "./assets/buildings/wheat_field.png";

const IMAGES: any = {
  blank,
  craft_arrow,
  logo,
  movement,
  build,
  error,
  no_tick,
  inventory,
  movement_cardinal,
  ok_tick,
  craft,
  movement_diagonal,
  options,
  map: {
    beach,
    coal,
    copper,
    deep_water,
    deer,
    desert,
    field,
    fish,
    forest,
    gold,
    hills,
    iron,
    knight,
    knightSleeping,
    mountain,
    oil,
    plain,
    salt,
    shallow_water,
    tin,
  },
  items: {
    placeholder: {
      boots,
      cape,
      chest,
      gauntlets,
      head,
      legs,
      mainhand,
      offhand,
      pauldrons,
      ring,
      shirt,
      trinket,
    },
    blank,
    coal: coal_item,
    cooked_meat,
    copper_bar,
    copper_helmet,
    copper_ore,
    glass,
    gold_bar,
    gold_necklace,
    gold_ore,
    iron_bar,
    iron_ore,
    iron_sword,
    meat,
    oil: oil_item,
    salt: salt_item,
    sand,
    stone,
    tin_ore,
    wood,
    wooden_shield,
  },
  buildings: {
    fire,
    fireplace,
    forge,
    foundry,
    sand_castle1,
    sand_castle2,
    sand_castle3,
    smithy,
    wheat_field,
  },
};

export type ImageType = "map" | "buildings" | "items" | "placeholder" | "base";
export function getImage(imageName: string, type: ImageType): any {
  let field = error;

  switch (type) {
    case "base":
      field = IMAGES[imageName];
      break;
    case "buildings":
      field = IMAGES.buildings[imageName];
      break;
    case "items":
      field = IMAGES.items[imageName];
      break;
    case "placeholder":
      field = IMAGES.items.placeholder[imageName];
      break;
    case "map":
      field = IMAGES.map[imageName];
      break;
  }
  return field;
}
