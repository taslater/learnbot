import { render } from "./modules/display/display.mjs"
import { moveDir, playing } from "./modules/controls.mjs"
import { worldStep } from "./modules/world.mjs"
// import { nCreatures } from "./modules/globals.mjs"
import { population } from "./modules/creature/population.mjs"

let xOffset = 0
let xSpeed = 0
const xSpeedMag = 0.5,
  xSpeedDrag = 0.97
// export let b2

b2.then(() => tf.setBackend("cpu"))
  // .then(() => console.log(tf.getBackend()))
  .then(() => requestAnimationFrame(loop))

async function loop() {
  xSpeed += moveDir * xSpeedMag
  xOffset += xSpeed
  xSpeed *= xSpeedDrag
  if (Math.abs(xSpeed) < 0.1) {
    xSpeed = 0
  }
  render(xOffset)
  if (
    playing &&
    population != null &&
    population.nCreatures > 0 &&
    population.creatures.length == population.nCreatures
  ) {
    await worldStep()
  }
  requestAnimationFrame(loop)
}

export function resetOffset() {
  xOffset = 0
  xSpeed = 0
}
