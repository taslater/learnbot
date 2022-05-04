import { w, h } from "../globals.mjs"
import { renderer } from "./renderer.mjs"

const nClouds = 20

export const clouds = []
for (let i = 0; i < nClouds; i++) {
  const cloud = getCloud()
  clouds.push(cloud)
}

clouds.sort((a, b) => a.zInv - b.zInv)

function getCloud() {
  const zInv = 0.8 * Math.random() ** 2.5 + 0.1
  const cloudContainer = new PIXI.Container()
  const cloudH = Math.floor(250 * zInv),
    cloudW = Math.floor(400 * zInv),
    rLims = [40, 60].map(v => v * zInv),
    rs = [
      rLims[0] + (rLims[1] - rLims[0]) * Math.random(),
      rLims[0] + (rLims[1] - rLims[0]) * Math.random()
    ],
    pts = [
      [rs[0], cloudH - rs[0]],
      [cloudW - rs[1], cloudH - rs[1]]
    ]
  const left = Math.random() < 0.5 ? 1 : -1
  const touchPt = [
    0.5 * (pts[0][0] + pts[1][0]) + left * zInv * (30 + 30 * Math.random()),
    Math.min(pts[0][1] - rs[0], pts[1][1] - rs[1]) -
      zInv * (20 + 10 * Math.random())
  ]
  const as = pts.map(pt =>
    Math.atan2(...pt.map((coord, i) => coord - touchPt[i]))
  )
  const maxDs = pts
    .map(pt =>
      pt.map((coord, i) => (coord - touchPt[i]) ** 2).reduce((a, b) => a + b)
    )
    .map(res => Math.sqrt(res))
  const overlapMin = 10 * zInv
  const ds = maxDs.map(
    (d, i) =>
      0.5 * (d - rs[i] + overlapMin + (rs[i] + overlapMin) * Math.random())
  )
  for (let i = 0; i < 2; i++) {
    pts.push([
      touchPt[0] + ds[i] * Math.sin(as[i]),
      touchPt[1] + ds[i] * Math.cos(as[i])
    ])
    rs.push(ds[i])
  }

  // const rgbVal = Math.sqrt(0.6 + 0.4 * zInv)
  // const color = PIXI.utils.rgb2hex([rgbVal, rgbVal, rgbVal])
  // const color = PIXI.utils.rgb2hex([1, 1, 1])
  const color = whiteBlueInterp(zInv)
  for (let i = 0; i < 4; i++) {
    const pt = pts[i],
      r = rs[i]

    const puff = new PIXI.Graphics()
    puff.beginFill(color, 1)
    puff.drawCircle(...pt, r)
    puff.endFill()
    cloudContainer.addChild(puff)
  }

  const poly = new PIXI.Graphics()
  poly.beginFill(color, 1)
  poly.drawPolygon([
    new PIXI.Point(pts[0][0], cloudH),
    new PIXI.Point(...pts[0]),
    new PIXI.Point(...pts[2]),
    new PIXI.Point(...pts[3]),
    new PIXI.Point(...pts[1]),
    new PIXI.Point(pts[1][0], cloudH)
  ])
  poly.endFill()
  cloudContainer.addChild(poly)

  const cloudTexture = PIXI.RenderTexture.create(w + cloudW, cloudH)
  renderer.render(cloudContainer, cloudTexture)

  // const cloudSprite = new PIXI.Sprite(cloudTexture)
  const cloudSprite = new PIXI.TilingSprite(cloudTexture, w + cloudW, cloudH)
  // cloudSprite.anchor.set(0.5)
  cloudSprite.anchor.set(0, 0.5)

  const x = w * Math.random()

  // cloudSprite.position.x = x
  cloudSprite.position.y = h * (0.8 - 0.8 * zInv)
  cloudSprite.tilePosition.x = x
  // cloudSprite.alpha = Math.sqrt(zInv)

  return { s: cloudSprite, zInv, x }
}

function whiteBlueInterp(zInv) {
  const blueRGB = [0.5294, 0.8078, 0.9216],
    whiteRGB = [1, 1, 1]
  const interpRGB = [0, 1, 2].map(
    i => blueRGB[i] + Math.sqrt(zInv) * (whiteRGB[i] - blueRGB[i])
  )
  return PIXI.utils.rgb2hex(interpRGB)
}
