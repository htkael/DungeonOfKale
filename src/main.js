import Phaser from "phaser"
import { GameScene } from "./scenes/GameScene"
import { PHASER_HEIGHT, PHASER_WIDTH } from "./constants"

const config = {
  type: Phaser.AUTO,
  width: PHASER_WIDTH,
  height: PHASER_HEIGHT,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: GameScene
}

const game2 = new Phaser.Game(config)
