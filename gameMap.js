import { Entity } from "./entities.js"
import { Item } from "./items.js"

export class GameMap {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    /** @type {number} */
    this.width = width
    /** @type {number} */
    this.height = height
    /** @type {Entity[]} */
    this.entities = []
    /** @type {Item[]} */
    this.items = []
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
  */
  isValidPosition(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Entity[]}
  */
  getEntitiesAt(x, y) {
    return this.entities.filter(e => e.x === x && e.y === y)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Item[]}
  */
  getItemsAt(x, y) {
    return this.items.filter(e => e.x === x && e.y === y)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
  */
  canMoveTo(x, y) {
    return this.isValidPosition(x, y) && !this.hasObstacle(x, y)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
  */
  hasObstacle(x, y) {
    const entities = this.getEntitiesAt(x, y)
    const items = this.getItemsAt(x, y)
    const npcs = entities.filter(npc => npc.isAlive())
    return npcs.length > 0 || items.length > 0
  }
}
