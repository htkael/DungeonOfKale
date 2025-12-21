import { Player } from "./entities.js"

export class Item {
  /**
  * @param {number} x
  * @param {number} y
  * @param {string} name
  * @param {string} type
  */
  constructor(x, y, name, type) {
    /** @type {number} */
    this.x = x
    /** @type {number} */
    this.y = y
    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.type = type
    /** @type {boolean} */
    this.isItem = true
  }

  /**
   * @param {Player} player
   * @param {Game} game
   */
  consume(player, game) {
    if (this.isConsumable) {
      game.addMessage(`${player?.name || "NPC"} used ${this.name}`)
    } else {
      game.addMessage(`Item cannot be consumed`)
    }
  }

  distanceTo(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
  }
}

export class Weapon extends Item {
  /**
  * @param {number} x
  * @param {number} y
  * @param {string} name
  */
  constructor(x, y, name, power = 1) {
    super(x, y, name, "Weapon")
    /** @type {boolean} */
    this.canAttack = true
    /** @type {number} */
    this.power = power
  }
}

export class Potion extends Item {
  /**
  * @param {number} x
  * @param {number} y
  * @param {string} name
  */
  constructor(x, y, name, power = 1) {
    super(x, y, name, "Potion")
    /** @type {number} */
    this.power = power
    /** @type {boolean} */
    this.isConsumable = true
  }

  /**
   * @param {Player} player
   * @param {Game} game
   */
  consume(player, game) {
    if (this.isConsumable) {
      player.health = Math.min(player.health += this.power, player.maxHealth)
      game.addMessage(`${player?.name || "NPC"} used ${this.name}`)
    } else {
      game.addMessage(`Item cannot be consumed`)
    }
  }
}
