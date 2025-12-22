import Phaser from "phaser";
import { Player } from "../player/Player";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
    /** @type {Player}*/
    this.player = null
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    this.cursors = null
  }

  preload() {
    this.load.spritesheet('player-unarmed-idle', 'player/PNG/Unarmed/With_shadow/Unarmed_Idle_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('player-unarmed-walk', 'player/PNG/Unarmed/With_shadow/Unarmed_Walk_with_shadow.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create() {
    this.player = new Player(this, 400, 300, "Hunter", 100)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    this.player.update(this.cursors)
  }
}
