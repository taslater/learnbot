// import { renderer } from "./renderer.mjs"
// import { w, h } from "../globals.mjs"

// const nAngles = 7,
//   r = 20,
//   red = 0xc7523b

// const offset = 100
// const hotdogInfo = getHotDogPts(
//   [0.5 * w - offset, 0.5 * h - offset],
//   [0.5 * w + offset, 0.5 * h + offset]
// )

// const hotdogPoly = new PIXI.Graphics()
// hotdogPoly.lineStyle(2, 0x000000)
// hotdogPoly.beginFill(red, 1)
// hotdogPoly.drawPolygon(hotdogInfo.pts.map(pt => new PIXI.Point(pt[0], pt[1])))
// hotdogPoly.endFill()

// const hotdogTexture = PIXI.RenderTexture.create(
//   hotdogPoly.width + 2,
//   hotdogPoly.height + 2
// )
// renderer.render(hotdogPoly, hotdogTexture)

// const hotdogSprite = new PIXI.Sprite(hotdogTexture)
// hotdogSprite.anchor.set(0.5)
// const c = { x: hotdogInfo.c[0], y: hotdogInfo.c[1] }
// hotdogSprite.position = Object.assign({}, c)
// hotdogSprite.rotation = hotdogInfo.a
// export const hotdog = { info: hotdogInfo, sprite: hotdogSprite }

// function getHotDogPts(pt0, pt1) {
//   const v = [pt0[0] - pt1[0], pt0[1] - pt1[1]]
//   const l = Math.sqrt(v[0] ** 2 + v[1] ** 2)
//   const a = Math.atan2(v[1], v[0])
//   const c = [0.5 * (pt0[0] + pt1[0]), 0.5 * (pt0[1] + pt1[1])]
//   let pts = []

//   const pr = [0.5 * l, 0]
//   const pl = [-0.5 * l, 0]
//   const aInc = Math.PI / nAngles
//   let aCurrent = 0
//   aCurrent = semi(pr, pts, aCurrent, aInc)
//   semi(pl, pts, aCurrent, aInc)

//   pts = pts.map(pt => [pt[0] + r + 0.5 * l + 2, pt[1] + r + 2])
//   return { pts, a, c, l }

//   // const bodyDef = new box2d.b2BodyDef()
//   // bodyDef.type = box2d.b2BodyType.b2_dynamicBody
//   // bodyDef.position.Set(
//   //   c[0] * global.metersPerPixel,
//   //   -c[1] * global.metersPerPixel
//   // )
//   // bodyDef.angle = -a
//   // const body = world.CreateBody(bodyDef)
//   // const shape = new box2d.b2PolygonShape()
//   // const vertices = []
//   // for (let pt of pts) {
//   //   vertices.push(
//   //     new box2d.b2Vec2(
//   //       pt[0] * global.metersPerPixel,
//   //       -pt[1] * global.metersPerPixel
//   //     )
//   //   )
//   // }
//   // shape.Set(vertices, vertices.length)

//   // const fixtureDef = new box2d.b2FixtureDef()
//   // fixtureDef.shape = shape
//   // fixtureDef.density = 1
//   // fixtureDef.friction = 1
//   // fixtureDef.restitution = 0
//   // // Collision groups let you specify an integral group index.
//   // // You can have all fixtures with the same group index always collide
//   // // (positive index) or never collide (negative index).
//   // fixtureDef.filter.groupIndex = -1
//   // body.CreateFixture(fixtureDef)
//   // const m = body.GetMass()

//   // return [body, l, m, c[0]]
// }

// function addPts(p0, p1) {
//   return [p0[0] + p1[0], p0[1] + p1[1]]
// }

// function semi(p, pts, aCurrent, aInc) {
//   for (let i = 0; i < nAngles + 1; i++) {
//     pts.push(addPts(p, [r * Math.sin(aCurrent), r * Math.cos(aCurrent)]))
//     aCurrent += aInc
//   }
//   aCurrent -= aInc
//   return aCurrent
// }
