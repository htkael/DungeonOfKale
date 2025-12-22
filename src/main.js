import Phaser from "phaser"
import { GameScene } from "./scenes/GameScene"

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
