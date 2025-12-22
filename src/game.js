import { GameMap } from "./gameMap.js"
import { Entity, NPC, Player } from "./entities.js"
import { NPCIcons, PlayerIcons } from "./icons.js"
import { Item, Potion, Weapon } from "./items.js"
import { baseItems } from "./storage.js"

export class Game {
  constructor() {
    /** @type{GameMap}*/
    this.map = new GameMap(50, 30)
    /** @type{Player} */
    this.player = new Player(2, 2, "Hunter")
    /** @type{NPC[]} */
    this.npcs = []
    /** @type{boolean} */
    this.turnBased = true
    /** @type{Entity} */
    this.targetedEnemy = null
    /** @type{Item} */
    this.targetedItem = null
    /** @type{string[]} */
    this.messages = []
    /** @type {Item[]} */
    this.items = []

    this.state = 'start'

    this.map.entities.push(this.player)

    this.floor = 1
  }

  handlePlayerAction(action) {
    switch (action) {
      case "north": this.player.moveNorth(this.map); break
      case "south": this.player.moveSouth(this.map); break
      case "west": this.player.moveWest(this.map); break
      case "east": this.player.moveEast(this.map); break
      case "attack":
        this.findNearestEnemy()
        if (this.targetedEnemy) {
          this.player.attack(this.targetedEnemy, this)
        } else {
          this.addMessage("No enemy target found!")
        }
        break
      case "pickUp":
        this.findNearestItem()
        if (this.targetedItem) {
          this.player.pickUp(this.targetedItem, this)
        } else {
          this.addMessage("No item found!")
        }
        break
      case "use":
        this.player.state = 'using'
        break
      case "equip":
        this.player.state = 'equipping'
        break
    }

    if (this.player.state === 'equipping') {
      const options = this.player.inventory
      const selectedWeapon = options[action]
      if (selectedWeapon) {
        this.player.equipWeapon(selectedWeapon, this)
      }
    }

    if (this.player.state === 'using') {
      const options = this.player.inventory
      const selectedPotion = options[action]
      if (selectedPotion) {
        this.player.useItem(selectedPotion, this)
        this.player.state = 'idle'
      } else if (action && !isNaN(action)) {
        this.addMessage(`action: ${action}`)
        this.addMessage(`Potion does not exist at that positon!`)
      }
    }

    if (this.npcs.length <= 0) {
      this.state = 'cleared'
      this.messages = []
      return
    }



    if (action !== 'use' && action !== 'equip' && isNaN(action)) {
      this.updateNPCs()
      this.checkCollisions()
    }
  }

  /**
  * @param {number} x
  * @param {number} y
  * @param {string} type
  * @param {number} health
  * @param {boolean} hostile
  * @param {number} level
  */
  spawnNpc(x, y, type, health, hostile, level) {
    if (this.map.hasObstacle(x, y)) {
      this.addMessage("Obstacle at current position, cannot create npc here!")
      return false
    } else {
      const newNpc = new NPC(x, y, type, health, hostile, level)
      this.npcs.push(newNpc)
      this.map.entities.push(newNpc)
    }
  }

