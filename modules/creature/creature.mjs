import {
  // r,
  // pixelsPerMeter,
  metersPerPixel,
  angleLim,
  maxTorque,
  // weldDampingRatio,
  // restitution,
  // friction,
  // nCreatures,
  // epLength,
  speedMag,
  timeStep,
  // mutationMag,
  // selectionRatio,
} from "../globals.mjs"
import { world } from "../world.mjs"
import {
  hotdogs,
  creaturePts,
  // mutationMag,
  // mutationFreq,
} from "../controls.mjs"
// import { stage } from "../display/display.mjs"
// import { renderer } from "../display/renderer.mjs"
import { nnModel } from "../nnModel.mjs"
// import { resetOffset } from "../../main.mjs"

import { Hotdog } from "./hotdog.mjs"

// const noiseStd = 0.001,
//   noiseDecay = 0.999

const inv_dt = 1 / timeStep

export class Creature {
  constructor(
    jointInfo,
    graphics,
    hotdogAngles,
    hotdogLengths,
    hotdogMidPts,
    hotdogTextures,
    flatWts
  ) {
    this.flatWts = flatWts.slice()
    // this.score = -Infinity
    this.score = 0
    // this.torqueSum = 1e-6
    // this.outputRanges = []
    // this.jointRanges = []
    this.initialMeanX = null
    // this.memory = { inputs: [], outputs: [] }
    this.graphicsContainer = new PIXI.Container()
    this.graphicsContainer.sortableChildren = true
    graphics.addChild(this.graphicsContainer)
    this.hotdogs = []
    this.joints = []
    this.brain = null
    this.motorNoise = null

    // const contactListenerTest = new b2.JSContactListener()
    // contactListenerTest.beginContact = () => console.log("hi")
    // console.log(contactListenerTest)

    for (let i = 0; i < hotdogs.length; i++) {
      const hotdog = new Hotdog(
        this.graphicsContainer,
        hotdogAngles,
        hotdogLengths,
        hotdogMidPts,
        hotdogTextures,
        i
      )
      this.hotdogs.push(hotdog)
    }

    for (let o of jointInfo) {
      const jd = new b2.b2RevoluteJointDef()
      const body0 = this.hotdogs[o.hotdogIdx0].body,
        body1 = this.hotdogs[o.hotdogIdx1].body,
        anchor = new b2.b2Vec2(
          creaturePts[o.ptIdx].pos.x * metersPerPixel,
          -creaturePts[o.ptIdx].pos.y * metersPerPixel
        )
      jd.Initialize(body0, body1, anchor)
      jd.set_enableLimit(true)
      jd.set_lowerAngle(-0.5 * angleLim)
      jd.set_upperAngle(0.5 * angleLim)
      jd.set_enableMotor(true)
      jd.set_maxMotorTorque(maxTorque)
      const joint = b2.castObject(world.CreateJoint(jd), b2.b2RevoluteJoint)
      this.joints.push(joint)
      // this.outputRanges.push([Infinity, -Infinity])
      // this.jointRanges.push([Infinity, -Infinity])
    }

    if (this.hotdogs.length > 0 && this.joints.length > 0) {
      this.brain = nnModel(
        // x, y positions and speeds
        8 * this.hotdogs.length + 6 * this.joints.length,
        this.joints.length
      )
      tf.tidy(() => {
        const wts = this.brain.getWeights()
        let flatWtIdx = 0
        for (let i = 0; i < wts.length; i++) {
          const wt = wts[i]
          const wtSize = wt.shape.reduce((a, b) => a * b, 1)
          wts[i] = tf.tensor(
            flatWts.slice(flatWtIdx, flatWtIdx + wtSize),
            wt.shape
          )
          flatWtIdx += wtSize
        }
        this.brain.setWeights(wts)
      })

      // this.motorNoise = tf.randomNormal([1, this.joints.length], 0, noiseStd)
    }
  }
  reset() {
    this.initialMeanX = null
    // this.score = -Infinity
    this.score = 0
    // this.torqueSum = 1e-6
    // this.memory = { inputs: [], outputs: [] }
    for (let i = 0; i < this.joints.length; i++) {
      this.joints[i].SetMotorSpeed(0)
      // this.outputRanges[i] = [Infinity, -Infinity]
      // this.jointRanges[i] = [Infinity, -Infinity]
    }
    for (let hotdog of this.hotdogs) {
      hotdog.reset()
    }
  }
  update(inputsMean, inputsStdInv) {
    let inputs = []
    let xs = []
    for (let i = 0; i < this.hotdogs.length; i++) {
      const body = this.hotdogs[i].body
      const pos = body.GetPosition(),
        x = pos.get_x(),
        y = pos.get_y()
      // this.bodySprites[i].position.set(x * pixelsPerMeter, -y * pixelsPerMeter)
      xs.push(x)
      const vel = body.GetLinearVelocity()
      const angle = body.GetAngle()
      inputs.push(
        y,
        vel.get_x(),
        vel.get_y(),
        body.GetAngularVelocity(),
        Math.sin(angle),
        Math.cos(angle),
        // // body.GetAngle() % (2 * Math.PI)
        body.GetInertia()
      )
    }

    let meanX = xs.reduce((a, b) => a + b) / xs.length
    if (this.initialMeanX == null) {
      this.initialMeanX = meanX
    }

    this.score = meanX - this.initialMeanX
    // this.score /= this.torqueSum

    inputs.push(...xs.map((x) => x - meanX))
    for (let i = 0; i < this.joints.length; i++) {
      // for (let joint of this.joints) {
      const joint = this.joints[i]
      const force = joint.GetReactionForce(inv_dt),
        fx = force.get_x(),
        fy = force.get_y()
      // console.log(joint.GetReactionTorque(60))
      const angle = joint.GetJointAngle()
      inputs.push(
        // joint.GetJointAngle() % (2 * Math.PI),
        Math.sin(angle),
        Math.cos(angle),
        joint.GetJointSpeed(),
        joint.GetReactionTorque(inv_dt),
        fx,
        fy
      )
      // this.jointRanges[i][0] = Math.min(
      //   joint.GetJointSpeed(),
      //   this.jointRanges[i][0]
      // )
      // this.jointRanges[i][1] = Math.max(
      //   joint.GetJointSpeed(),
      //   this.jointRanges[i][1]
      // )
    }
    const outputs = tf.tidy(() => {
      // const inputsNormed = inputs.slice()
      // for (let i = 0; i < inputsNormed.length; i++) {
      //   // inputsNormed[i] = (inputsNormed[i] - inputsMean[i]) * inputsStdInv[i]
      //   inputsNormed[i] -= inputsMean[i]
      // }
      return (
        this.brain
          .predict(tf.tensor(inputs.slice(), [1, inputs.length], "float32"))
          // .add(this.motorNoise)
          .dataSync()
      )
    })
    // this.memory.inputs.push(inputs.dataSync())
    // this.memory.outputs.push(outputs)
    for (let i = 0; i < outputs.length; i++) {
      this.joints[i].SetMotorSpeed(speedMag * outputs[i])
      // this.outputRanges[i][0] = Math.min(outputs[i], this.outputRanges[i][0])
      // this.outputRanges[i][1] = Math.max(outputs[i], this.outputRanges[i][1])
      // this.torqueSum += Math.abs(this.joints[i].GetMotorTorque(inv_dt))
    }
    // this.motorNoise = tf.tidy(() => {
    //   return this.motorNoise
    //     .mul(tf.scalar(noiseDecay))
    //     .add(tf.randomNormal(this.motorNoise.shape, 0, noiseStd, "float32"))
    // })
    return inputs.slice()
  }
  show(i) {
    this.graphicsContainer.zIndex = i
    for (let hotdog of this.hotdogs) {
      hotdog.show(i)
    }
  }
}
