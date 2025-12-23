import { GameMap } from "../gameMap";
import { GameScene } from "../scenes/GameScene";
import { NPC } from "./NPC";

export class Player extends Phaser.GameObjects.Sprite {
  /**
  * @param {GameScene} scene
  * @param {number} gridX
  * @param {number} gridY
  * @param {string} name
  * @param {number} health
  */
  constructor(scene, gridX, gridY, name, health) {
    super(scene, scene.gridToPixel(gridX, gridY).x, scene.gridToPixel(gridX, gridY).y, 'player-idle')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.gridX = gridX
    this.gridY = gridY
    this.setScale(1.2)
    this.createAnimations()
    this.anims.play('idle-down')
    /** @type {string} */
    this.direction = 'down'
    /** @type{number} */
    this.maxHealth = health
    /** @type{number} */
    this.health = health
    this.name = name
    this.inventory = []
    /** @type {boolean} */
    this.isPlayer = true
    /** @type {number} */
    this.strength = 1
    /** @type {string} */
    this.state = 'idle'
  }

  createAnimations() {
    if (!this.scene.anims.exists('idle-down')) {
      this.scene.anims.create({
        key: 'idle-down',
        frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 0, end: 11 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'idle-left',
        frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 12, end: 23 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'idle-right',
        frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 24, end: 35 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'idle-up',
        frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 36, end: 39 }),
        frameRate: 2,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'walk-down',
        frames: this.scene.anims.generateFrameNumbers('player-walk', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'walk-left',
        frames: this.scene.anims.generateFrameNumbers('player-walk', { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'walk-right',
        frames: this.scene.anims.generateFrameNumbers('player-walk', { start: 12, end: 17 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'walk-up',
        frames: this.scene.anims.generateFrameNumbers('player-walk', { start: 18, end: 23 }),
        frameRate: 8,
        repeat: -1
      })
      this.scene.anims.create({
        key: 'attack-down',
        frames: this.scene.anims.generateFrameNumbers('player-attack', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'attack-left',
        frames: this.scene.anims.generateFrameNumbers('player-attack', { start: 8, end: 15 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'attack-right',
        frames: this.scene.anims.generateFrameNumbers('player-attack', { start: 16, end: 23 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'attack-up',
        frames: this.scene.anims.generateFrameNumbers('player-attack', { start: 24, end: 31 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-hurt-down',
        frames: this.scene.anims.generateFrameNumbers('player-hurt', { start: 0, end: 4 }),
        frameRate: 4,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-hurt-left',
        frames: this.scene.anims.generateFrameNumbers('player-hurt', { start: 5, end: 9 }),
        frameRate: 4,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-hurt-right',
        frames: this.scene.anims.generateFrameNumbers('player-hurt', { start: 10, end: 14 }),
        frameRate: 4,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-hurt-up',
        frames: this.scene.anims.generateFrameNumbers('player-hurt', { start: 15, end: 19 }),
        frameRate: 4,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-death-down',
        frames: this.scene.anims.generateFrameNumbers('player-death', { start: 0, end: 6 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-death-left',
        frames: this.scene.anims.generateFrameNumbers('player-death', { start: 7, end: 13 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-death-right',
        frames: this.scene.anims.generateFrameNumbers('player-death', { start: 14, end: 20 }),
        frameRate: 8,
        repeat: 0
      })
      this.scene.anims.create({
        key: 'player-death-up',
        frames: this.scene.anims.generateFrameNumbers('player-death', { start: 20, end: 27 }),
        frameRate: 8,
        repeat: 0
      })
    }
  }

  /** 
   * @param {Phaser.Types.Input.Keyboard.CursorKeys}
   */
  update({ cursors, map, game, healthBar }) {
    if (this.state === 'moving' || this.state === 'attacking' || this.state === 'hurt') {
      return
    }
    if (cursors.left.isDown || game.wasd.A.isDown) {
      this.direction = 'left'
      this.moveToGrid(this.gridX - 1, this.gridY, map, game)
    } else if (cursors.right.isDown || game.wasd.D.isDown) {
      this.direction = 'right'
      this.moveToGrid(this.gridX + 1, this.gridY, map, game)
    } else if (cursors.down.isDown || game.wasd.S.isDown) {
      this.direction = 'down'
      this.moveToGrid(this.gridX, this.gridY + 1, map, game)
    } else if (cursors.up.isDown || game.wasd.W.isDown) {
      this.direction = 'up'
      this.moveToGrid(this.gridX, this.gridY - 1, map, game)
    } else if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.attack(map, game)
    } else {
      this.anims.play(`idle-${this.direction}`, true)
    }
  }

  /**
  * @param {number} newGridX
  * @param {number} newGridY
  * @param {GameMap} gameMap
  */
  moveToGrid(newGridX, newGridY, gameMap, game) {
    if (!gameMap.canMoveTo(newGridX, newGridY) || this.state === 'moving') {
      return false
    }
    this.gridX = newGridX
    this.gridY = newGridY

    this.tweenToGridPosition(game)

    return true
  }

  tweenToGridPosition(game) {
    this.state = 'moving'
    const pos = this.scene.gridToPixel(this.gridX, this.gridY)
    this.anims.play(`walk-${this.direction}`, true)
    this.scene.tweens.add({
      targets: this,
      x: pos.x,
      y: pos.y,
      duration: 200,
      onComplete: () => {
        this.anims.play(`idle-${this.direction}`, true)
        this.state = 'idle'
        game.processTurn()
      }
    })
  }

  /**
  * @param {NPC} other
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
    this.state = 'hurt'
    this.health -= amount
    this.anims.play(`player-hurt-${this.direction}`, true)
    if (this.health <= 0) {
      this.die(game)
    } else {
      this.once('animationcomplete', () => {
        this.state = 'idle'
        game.healthBar.update(this)
      })
    }
  }

  /**
  * @param {GameMap} map
  * @param {GameScene} game
  */
  attack(map, game) {
    this.state = 'attacking'
    let coords = this.getFacingCoords()
    const damage = 5 * this.strength

    map.receiveAttack([coords], damage, game)
    this.anims.play(`attack-${this.direction}`, true)

    this.once('animationcomplete', () => {
      this.state = 'idle'
      game.processTurn()
    })
  }

  /**
  * @param {GameMap} map
  */
  pickUp(map) {
    let coords = this.getFacingCoords()
    map.pickUpItem(coords, this)
  }

  getFacingCoords() {
    let coords
    if (this.direction === 'up') {
      coords = { x: this.gridX, y: this.gridY - 1 }
    } else if (this.direction === 'down') {
      coords = { x: this.gridX, y: this.gridY + 1 }
    } else if (this.direction === "left") {
      coords = { x: this.gridX - 1, y: this.gridY }
    } else {
      coords = { x: this.gridX + 1, y: this.gridY }
    }

    return coords
  }

  /**
  * @param {GameScene} game
  */
  die(game) {
    this.anims.play(`player-death-${this.direction}`)
    this.once('animationcomplete', () => {
      const mapIndex = game.map.entities.indexOf(this)

      game.map.entities.splice(mapIndex, 1)
      this.destroy()
    })
  }
}
