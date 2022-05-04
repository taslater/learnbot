import {
  r,
  pixelsPerMeter,
  metersPerPixel,
  // angleLim,
  // maxTorque,
  // weldDampingRatio,
  restitution,
  friction,
  // nCreatures,
  // epLength,
  // speedMag,
  // mutationMag,
  // selectionRatio,
} from "../globals.mjs"
import { world } from "../world.mjs"
import { creaturePts, hotdogs } from "../controls.mjs"

export class Hotdog {
  constructor(
    graphicsContainer,
    hotdogAngles,
    hotdogLengths,
    hotdogMidPts,
    hotdogTextures,
    hotdogIdx
  ) {
    const ptIdxs = hotdogs[hotdogIdx],
      a = hotdogAngles[hotdogIdx],
      l = hotdogLengths[hotdogIdx],
      midPt = hotdogMidPts[hotdogIdx],
      texture = hotdogTextures[hotdogIdx]

    this.sprite = new PIXI.Sprite(texture)
    // this.sprite.anchor.set(0.5)
    this.sprite.pivot.set(0.5 * l + r + 1, r + 1)
    this.sprite.rotation = a
    graphicsContainer.addChild(this.sprite)

    this.initialPosition = new b2.b2Vec2(
      midPt.x * metersPerPixel,
      -midPt.y * metersPerPixel
    )
    this.initialAngle = -a
    const bd = new b2.b2BodyDef()
    bd.set_type(b2.b2_dynamicBody)
    bd.set_position(this.initialPosition)
    bd.set_angle(this.initialAngle)
    this.body = world.CreateBody(bd)

    this.deathPts = ptIdxs.map((idx) => creaturePts[idx].deathPt)

    for (let i = 0; i < 2; i++) {
      const shape = new b2.b2CircleShape()
      shape.set_m_radius(r * metersPerPixel)
      let x = -0.5 * l * metersPerPixel
      if (i == 0) {
        x *= -1
      }
      shape.set_m_p(new b2.b2Vec2(x, 0))
      const fd = new b2.b2FixtureDef()
      fd.set_shape(shape)
      fd.set_density(1.0)
      fd.set_friction(friction)
      fd.set_restitution(restitution)
      const filter = fd.get_filter()
      filter.set_categoryBits(0x0002)
      filter.set_maskBits(0x0001)
      fd.set_filter(filter)
      this.body.CreateFixture(fd)
    }

    const shape = new b2.b2PolygonShape()
    shape.SetAsBox((0.5 * l - r) * metersPerPixel, 0.3 * r * metersPerPixel)
    // shape.set_m_p(new b2.b2Vec2(0, 0))
    const fd = new b2.b2FixtureDef()
    fd.set_shape(shape)
    fd.set_density(1.0)
    fd.set_friction(friction)
    fd.set_restitution(restitution)
    const filter = fd.get_filter()
    filter.set_categoryBits(0x0000)
    // filter.set_categoryBits(0x0002)
    // filter.set_maskBits(0x0001)
    fd.set_filter(filter)
    this.body.CreateFixture(fd)
  }

  // get touching() {
  // return this.bodies.map((body) => {
  // const contact = body.GetContactList()
  // return this.body.GetContactList().get_contact().IsTouching() ? 1 : 0
  // })
  // }

  reset() {
    this.body.SetTransform(this.initialPosition, this.initialAngle)
    this.body.SetLinearVelocity(new b2.b2Vec2(0, 0))
    this.body.SetAngularVelocity(0)
  }

  show() {
    const pos = this.body.GetPosition(),
      x = pos.get_x() * pixelsPerMeter,
      y = -pos.get_y() * pixelsPerMeter,
      a = -this.body.GetAngle()
    this.sprite.position.set(x, y)
    this.sprite.rotation = a
  }
}
