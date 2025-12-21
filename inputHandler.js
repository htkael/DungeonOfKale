import { Game } from "./game.js"
import readline from "readline"

export class InputHandler {
  /**
  * @param {Game} game
  */
  constructor(game) {
    /** @type{Game} */
    this.game = game
    this.setUpKeyboard()
  }

  setUpKeyboard() {
    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit()
      }

      if (this.game.state === 'start') {
        switch (key.name) {
          case 's':
            this.game.setState('play')
            break
          case 'q':
            process.exit()
        }
      } else if (this.game.state === 'dead') {
        switch (key.name) {
          case 'r':
            this.game.reset()
            this.game.setState('play')
            break
          case 'q':
            process.exit()
        }
      } else if (this.game.state === 'play') {
        if (this.game.player.state === 'equipping') {
          const options = this.game.player.inventory
          if (options.find((o, i) => i === parseInt(key.name))) {
            this.game.handlePlayerAction(`${key.name}`)
          }
        }

        if (this.game.player.state === 'using') {
          const options = this.game.player.inventory
          if (options.find((o, i) => i === parseInt(key.name))) {
            this.game.handlePlayerAction(`${key.name}`)
          }
        }
        switch (key.name) {
          case 'w': case "up":
            this.game.handlePlayerAction("north")
            break
          case "s": case "down":
            this.game.handlePlayerAction('south')
            break
          case "a": case "left":
            this.game.handlePlayerAction("west")
            break
          case "d": case "right":
            this.game.handlePlayerAction("east")
            break
          case "e":
            this.game.handlePlayerAction("pickUp")
            break
          case "u":
            this.game.handlePlayerAction("use")
            break
          case "l":
            this.game.handlePlayerAction("equip")
            break
          case "space":
            this.game.handlePlayerAction("attack")
            break
          case "q":
            process.exit()
        }

      } else if (this.game.state === 'cleared') {
        switch (key.name) {
          case "g":
            this.game.levelUp()
            break
          case "q":
            process.exit()
        }
      }


      this.game.render()
    })
  }
}
