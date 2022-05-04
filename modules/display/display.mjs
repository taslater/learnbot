import { renderer } from "./renderer.mjs"
import {
  mouseSprite,
  creatureGraphics,
  selectedToMouseLine,
} from "./points.mjs"
import { groundSprite } from "./ground.mjs"
import { clouds } from "./clouds.mjs"
// import { nCreatures } from "../globals.mjs"
import {
  mousePos,
  playing,
  dragging,
  highlightedIdx,
  overSelected,
  highlightedHotdog,
} from "../controls.mjs"
import { population } from "../creature/population.mjs"

const cloudSpeed = 0.5

export const stage = new PIXI.Container()
stage.sortableChildren = true

stage.addChild(groundSprite)

for (let cloud of clouds) {
  stage.addChild(cloud.s)
}

// stage.addChild(hotdog.sprite)

stage.addChild(mouseSprite)

stage.addChild(creatureGraphics)

stage.addChild(selectedToMouseLine)

export function render(xOffset) {
  // renderer.resize(window.innerWidth, window.innerHeight)
  for (let cloud of clouds) {
    const s = cloud.s,
      zInv = cloud.zInv
    cloud.x -= cloudSpeed * zInv

    s.tilePosition.x = cloud.x + xOffset * zInv
  }

  groundSprite.tilePosition.x = xOffset

  const interactionVisible = playing ? false : true
  creatureGraphics.visible = interactionVisible
  selectedToMouseLine.visible = interactionVisible

  if (
    overSelected ||
    mousePos.x == null ||
    highlightedIdx != null ||
    dragging ||
    playing ||
    highlightedHotdog != null
  ) {
    mouseSprite.visible = false
  } else {
    mouseSprite.visible = true
  }
  mouseSprite.position = Object.assign({}, mousePos)

  creatureGraphics.position.x = xOffset

  if (population != null && population.nCreatures > 0 && population.creatures.length == population.nCreatures) {
    population.graphics.visible = !interactionVisible

    population.graphics.position.x = xOffset

    population.show()
  }

  renderer.render(stage)
}
