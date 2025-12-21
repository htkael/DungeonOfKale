import { Game } from "./game.js"
import { GameMap } from "./gameMap.js"
import { Item, Weapon } from "./items.js"

export class Entity {
  /**
  * @param {number} x
  * @param {number} y
  * @param {number} maxHealth
  * @param {number} health
  */
  constructor(x, y, maxHealth = 0, health = 0) {
    /** @type {number} */
    this.x = x
    /** @type {number} */
    this.y = y
    /** @type{number} */
    this.maxHealth = maxHealth
    /** @type{number} */
    this.health = health
  }

  /**
  * @param {number} newX
  * @param {number} newY
  * @param {GameMap} map
  * @returns {boolean}
  */
  moveTo(newX, newY, map) {
    if (map.canMoveTo(newX, newY)) {
      this.x = newX
      this.y = newY
      return true
    } else {
      return false
    }
  }

  /**
  * @param {Entity} other
  * @returns {number}
  */
  distanceTo(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
  }

  /**
  * @param {number} amount
  * @param {Game} game
  */
  takeDamage(amount, game) {
    this.health -= amount
    if (this.isPlayer && this.health <= 0) {
      game.setState('dead')
    }
    if (!this.isPlayer && this.health <= 0) {
      const gameIndex = game.npcs.indexOf(this)
      const mapIndex = game.map.entities.indexOf(this)

      game.npcs.splice(gameIndex, 1)
      game.map.entities.splice(mapIndex, 1)
    }
  }

  /**
  * @returns {boolean}
  */
  isAlive() {
    return this.health > 0
  }

  /**
   * @param {Entity} target
   * @param {Game} game
   */
  attack(target, game) {
    if (this.distanceTo(target) <= 1) {
      game.addMessage(`Enemy attacked for 5 damage!`)
      target.takeDamage(5, game)
      return true
    } else {
      game.addMessage("Target is too far away!")
      return false
    }
  }
}

export class Player extends Entity {
  /**
  * @param {number} x
  * @param {number} y
  * @param {string} name
  * @param {number} health
  */
  constructor(x, y, name, health = 100) {
    super(x, y, health, health)
    /** @type {string} */
    this.name = name
    /** @type {Item[]} */
    this.inventory = []
    /** @type {boolean} */
    this.isPlayer = true
    /** @type {number} */
    this.strength = 1
    /** @type {Weapon} */
    this.selectedWeapon = {
      name: 'fist',
      power: 1
    }
    /** @type{string} */
    this.direction = 'north'
    /** @type{string} */
    this.state = 'playing'
  }

  /**
  * @param{GameMap} map
  */
  moveNorth(map) {
    this.moveTo(this.x, this.y - 1, map)
    this.direction = 'north'
    this.state = 'moving'
  }

  /**
  * @param{GameMap} map
  */
  moveSouth(map) {
    this.moveTo(this.x, this.y + 1, map)
    this.direction = 'south'
    this.state = 'moving'
  }

  /**
  * @param{GameMap} map
  */
  moveWest(map) {
    this.moveTo(this.x - 1, this.y, map)
    this.direction = 'west'
    this.state = 'moving'
  }

  /**
  * @param{GameMap} map
  */
  moveEast(map) {
    this.moveTo(this.x + 1, this.y, map)
    this.direction = 'east'
    this.state = 'moving'
  }

  /**
  * @param {Entity} target
  * @param {Game} game
  */
  attack(target, game) {
    if (this.distanceTo(target) <= 1) {
      const damage = this.selectedWeapon.power * this.strength
      game.addMessage(`${this.name} attacked for ${damage} damage!`)
      target.takeDamage(damage, game)
      this.state = 'attacking'
    } else {
      game.addMessage("Target is too far away!")
    }
  }

