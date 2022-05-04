import {
  r,
  // pixelsPerMeter,
  // metersPerPixel,
  // angleLim,
  // maxTorque,
  // weldDampingRatio,
  // restitution,
  // friction,
  // nCreatures,
  // nBatches,
  // epLength,
  // speedMag,
  // selectionRatio,
} from "../globals.mjs"
// import { world } from "../world.mjs"
import {
  creaturePts,
  hotdogs,
  // mutationMag,
  // mutationFreq,
  epLength,
  // selectionRatio,
  // nSelected,
} from "../controls.mjs"
import { stage } from "../display/display.mjs"
import { renderer } from "../display/renderer.mjs"
import { nnModel } from "../nnModel.mjs"
import { resetOffset } from "../../main.mjs"

import { Creature } from "./creature.mjs"

export let population = null

const VARIANCE_EPS = Math.sqrt(Number.EPSILON)

class Population {
  constructor() {
    this.ready = false
    this.nCreatures
    this.initWts
    this.cma_worker = new Worker("./modules/creature/cma_worker.js")
    this.cma_worker.onmessage = (e) => {
      const msg = e.data
      if (msg.hasOwnProperty("nCreatures")) {
        this.nCreatures = msg["nCreatures"]
      } else if (msg.hasOwnProperty("initWts")) {
        this.initWts = msg["initWts"]
        for (let i = 0; i < this.nCreatures; i++) {
          setTimeout(() => {
            this.creatures.push(
              new Creature(
                this.jointInfo,
                this.graphics,

                this.hotdogAngles,
                this.hotdogLengths,
                this.hotdogMidPts,
                this.hotdogTextures,

                this.initWts[i]
              )
            )
          }, 0)
        }
        this.ready = true
      } else if (msg.hasOwnProperty("newWts")) {
        console.log("Got new weights!")
        const newWts = msg["newWts"]

        for (let i = 0; i < this.nCreatures; i++) {
          this.creatures[i].flatWts = newWts[i].slice()
          tf.tidy(() => {
            const wts = this.creatures[i].brain.getWeights()
            let flatWtIdx = 0
            for (let j = 0; j < wts.length; j++) {
              const wt = wts[j]
              const wtSize = wt.shape.reduce((a, b) => a * b, 1)
              wts[j] = tf.tensor(
                newWts[i].slice(flatWtIdx, flatWtIdx + wtSize),
                wt.shape
              )
              flatWtIdx += wtSize
            }
            this.creatures[i].brain.setWeights(wts)
          })
        }
        this.getReady()
      }
    }

    this.graphics = new PIXI.Container()
    this.graphics.sortableChildren = true
    stage.addChild(this.graphics)
    this.hotdogTextures = []
    this.hotdogAngles = []
    this.hotdogLengths = []
    this.hotdogMidPts = []
    this.jointInfo = []
    this.creatures = []
    this.epStep = 0
    const idxHotdogMap = {}
    for (let i = 0; i < hotdogs.length; i++) {
      const hotdog = hotdogs[i],
        x0 = creaturePts[hotdog[0]].pos.x,
        x1 = creaturePts[hotdog[1]].pos.x,
        y0 = creaturePts[hotdog[0]].pos.y,
        y1 = creaturePts[hotdog[1]].pos.y,
        a = Math.atan2(y0 - y1, x0 - x1),
        l = Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2),
        midPt = { x: 0.5 * (x0 + x1), y: 0.5 * (y0 + y1) }
      this.hotdogAngles.push(a)
      this.hotdogLengths.push(l)
      this.hotdogMidPts.push(midPt)
      this.hotdogTextures.push(
        hotdogTexture(
          l,
          creaturePts[hotdog[0]].deathPt,
          creaturePts[hotdog[1]].deathPt
        )
      )
      for (let ptIdx of hotdogs[i]) {
        if (!idxHotdogMap.hasOwnProperty(ptIdx)) {
          idxHotdogMap[ptIdx] = []
        }
        idxHotdogMap[ptIdx].push(i)
      }
    }
    for (let [ptIdx, hotdogIdxs] of Object.entries(idxHotdogMap)) {
      if (hotdogIdxs.length < 2) {
        continue
      }
      ptIdx = parseInt(ptIdx)
      for (let i = 0; i < hotdogIdxs.length - 1; i++) {
        const hotdogIdx0 = hotdogIdxs[i],
          hotdogIdx1 = hotdogIdxs[i + 1]
        this.jointInfo.push({
          ptIdx,
          hotdogIdx0,
          hotdogIdx1,
        })
      }
    }

