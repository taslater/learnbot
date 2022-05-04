import {
  timeStep,
  velocityIterations,
  positionIterations,
  metersPerPixel,
  w,
  h,
  friction,
} from "./globals.mjs"
import { groundTop } from "./display/ground.mjs"
import { population } from "./creature/population.mjs"

const gravity = new b2.b2Vec2(0, -9.81)
export const world = new b2.b2World(gravity)
world.SetAllowSleeping(false)

const ground_bd = new b2.b2BodyDef()
// ground_bd.set_position(
//   new b2.b2Vec2(0.5 * w * metersPerPixel, -groundTop * metersPerPixel)
// )
ground_bd.set_position(
  new b2.b2Vec2(
    0.5 * w * metersPerPixel,
    -(groundTop + 0.5 * (h - groundTop)) * metersPerPixel
  )
)
const ground_body = world.CreateBody(ground_bd)
// const ground_shape = new b2.b2EdgeShape()
// ground_shape.Set(
//   new b2.b2Vec2(-1000 * w * metersPerPixel, 0),
//   new b2.b2Vec2(1000 * w * metersPerPixel, 0)
// )
const ground_shape = new b2.b2PolygonShape()
ground_shape.SetAsBox(
  1000 * w * metersPerPixel,
  0.5 * (h - groundTop) * metersPerPixel
)
const ground_fd = new b2.b2FixtureDef()
ground_fd.set_shape(ground_shape)
ground_fd.set_density(0.0)
ground_fd.set_friction(friction)
ground_body.CreateFixture(ground_fd)

export async function worldStep() {
  if (population.ready) {
    await population.update()
    world.Step(timeStep, velocityIterations, positionIterations)
  }
}
