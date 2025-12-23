import Phaser from "phaser";
import { Player } from "../entities/Player";
import { GameMap } from "../gameMap";
import { NPC } from "../entities/NPC.js";
import { HealthBar } from "../ui/HealthBar.js";
import { MessageLog } from "../ui/MessageLog.js"

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
    /** @type {Player}*/
    this.player = null
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    this.cursors = null
    /** @type {number}*/
    this.TILE_SIZE = 32
    /** @type {number}*/
    this.GRID_WIDTH = 25
    /** @type {number}*/
    this.GRID_HEIGHT = 19
    /** @type {number}*/
    this.floor = 1
    /** @type {string} */
    this.state = 'play'
    /** @type {NPC[]} */
    this.npcs = []
    /** @type {boolean} */
    this.isTurnInProgress = false
    /** @type {number} */
    this.currentTurnIndex = 0

  }

  preload() {
    this.load.spritesheet('player-idle', 'player/PNG/Sword/With_shadow/Sword_Idle_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('player-walk', 'player/PNG/Sword/With_shadow/Sword_Walk_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('player-attack', 'player/PNG/Sword/With_shadow/Sword_attack_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('player-hurt', 'player/PNG/Sword/With_shadow/Sword_Hurt_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('player-death', 'player/PNG/Sword/With_shadow/Sword_Death_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('slime-idle', 'enemies/Slime1/With_shadow/Slime1_Idle_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('slime-walk', 'enemies/Slime1/With_shadow/Slime1_Walk_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('slime-attack', 'enemies/Slime1/With_shadow/Slime1_Attack_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('slime-hurt', 'enemies/Slime1/With_shadow/Slime1_Hurt_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('slime-death', 'enemies/Slime1/With_shadow/Slime1_Death_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.image('ground', '../../public/tiles/Tiles/FieldsTile_01.png')
  }

  create() {
    this.loadGround()
    this.player = new Player(this, 12, 9, "Hunter", 100)
    this.healthBar = new HealthBar(this, 10, 10, 100, 25, this.player.health, this.player.maxHealth)
    this.messageLog = new MessageLog(this, 10, 450, 5)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys({
      'W': Phaser.Input.Keyboard.KeyCodes.W,
      'S': Phaser.Input.Keyboard.KeyCodes.S,
      'A': Phaser.Input.Keyboard.KeyCodes.A,
      'D': Phaser.Input.Keyboard.KeyCodes.D
    })
    this.npcs.push(new NPC(this, 12, 2, "Slime", 10, true, 2, 'slime-idle'))
    this.npcs.push(new NPC(this, 20, 2, "Slime", 10, true, 2, 'slime-idle'))
    this.npcs.push(new NPC(this, 5, 2, "Slime", 10, true, 2, 'slime-idle'))
    this.map = new GameMap(this.GRID_WIDTH, this.GRID_HEIGHT)
    this.map.entities.push(this.player)
    this.map.entities.push(...this.npcs)
  }

  update() {
    this.player.update(this)
  }

  processTurn() {
    this.isTurnInProgress = true

    const aliveNpcs = this.npcs.filter(npc => npc.health > 0)
    if (aliveNpcs.length === 0) {
      this.isTurnInProgress = false
      return
    }

    aliveNpcs.forEach(npc => npc.update(this))

    this.time.delayedCall(500, () => {
      this.isTurnInProgress = false
    })

  }

  /**
  * @param {number} gridX
  * @param {number} gridY
  */
  gridToPixel(gridX, gridY) {
    return { x: gridX * this.TILE_SIZE + (this.TILE_SIZE / 2), y: gridY * this.TILE_SIZE + (this.TILE_SIZE / 2) }
  }

  loadGround() {
    for (let x = 0; x < this.GRID_WIDTH; x++) {
      for (let y = 0; y < this.GRID_HEIGHT; y++) {
        const coord = this.gridToPixel(x, y)
        this.add.image(coord.x, coord.y, 'ground')
      }
    }
  }
}
