

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene")
  }

  preload() {
    this.load.image('background', 'public/tiles/Tiles/FieldsTile_01.png')
  }
} 
