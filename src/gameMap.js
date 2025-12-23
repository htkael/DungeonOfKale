import { Item } from "./items.js"
import { NPC } from "./entities/NPC.js"
import { Player } from "./entities/Player.js"
import { GameScene } from "./scenes/GameScene.js"

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
    /** @type {Player|NPC[]} */
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
   * @returns {Player|NPC} 
  */
  getEntityAt(x, y) {
    return this.entities.find(e => e.gridX === x && e.gridY === y)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Item}
  */
  getItemAt(x, y) {
    return this.items.find(e => e.gridX === x && e.gridY === y)
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
    const entity = this.getEntityAt(x, y)
    return entity
  }

  /**
   * @param {number} amount
   * @param {GameScene} game
  */
  receiveAttack(coords, amount, game) {
    for (let i = 0; i < coords.length; i++) {
      /** @type {Player|NPC}*/
      const attacked = this.getEntityAt(coords[i].x, coords[i].y)
      if (attacked && typeof attacked?.takeDamage === 'function') {
        attacked.takeDamage(amount, game)
      }
    }
  }

  /**
  * @param {Player} player
  */
  pickUpItem(coords, player) {
    const item = this.getItemAt(coords.x, coords.y)
    if (item) {
      player.inventory.push(item)
      const index = this.items.indexOf(item)
      this.items.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