  /**
  * @param {number} count
  * @param {number} level
  */
  spawnRandomNpcs(count, level) {
    const type = "enemy"
    const health = Math.max(10, Math.random() * level * 10)
    const hostile = true

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * this.map.width)
      const y = Math.floor(Math.random() * this.map.height)
      this.spawnNpc(x, y, type, health, hostile, level)
    }
  }

  /**
   * @param {Item} item
   */
  addItem(item) {
    if (this.map.hasObstacle(item.x, item.y)) {
      this.addMessage("Obstacle at current position, cannot create item here!")
      return false
    } else {
      this.items.push(item)
      this.map.items.push(item)
    }
  }

  /**
  * @param {number} count
  * @param {number} level
  */
  spawnRandomItems(count, level) {
    for (let i = 0; i < count; i++) {
      let newItem
      const x = Math.floor(Math.random() * this.map.width)
      const y = Math.floor(Math.random() * this.map.height)
      const selection = baseItems[Math.floor(Math.random() * baseItems.length)]

      if (selection.type === 'potion') {
        newItem = new Potion(x, y, selection.name, selection.power * level)
      } else if (selection.type === 'weapon') {
        newItem = new Weapon(x, y, selection.name, selection.power * level)
      }
      this.addItem(newItem)
    }
  }

  findNearestEnemy() {
    this.targetedEnemy = null
    this.npcs.filter(npc => npc.isAlive()).forEach(npc => {
      if (this.targetedEnemy === null) {
        this.targetedEnemy = npc
      } else if (npc.distanceTo(this.player) < this.targetedEnemy.distanceTo(this.player)) {
        this.targetedEnemy = npc
      }
    })
  }

  findNearestItem() {
    this.targetedItem = null
    this.items.forEach(item => {
      if (this.targetedItem === null) {
        this.targetedItem = item
      } else if (item.distanceTo(this.player) < this.targetedItem.distanceTo(this.player)) {
        this.targetedItem = item
      }
    })
  }

  updateNPCs() {
    this.npcs.filter(n => n.isAlive()).forEach((npc) => {
      npc.makeDecision(this)
    })
  }

  checkCollisions() {
    const aliveNpcs = this.npcs.filter(npc => npc.isAlive())
    aliveNpcs.forEach(npc => {
      if (this.player.x === npc.x && this.player.y === npc.y) {
        this.handleCollision(this.player, npc)
      }
    })

    for (let i = 0; i < aliveNpcs.length; i++) {
      for (let j = i + 1; j < aliveNpcs.length; j++) {
        if (aliveNpcs[i].x === aliveNpcs[j].x && aliveNpcs[i].y === aliveNpcs[j].y) {
          this.handleCollision(aliveNpcs[i], aliveNpcs[j])
        }
      }
    }
  }

  /**
  * @param {Entity} entity1
  * @param {Entity} entity2
  */
  handleCollision(entity1, entity2) {
    if (entity1.isPlayer && entity2.hostile) {
      entity2.attack(entity1, this)
    }
  }

  /**
  * @param {string} msg
  */
  addMessage(msg) {
    this.messages.push(msg)
  }

  /**
  * @param {string} state
  */
  setState(state) {
    this.state = state
  }


  render() {
    console.clear()

    if (this.state === "start") {
      console.log("Welcome to Simple Dungeon!")
      console.log("Press S to start, Q to quit")
    } else if (this.state === 'play') {
      for (let y = 0; y < this.map.height; y++) {
        let row = ''
        for (let x = 0; x < this.map.width; x++) {
          if (this.player.x === x && this.player.y === y) {
            row += `${PlayerIcons[this.player.direction] || "@"}`
          } else {
            const npc = this.npcs.filter(n => n.isAlive()).find(n => n.x === x && n.y === y)
            const item = this.items.find(i => i.x === x && i.y === y)
            if (npc && npc.isAlive()) {
              row += `${NPCIcons[npc.state] || "E"}`
            } else if (item) {
              row += `i`
            } else {
              row += '.'
            }
          }
        }
        console.log(row)
      }


      console.log(`Level ${this.floor}`)
      console.log("WASD to move, SPACE to attack, E to pick up item, U to use first item in inventory, L to equip a weapon, Q to quit")
      console.log("")
      console.log(`\nHP: ${this.player.health} | Position: (${this.player.x}, ${this.player.y})`)
      console.log("")
      console.log(`Inventory:`)
      this.player.inventory.map((e, i) => {
        console.log(`${i}. ${e?.name} (${e?.type})`)
      })

      console.log("")
      console.log(`Selected weapon: ${this.player.selectedWeapon.name}. Power: ${this.player.selectedWeapon.power}`)
      console.log("")
      if (this.player.state === 'equipping') {
        console.log(`Type the number of the weapon you would like to equip:`)
        console.log("")
      }
      if (this.player.state === 'using') {
        console.log(`Type the number of the potion you would like to use:`)
        console.log("")
      }
    } else if (this.state === 'cleared') {
      console.log("Floor Beaten! Press G to continue to the next floor or Q to quit")
    } else if (!this.player.isAlive() || this.state === 'dead') {
      console.log("PLAYER HAS DIED! Press 'R' to restart or Q to quit")
    }



    if (this.messages.length > 5) {
      this.messages.slice(0, 5)
      this.messages.shift()
    }

    this.messages.forEach(msg => {
      console.log(msg)
    })
  }
  /**
   * @param {number} count
   * @param {number} count2
   */
  start() {
    const count = Math.max(Math.floor(Math.random() * Math.max(this.floor, 2) * 1.5), 1)
    const count2 = Math.max(Math.floor(Math.random() * Math.max(this.floor, 2) * 1.5), 1)
    this.addMessage(`counts: 1: ${count}, 2: ${count2}`)

    this.spawnRandomNpcs(count, this.floor)
    this.spawnRandomItems(count2, this.floor)
    this.render()
  }

  reset() {
    this.floor = 1

    const count = Math.max(Math.floor(Math.random() * Math.max(this.floor, 2) * 1.5), 1)
    const count2 = Math.max(Math.floor(Math.random() * Math.max(this.floor, 2) * 1.5), 1)

    const width = Math.max(10, Math.floor(Math.random() * 100))
    const height = Math.max(10, Math.floor(Math.random() * 40))

    this.state === 'play'
    this.npcs = []
    this.map.entities = []
    this.items = []
    this.map.items = []
    this.map = new GameMap(width, height)
    this.targetedEnemy = null
    this.targetedItem = null
    this.messages = []
    this.player.x = 2
    this.player.y = 2

    this.spawnRandomNpcs(count, this.floor)
    this.spawnRandomItems(count2, this.floor)
    this.player.reset()
  }

  levelUp() {
    this.floor += 1
    const count = Math.max(Math.floor(Math.random() * Math.max(this.floor, 2) * 1.5), 1)
    const count2 = Math.max(Math.floor(Math.random() * Math.max(this.floor, 2) * 1.5), 1)

    const width = Math.max(10, Math.floor(Math.random() * 100))
    const height = Math.max(10, Math.floor(Math.random() * 40))

    this.player.x = 2
    this.player.y = 2
    this.player.strength += 0.2

    this.npcs = []
    this.map.entities = []
    this.items = []
    this.map.items = []
    this.map = new GameMap(width, height)
    this.targetedEnemy = null
    this.targetedItem = null
    this.messages = []

    this.spawnRandomNpcs(count, this.floor)
    this.spawnRandomItems(count2, this.floor)

    this.state = 'play'
    this.addMessage(`this floor: ${this.floor}`)
    this.addMessage(`count: ${count}, count2: ${count2}`)
    this.addMessage(`width: ${width}, height: ${height}`)
  }

}