    this.nInputs = 8 * hotdogs.length + 6 * this.jointInfo.length
    let randWts = nnModel(this.nInputs, this.jointInfo.length).getWeights()
    let initMean = []
    for (let wt of randWts) {
      initMean = initMean.concat(Array.from(wt.dataSync()))
    }
    this.cma_worker.postMessage({ initMean })
    this.steps = 0
    this.inputsHistory = []
    this.inputsMean = Array(this.nInputs).fill(0)
    this.inputsVar = Array(this.nInputs).fill(1)
    this.inputsStdInv = Array(this.nInputs).fill(0.1)

    // this.batch = 0
    // this.batchDisplay = document.getElementById("batch-p")
    // this.batchDisplay.innerHTML = this.batch

    this.epochs = 0
    this.epochDisplay = document.getElementById("epoch-span")
    this.epochDisplay.innerHTML = this.epochs
    this.bestScoreDisplay = document.getElementById("best-score-span")
    this.cutoffBestScoreDisplay = document.getElementById(
      "cutoff-best-score-span"
    )
    this.meanBestScoreDisplay = document.getElementById("mean-best-score-span")
    this.worstBestScoreDisplay = document.getElementById(
      "worst-best-score-span"
    )
    this.getReady()
    this.epochs = 0
  }

  getReady() {
    for (let creature of this.creatures) {
      creature.reset()
    }
    resetOffset()
    this.epStep = 0
    this.epochs++
    this.epochDisplay.innerHTML = this.epochs
    this.ready = true
  }

  updateInputStats() {
    let startIdx = 0
    if (this.steps == 0) {
      this.steps++
      for (let i = 0; i < this.nInputs; i++) {
        this.inputsMean[i] = this.inputsHistory[i]
        this.inputsVar[i] = 0
      }
      startIdx = this.nInputs
    }
    for (let i = startIdx; i < this.inputsHistory.length; i += this.nInputs) {
      if (this.steps < Number.MAX_SAFE_INTEGER) {
        this.steps++
      }
      for (let j = 0; j < this.nInputs; j++) {
        const newX = this.inputsHistory[i + j],
          currMean = this.inputsMean[j],
          currVar = this.inputsVar[j],
          newMean = onlineMean(currMean, newX, this.steps)
        this.inputsMean[j] = newMean
        this.inputsVar[j] = onlineVar(currVar, currMean, newMean, newX)
      }
    }
    for (let i = 0; i < this.nInputs; i++) {
      const variance = this.inputsVar[i]
      this.inputsStdInv[i] =
        variance > VARIANCE_EPS ? 4 / Math.sqrt(variance) : 1
    }
    // console.log(this.inputsStdInv.slice())
    this.inputsHistory = []
  }

  async reset() {
    this.ready = false
    // this.updateInputStats()

    // if (this.epochs == 0) {
    //   this.getReady()
    //   return
    // }

    const sol_score_array = []
    for (let i = 0; i < this.nCreatures; i++) {
      const creature = this.creatures[i]
      const solution = creature.flatWts.slice(),
        score = -1 * creature.score
      sol_score_array.push({ solution, score })
    }
    this.cma_worker.postMessage({ sol_score_array })
  }

  async update() {
    if (!this.ready) {
      return
    }
    this.epStep++
    if (this.epStep > epLength) {
      await this.reset()
    }
    for (let creature of this.creatures) {
      const inputs = creature.update(this.inputsMean, this.inputsStdInv)
      for (let i = 0; i < inputs.length; i++) {
        this.inputsHistory.push(inputs[i])
      }
    }
    this.creatures.sort((a, b) => b.score - a.score)
  }

  show() {
    for (let i = 0; i < this.nCreatures; i++) {
      const creature = this.creatures[i]
      creature.show(this.nCreatures - i)
    }
  }
}

function hotdogTexture(l) {
  const graphics = new PIXI.Graphics()
  // line between pts
  graphics.lineStyle(r + 2, 0x404040)
  graphics.moveTo(r + 1, r + 1)
  graphics.lineTo(r + 1 + l, r + 1)
  graphics.lineStyle(r, 0xfb9fa4)
  graphics.moveTo(r + 1, r + 1)
  graphics.lineTo(r + 1 + l, r + 1)
  // pt circles
  graphics.lineStyle(1, 0x404040)
  graphics.beginFill(0xffa024, 1)
  graphics.drawCircle(r + 1, r + 1, r)
  graphics.drawCircle(r + 1 + l, r + 1, r)
  graphics.endFill()

  const texture = PIXI.RenderTexture.create(
    graphics.width + 2,
    graphics.height + 2
  )
  renderer.render(graphics, texture)
  return texture
}

export function addCreatures() {
  population = new Population()
}

// https://datagenetics.com/blog/november22017/index.html
function onlineMean(currMean, newX, steps) {
  return currMean + (newX - currMean) / steps
}

function onlineVar(currVar, currMean, newMean, newX) {
  return currVar + (newX - currMean) * (newX - newMean)
}
