import { Game } from "./game.js"
import { InputHandler } from "./inputHandler.js"

const game = new Game()
const handler = new InputHandler(game)

game.start()
