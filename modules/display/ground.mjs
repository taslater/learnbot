import { w, h } from "../globals.mjs"
import { renderer } from "./renderer.mjs"

export const groundTop = Math.round(0.8 * h),
  groundH = h - groundTop,
  sodH = Math.round(0.04 * h),
  sodNoiseR = 10,
  sodNoiseH = 10,
  strataH = Math.round(0.06 * h),
  strataNoiseR = 8,
  strataNoiseH = 6,
  stoneH = Math.round(0.06 * h),
  stoneNoiseR = 6,
  stoneNoiseH = 4,
  nPebbles = 100,
  tileW = w

const green = 0x008000,
  brown = 0x8b4513,
  ltBrown = 0x955528,
  gray = 0xaa7753

noise.seed(Math.random())

const groundContainer = new PIXI.Container()

const soil = new PIXI.Graphics()
soil.beginFill(brown, 1)
soil.drawRect(0, 0, tileW, groundH)
soil.endFill()
groundContainer.addChild(soil)

const strataPts = []
for (let a = 0; a < 2 * Math.PI; a += (2 * Math.PI) / (0.1 * tileW)) {
  const x = (a * tileW) / (2 * Math.PI),
    y =
      strataH +
      sodH +
      strataNoiseH *
        (1 -
          noise.simplex2(
            strataNoiseR * Math.cos(a),
            strataNoiseR * Math.sin(a)
          ))
  strataPts.push(new PIXI.Point(x, y))
}
strataPts.push(
  new PIXI.Point(tileW, strataPts[0].y),
  new PIXI.Point(tileW, groundH),
  new PIXI.Point(0, groundH)
)
const strata = new PIXI.Graphics()
strata.beginFill(ltBrown, 1)
strata.drawPolygon(strataPts)
strata.endFill()
groundContainer.addChild(strata)

const stonePts = []
for (let a = 0; a < 2 * Math.PI; a += (2 * Math.PI) / (0.1 * tileW)) {
  const x = (a * tileW) / (2 * Math.PI),
    y =
      strataH +
      sodH +
      stoneH +
      stoneNoiseH *
        (1 -
          noise.simplex2(stoneNoiseR * Math.cos(a), stoneNoiseR * Math.sin(a)))
  stonePts.push(new PIXI.Point(x, y))
}
stonePts.push(
  new PIXI.Point(tileW, stonePts[0].y),
  new PIXI.Point(tileW, groundH),
  new PIXI.Point(0, groundH)
)
const stone = new PIXI.Graphics()
stone.beginFill(gray, 1)
stone.drawPolygon(stonePts)
stone.endFill()
groundContainer.addChild(stone)

for (let i = 0; i < nPebbles; i++) {
  const pebble = new PIXI.Graphics()
  const x = tileW * Math.random(),
    y = 3 * sodNoiseH + sodH + (groundH - sodH - 3 * sodNoiseH) * Math.random()
  pebble.beginFill(0x424242, 0.6)
  pebble.drawEllipse(0, 0, 4 * Math.random() + 1.5, 1.5 * Math.random() + 0.2)
  pebble.endFill()
  pebble.x = x
  pebble.y = y
  pebble.rotation = 0.2 - 0.4 * Math.random()
  groundContainer.addChild(pebble)
}

const sodPts = []
for (let a = 0; a < 2 * Math.PI; a += (2 * Math.PI) / (0.1 * tileW)) {
  const x = (a * tileW) / (2 * Math.PI),
    y =
      sodH +
      sodNoiseH *
        (1 + noise.simplex2(sodNoiseR * Math.cos(a), sodNoiseR * Math.sin(a)))
  sodPts.push(new PIXI.Point(x, y))
}
sodPts.push(new PIXI.Point(tileW, sodPts[0].y))
const sodShadow = new PIXI.Graphics()
sodShadow.lineStyle(2, 0x000000)
sodShadow.moveTo(sodPts[0].x, sodPts[0].y)
for (let pt of sodPts.slice(1)) {
  sodShadow.lineTo(pt.x, pt.y)
}
groundContainer.addChild(sodShadow)
sodPts.push(new PIXI.Point(tileW, 0), new PIXI.Point(0, 0))
const sod = new PIXI.Graphics()
sod.beginFill(green, 1)
sod.drawPolygon(sodPts)
sod.endFill()
groundContainer.addChild(sod)

const groundTexture = PIXI.RenderTexture.create(tileW, groundH)
renderer.render(groundContainer, groundTexture)
export const groundSprite = new PIXI.TilingSprite(groundTexture, w, groundH)
groundSprite.position.y = groundTop