  /**
   * @param {Item} item
   * @param {Game} game
   */
  pickUp(item, game) {
    if (this.distanceTo(item) <= 1) {
      this.inventory.push(item)
      const gameIndex = game.items.indexOf(item)
      const mapIndex = game.map.items.indexOf(item)
      game.items.splice(gameIndex, 1)
      game.map.items.splice(mapIndex, 1)
      this.state = 'pickingUp'
      game.addMessage(`${this.name} picked up ${item.name} (${item.type})!`)
    } else {
      game.addMessage("Cannot pick up item, it is too far away.")
    }
  }

  /**
   * @param {Game} game
   * @param {Item} item
   */
  useItem(item, game) {
    if (item?.isConsumable) {
      item.consume(this, game)
      const index = this.inventory.indexOf(item)
      this.inventory.splice(index, 1)
    } else {
      game.addMessage(`Cannot use ${item.name}. It is not consumable!`)
    }
  }

  /**
   * @param {Weapon} weapon
   * @param {Game} game
   */
  equipWeapon(weapon, game) {
    if (!weapon.canAttack) {
      game.addMessage(`Cannot equip ${weapon.name}. It is not a weapon!`)
      return
    }

    game.addMessage(`${this.name} equipped ${weapon.name}`)
    this.selectedWeapon = weapon
  }

  reset() {
    this.x = 18
    this.y = 18
    this.direction = 'north'
    this.health = 100
    this.maxHealth = 100
    this.inventory = []
    this.strength = 1
    this.selectedWeapon = {
      name: 'fist',
      power: 1
    }
  }
}

export class NPC extends Entity {
  /**
  * @param {number} x
  * @param {number} y
  * @param {string} type
  * @param {number} health
  * @param {boolean} hostile
  * @param {number} power
  */
  constructor(x, y, type, health = 20, hostile = false, power = 1) {
    super(x, y, health, health)
    /** @type{string}*/
    this.type = type
    /** @type{Player}*/
    this.target = null
    /** @type{string}*/
    this.state = 'idle'
    /** @type{boolean}*/
    this.hostile = hostile
    /** @type{number}*/
    this.power = power
  }

  /**
   * @param {Player} player
   * @returns {boolean}
  */
  canSeePlayer(player) {
    const distance = this.distanceTo(player)
    return distance < 10
  }

  /**
   * @param {Game} game
  */
  makeDecision(game) {
    const player = game.player
    const distance = this.distanceTo(player)
    if (distance < 2) {
      this.state = 'hunting'
      this.attack(player, game)
    } else if (this.health < 4) {
      this.state = 'fleeing'
      this.fleeFrom(player, game.map)
    } else if (distance < 10) {
      this.state = 'hunting'
      this.moveTowards(player, game.map)
    } else {
      this.state = 'idle'
      this.wander(game.map)
    }
  }

  /**
   * @param {Entity} target
   * @param {Game} game
   */
  attack(target, game) {
    if (this.distanceTo(target) <= 1) {
      const damage = 2 * this.power
      game.addMessage(`Enemy attacked for 5 damage!`)
      target.takeDamage(damage, game)
      return true
    } else {
      game.addMessage("Target is too far away!")
      return false
    }
  }

  /**
   * @param {Entity} target
   * @param {GameMap} map
  */
  moveTowards(target, map) {
    const dx = Math.sign(target.x - this.x)
    const dy = Math.sign(target.y - this.y)

    if (Math.random() > 0.5) {
      this.moveTo(this.x + dx, this.y, map)
    } else {
      this.moveTo(this.x, this.y + dy, map)
    }
  }

  /**
   * @param {Player} player
   * @param {GameMap} map
   */
  fleeFrom(player, map) {
    const dx = Math.sign(player.x - this.x)
    const dy = Math.sign(player.y - this.y)

    if (Math.random() > 0.5) {
      this.moveTo(this.x - dx, this.y, map)
    } else {
      this.moveTo(this.x, this.y - dy, map)
    }
  }

  /**
  * @param {GameMap} map
  */
  wander(map) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)]
    this.moveTo(this.x + dx, this.y + dy, map)
  }
}
