import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.GameObjects.Sprite {
  /**
  * @param {GameScene} scene
  * @param {number} x
  * @param {number} y
  * @param {string} name
  * @param {number} health
  */
  constructor(scene, x, y, name, health) {
    super(scene, x, y, 'player-idle')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setScale(1.5)
    this.createAnimations()
    this.anims.play('idle-down')
    /** @type {string} */
    this.direction = 'down'
  }

  createAnimations() {
    if (!this.scene.anims.exists('idle-down')) {
      this.scene.anims.create({
        key: 'idle-down',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-idle', { start: 0, end: 11 }),
        frameRate: 8,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'idle-left',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-idle', { start: 12, end: 23 }),
        frameRate: 8,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'idle-right',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-idle', { start: 24, end: 35 }),
        frameRate: 8,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'idle-up',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-idle', { start: 36, end: 39 }),
        frameRate: 2,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'walk-down',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-walk', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'walk-left',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-walk', { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'walk-right',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-walk', { start: 12, end: 17 }),
        frameRate: 8,
        repeat: -1
      })

      this.scene.anims.create({
        key: 'walk-up',
        frames: this.scene.anims.generateFrameNumbers('player-unarmed-walk', { start: 18, end: 23 }),
        frameRate: 8,
        repeat: -1
      })
    }
  }

  /** 
   * @param {Phaser.Types.Input.Keyboard.CursorKeys}
   */
  update(cursors) {
    if (cursors.left.isDown) {
      this.body.setVelocity(-100, 0)
      this.direction = 'left'
      this.anims.play('walk-left', true)
    } else if (cursors.right.isDown) {
      this.body.setVelocity(100, 0)
      this.direction = 'right'
      this.anims.play('walk-right', true)
    } else if (cursors.down.isDown) {
      this.body.setVelocity(0, 100)
      this.direction = 'down'
      this.anims.play('walk-down', true)
    } else if (cursors.up.isDown) {
      this.body.setVelocity(0, -100)
      this.direction = 'up'
      this.anims.play('walk-up', true)
    } else {
      this.body.setVelocity(0, 0)
      this.anims.play(`idle-${this.direction}`, true)
    }
  }
}
