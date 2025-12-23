import Phaser from "phaser"
import { GameScene } from "../scenes/GameScene"

export class HealthBar extends Phaser.GameObjects.Graphics {

  constructor(scene, x, y, width, height, currentHealth, maxHealth) {
    /**
    * @param {GameScene} scene
    * @param {number} x
    * @param {number} y
    * @param {number} width
    * @param {number} height
    * @param {number} currentHealth
    * @param {number} maxHealth
    */
    super(scene, x, y)
    /** @type {number} */
    this.x = x
    /** @type {number} */
    this.y = y
    /** @type {number} */
    this.width = width
    /** @type {number} */
    this.height = height
    /** @type {number} */
    this.maxHealth = maxHealth
    /** @type {number} */
    this.currentHealth = currentHealth

    scene.add.existing(this)
    this.draw()
  }

  draw() {
    this.clear()

    this.fillStyle(0x000000)
    this.fillRect(this.x, this.y, this.width, this.height)

    this.fillStyle(0xffffff)
    this.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4)

    const healthPercent = this.currentHealth / this.maxHealth
    const barWidth = (this.width - 4) * healthPercent

    if (healthPercent <= 0.33) {
      this.fillStyle(0xff0000)
    } else {
      this.fillStyle(0x00ff00)
    }

    this.fillRect(this.x + 2, this.y + 2, barWidth, this.height - 4)
  }

  /** @param {GameScene} game */
  update(player) {
    const newHealth = Math.max(0, player.health)
    this.scene.tweens.add({
      targets: this,
      currentHealth: newHealth,
      duration: 300,
      onUpdate: () => {
        this.draw()
      }
    })
  }
}
