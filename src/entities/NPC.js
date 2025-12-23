import { Player } from "./Player.js"
import { GameMap } from "../gameMap"
import { GameScene } from "../scenes/GameScene"

export class NPC extends Phaser.GameObjects.Sprite {
  /**
  * @param {GameScene} scene
  * @param {number} gridX
  * @param {number} gridY
  * @param {string} name
  * @param {number} health
  * @param {boolean} hostile
  * @param {number} strength
  * @param {string} sprite
  */
  constructor(scene, gridX, gridY, name, health, hostile, strength, sprite = 'slime-idle') {
    super(scene, scene.gridToPixel(gridX, gridY).x, scene.gridToPixel(gridX, gridY).y, sprite)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.gridX = gridX
    this.gridY = gridY
    this.setScale(1.2)
    this.createAnimations()
    this.anims.play('slime-idle-down')
    /** @type {string} */
    this.direction = 'down'
    /** @type{number} */
    this.maxHealth = health
    /** @type{number} */
    this.health = health
    this.name = name
    this.inventory = []
    /** @type {boolean} */
    this.hostile = hostile
    /** @type {number} */
    this.strength = strength
    /** @type {string} */
    this.state = 'idle'
    /** @type {string} */
    this.sprite = sprite
  }

  createAnimations() {
    if (!this.scene.anims.exists('slime-idle-down')) {
      this.scene.anims.create({
        key: 'slime-idle-down',
        frames: this.scene.anims.generateFrameNumbers('slime-idle', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-idle-up',
        frames: this.scene.anims.generateFrameNumbers('slime-idle', { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-idle-left',
        frames: this.scene.anims.generateFrameNumbers('slime-idle', { start: 12, end: 17 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-idle-right',
        frames: this.scene.anims.generateFrameNumbers('slime-idle', { start: 18, end: 23 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-walk-down',
        frames: this.scene.anims.generateFrameNumbers('slime-walk', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-walk-up',
        frames: this.scene.anims.generateFrameNumbers('slime-walk', { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-walk-left',
        frames: this.scene.anims.generateFrameNumbers('slime-walk', { start: 12, end: 17 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-walk-right',
        frames: this.scene.anims.generateFrameNumbers('slime-walk', { start: 18, end: 23 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'slime-attack-down',
        frames: this.scene.anims.generateFrameNumbers('slime-attack', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-attack-up',
        frames: this.scene.anims.generateFrameNumbers('slime-attack', { start: 6, end: 11 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-attack-left',
        frames: this.scene.anims.generateFrameNumbers('slime-attack', { start: 12, end: 17 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-attack-right',
        frames: this.scene.anims.generateFrameNumbers('slime-attack', { start: 18, end: 23 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-hurt-down',
        frames: this.scene.anims.generateFrameNumbers('slime-hurt', { start: 0, end: 4 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-hurt-up',
        frames: this.scene.anims.generateFrameNumbers('slime-hurt', { start: 5, end: 9 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-hurt-left',
        frames: this.scene.anims.generateFrameNumbers('slime-hurt', { start: 10, end: 14 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-hurt-right',
        frames: this.scene.anims.generateFrameNumbers('slime-hurt', { start: 15, end: 19 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-death-down',
        frames: this.scene.anims.generateFrameNumbers('slime-death', { start: 0, end: 9 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-death-up',
        frames: this.scene.anims.generateFrameNumbers('slime-death', { start: 10, end: 19 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-death-left',
        frames: this.scene.anims.generateFrameNumbers('slime-death', { start: 20, end: 29 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'slime-death-right',
        frames: this.scene.anims.generateFrameNumbers('slime-death', { start: 30, end: 39 }),
        frameRate: 8,
        repeat: 0
      })
    }
  }

  /** 
   * @param {Phaser.Types.Input.Keyboard.CursorKeys}
   */
  update(game) {
    if (this.state === 'moving' || this.state === 'attacking') {
      return
    }
    const player = game.player
    const distance = this.distanceTo(player)
    if (distance <= 1) {
      this.attack(game)
    } else if (distance < 5) {
      this.moveTowards(player, game.map)
    } else if (this.health < 2) {
      this.fleeFrom(player, game.map)
    } else {
      const ran = Math.random()
      if (ran > 0.2) {
        this.wander(game.map)
      } else {
        this.anims.play(`slime-idle-${this.direction}`, true)
      }
    }
  }

  /**
  * @param {number} newGridX
  * @param {number} newGridY
  * @param {GameMap} gameMap
  */
  moveToGrid(newGridX, newGridY, gameMap) {
    if (!gameMap.canMoveTo(newGridX, newGridY) || this.state === 'moving') {
      return false
    }
    this.gridX = newGridX
    this.gridY = newGridY

    this.tweenToGridPosition()

    return true
  }

  tweenToGridPosition() {
    this.state = 'moving'
    const pos = this.scene.gridToPixel(this.gridX, this.gridY)
    this.anims.play(`slime-walk-${this.direction}`, true)
    this.scene.tweens.add({
      targets: this,
      x: pos.x,
      y: pos.y,
      duration: 200,
      onComplete: () => {
        this.anims.play(`slime-idle-${this.direction}`, true)
        this.state = 'idle'
      }
    })
  }

  /**
  * @param {Player} other
  * @returns {number}
  */
  distanceTo(other) {
    return Math.sqrt(Math.pow(this.gridX - other.gridX, 2) + Math.pow(this.gridY - other.gridY, 2))
  }

  /**
  * @param {number} amount
  * @param {GameScene} game
  */
  takeDamage(amount, game) {
    this.health -= amount
    this.anims.play(`slime-hurt-${this.direction}`, true)
    if (this.health <= 0) {
      this.die(game)
    } else {
      this.once('animationcomplete', () => {
        this.anims.play(`slime-idle-${this.direction}`, true)
      })
    }
  }

  /**
  * @param {GameScene} game
  */
  attack(game) {
    this.state = 'attacking'
    let coords = [
      { x: this.gridX + 1, y: this.gridY },
      { x: this.gridX - 1, y: this.gridY },
      { x: this.gridX, y: this.gridY + 1 },
      { x: this.gridX, y: this.gridY - 1 },
    ]
    const damage = 2 * this.strength

    game.map.receiveAttack(coords, damage, game, this, game.messageLog)
    this.anims.play(`slime-attack-${this.direction}`, true)
    this.once('animationcomplete', () => {
      this.state = 'idle'
      this.anims.play(`slime-idle-${this.direction}`)
    })
  }

  /**
   * @param {Player} target
   * @param {GameMap} map
  */
  moveTowards(target, map) {
    const dx = Math.sign(target.gridX - this.gridX)
    const dy = Math.sign(target.gridY - this.gridY)

    const lengthX = target.gridX - this.gridX
    const lengthY = target.gridY - this.gridY

    if (Math.abs(lengthX) > Math.abs(lengthY)) {
      this.moveToGrid(this.gridX + dx, this.gridY, map)
    } else {
      this.moveToGrid(this.gridX, this.gridY + dy, map)
    }
  }

  /**
   * @param {Player} target
   * @param {GameMap} map
  */
  fleeFrom(target, map) {
    const dx = Math.sign(target.gridX - this.gridX)
    const dy = Math.sign(target.gridY - this.gridY)

    const lengthX = target.gridX - this.gridX
    const lengthY = target.gridY - this.gridY

    if (Math.abs(lengthX) > Math.abs(lengthY)) {
      this.moveToGrid(this.gridX - dx, this.gridY, map)
    } else {
      this.moveToGrid(this.gridX, this.gridY - dy, map)
    }
  }

  /**
  * @param {GameMap} map
  */
  wander(map) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)]
    this.moveToGrid(this.gridX + dx, this.gridY + dy, map)
  }

  /**
  * @param {GameScene} game
  */
  die(game) {
    this.anims.play(`slime-death-${this.direction}`)
    this.once('animationcomplete', () => {
      const gameIndex = game.npcs.indexOf(this)
      const mapIndex = game.map.entities.indexOf(this)

      game.npcs.splice(gameIndex, 1)
      game.map.entities.splice(mapIndex, 1)
      game.messageLog.addMessage(`${this.name} has died!`)
      this.destroy()
    })
  }
}
