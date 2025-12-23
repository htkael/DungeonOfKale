import Phaser from "phaser"

export class MessageLog extends Phaser.GameObjects.Container {
  constructor(scene, x, y, maxMessages) {
    super(scene, x, y)
    this.maxMessages = maxMessages
    /** @type {Phaser.GameObjects.Text[]}*/
    this.messages = []
    this.width = 150
    this.height = 150
    scene.add.existing(this)
  }

  /**
  * @param {string} text 
  */
  addMessage(text) {
    const newText = new Phaser.GameObjects.Text(this.scene, 10, this.height - 20, text, { fontSize: '14px', fontFamily: "Arial", color: "#000000", fontStyle: 'bold' })
    this.add(newText)
    this.messages.push(newText)
    this.scene.time.delayedCall(5000, () => {
      const index = this.messages.indexOf(newText)
      this.messages.splice(index, 1);
      newText.destroy()
      this.shiftMessages()
    })
    this.shiftMessages()
  }

  shiftMessages() {
    if (this.messages.length > this.maxMessages) {
      const oldest = this.messages.shift()
      oldest.destroy()
    }
    this.messages.forEach((msg, index) => {
      const reverseIndex = this.messages.length - 1 - index
      msg.y = this.height - 20 - (reverseIndex * 20)
    })
  }
}
