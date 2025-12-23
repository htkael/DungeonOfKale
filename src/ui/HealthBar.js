import Phaser from "phaser"
import { GameScene } from "../scenes/GameScene"

export class HealthBar extends Phaser.GameObjects.Container {

  constructor(scene, x, y, width, height, currentHealth, maxHealth, showText = true, fontSize = '14px') {
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
    this.width = width
    /** @type {number} */
    this.height = height
    /** @type {number} */
    this.maxHealth = maxHealth
    /** @type {number} */
    this.currentHealth = currentHealth
    /** @type {boolean} */
    this.showText = showText
    this.bar = new Phaser.GameObjects.Graphics(scene)
    this.add(this.bar)
    this.text = new Phaser.GameObjects.Text(this.scene, 0, 30, `HP: 100/100`, { fontSize: showText ? fontSize : '0px', color: "#000000", fontFamily: 'Arial', fontStyle: 'bold' })
    this.add(this.text)

    scene.add.existing(this)
    this.draw()
  }

  draw() {
    this.bar.clear()

    this.bar.fillStyle(0x000000)
    this.bar.fillRect(0, 0, this.width, this.height)

    this.bar.fillStyle(0xffffff)
    this.bar.fillRect(2, 2, this.width - 4, this.height - 4)

    const healthPercent = this.currentHealth / this.maxHealth
    const barWidth = (this.width - 4) * healthPercent

    if (healthPercent <= 0.33) {
      this.bar.fillStyle(0xff0000)
    } else {
      this.bar.fillStyle(0x00ff00)
    }

    this.bar.fillRect(2, 2, barWidth, this.height - 4)
    this.text.setText(`HP: ${Math.floor(this.currentHealth)}/${this.maxHealth}`)
  }

  /** @param {GameScene} game */
  update(player) {
    const newHealth = Math.max(0, player.health)
    this.bar.scene.tweens.add({
      targets: this,
      currentHealth: newHealth,
      duration: 300,
      onUpdate: () => {
        this.draw()
      }
    })
  }
}
