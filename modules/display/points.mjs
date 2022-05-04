import { r } from "../globals.mjs"
import { renderer } from "./renderer.mjs"
import {
  alreadyHotdog,
  creaturePts,
  dragging,
  highlightedHotdog,
  highlightedIdx,
  hotdogs,
  mousePos,
  nPointsChanged,
  deathPtsChanged,
  overSelected,
  playing,
  pointsDragged,
  selectedHotdog,
  selectedIdx,
} from "../controls.mjs"

const mouseCircle = new PIXI.Graphics()
mouseCircle.lineStyle(1, 0x000000)
mouseCircle.beginFill(0xffffff, 1)
mouseCircle.drawCircle(r + 1, r + 1, r)
mouseCircle.endFill()

const mouseTexture = PIXI.RenderTexture.create(
  mouseCircle.width + 2,
  mouseCircle.height + 2
)
renderer.render(mouseCircle, mouseTexture)

const deathCircle = new PIXI.Graphics()
deathCircle.lineStyle(10, 0x000000)
deathCircle.beginFill(0xffffff, 1)
deathCircle.drawCircle(r + 10, r + 10, r)
deathCircle.endFill()

const deathTexture = PIXI.RenderTexture.create(
  deathCircle.width + 10,
  deathCircle.height + 10
)
renderer.render(deathCircle, deathTexture)

export const mouseSprite = new PIXI.Sprite(mouseTexture)
mouseSprite.anchor.set(0.5)
mouseSprite.tint = 0xff0000

export const creatureGraphics = new PIXI.Container()

const ptsContainer = new PIXI.Container()
const hotdogsGraphics = new PIXI.Graphics()
creatureGraphics.addChild(hotdogsGraphics)
creatureGraphics.addChild(ptsContainer)

export function updateCreatureViz() {
  if (nPointsChanged || deathPtsChanged) {
    ptsContainer.removeChildren()
    for (let i = 0; i < creaturePts.length; i++) {
      let t = creaturePts[i].deathPt ? deathTexture : mouseTexture
      const s = new PIXI.Sprite(t)
      s.anchor.set(0.5)
      s.position = Object.assign({}, creaturePts[i].pos)
      ptsContainer.addChild(s)
    }
  } else if (pointsDragged.length > 0) {
    for (let idx of pointsDragged) {
      // ptsContainer.children[idx].position.set(...creaturePts[idx])
      ptsContainer.children[idx].position = Object.assign(
        {},
        creaturePts[idx].pos
      )
    }
  }
  for (let i = 0; i < creaturePts.length; i++) {
    let tint = 0xffffff
    if (!playing) {
      if (i == selectedIdx) {
        // blue
        tint = 0x0000ff
      } else if (i == highlightedIdx) {
        // green
        tint = 0x00ff00
      }
    }
    ptsContainer.children[i].tint = tint
  }

  // if (selectedIdx != null) {
  // }
}

export const selectedToMouseLine = new PIXI.Graphics()
export function updateSelectedToMouse() {
  selectedToMouseLine.clear()
  if (
    selectedIdx == null ||
    dragging ||
    overSelected ||
    playing ||
    mousePos.x == null ||
    highlightedHotdog != null ||
    alreadyHotdog
  ) {
    return
  }
  selectedToMouseLine.lineStyle(r, 0x000000)
  selectedToMouseLine.moveTo(
    creaturePts[selectedIdx].pos.x,
    creaturePts[selectedIdx].pos.y
  )
  const otherPt =
    highlightedIdx == null
      ? Object.assign({}, mousePos)
      : creaturePts[highlightedIdx].pos
  selectedToMouseLine.lineTo(otherPt.x, otherPt.y)
}

export function updateHotdogs() {
  hotdogsGraphics.clear()
  for (let i = 0; i < hotdogs.length; i++) {
    const hotdog = hotdogs[i]
    hotdogsGraphics.lineStyle(2 * r + 2, 0x000000)
    hotdogsGraphics.moveTo(
      creaturePts[hotdog[0]].pos.x,
      creaturePts[hotdog[0]].pos.y
    )
    hotdogsGraphics.lineTo(
      creaturePts[hotdog[1]].pos.x,
      creaturePts[hotdog[1]].pos.y
    )
    // light sherbert orange
    let color = 0xffa024
    // Cat's millennial pink
    // let color = 0xfdd0d2
    // saturated millennial pink
    // let color = 0xfb9fa4
    if (!playing) {
      if (i == highlightedHotdog) {
        color = 0x00ff00
      } else if (i == selectedHotdog) {
        color = 0x0000ff
      }
    }
    hotdogsGraphics.lineStyle(2 * r, color)
    hotdogsGraphics.moveTo(
      creaturePts[hotdog[0]].pos.x,
      creaturePts[hotdog[0]].pos.y
    )
    hotdogsGraphics.lineTo(
      creaturePts[hotdog[1]].pos.x,
      creaturePts[hotdog[1]].pos.y
    )
  }
}
