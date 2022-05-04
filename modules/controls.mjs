import { renderer } from "./display/renderer.mjs"
// import { stage } from "./display/display.mjs"
import { r, highlightBuffer } from "./globals.mjs"
import {
  updateCreatureViz,
  updateSelectedToMouse,
  updateHotdogs,
} from "./display/points.mjs"
import { resetOffset } from "../main.mjs"
import { addCreatures, population } from "./creature/population.mjs"

const canvas = renderer.view,
  canvasRect = canvas.getBoundingClientRect(),
  canvasL = canvasRect.left,
  canvasT = canvasRect.top
const playBtn = document.getElementById("play"),
  // mutMagSlider = document.getElementById("mut-mag-slider"),
  // mutMagValP = document.getElementById("mut-mag-val-p"),
  // mutFreqSlider = document.getElementById("mut-freq-slider"),
  // mutFreqValP = document.getElementById("mut-freq-val-p"),
  epLenInput = document.getElementById("ep-len-input")
  // selRatioSlider = document.getElementById("sel-ratio-input"),
  // selRatioValP = document.getElementById("sel-ratio-val-p")

export let epLength = 500
// mutationMag,
//   mutationFreq,
  
  // selectionRatio = parseFloat(selRatioSlider.value),
  // nSelected = Math.ceil(selectionRatio * nCreatures)
// const deathPtCheckbox = document.getElementById("dead-pt-check")

// updateMutMagSlider()
// updateMutFreqSlider()
updateEpLenInput()
// updateSelRatioSlider()
// mutMagSlider.oninput = updateMutMagSlider
// mutFreqSlider.oninput = updateMutFreqSlider
epLenInput.onchange = updateEpLenInput
// selRatioSlider.oninput = updateSelRatioSlider

export let playing = false

export let mousePos = [null, null],
  highlightedIdx = null,
  selectedIdx = null,
  overSelected = false,
  alreadyHotdog = false,
  highlightedHotdog = null,
  selectedHotdog = null,
  dragging = false,
  mouseDownPos = [null, null],
  pointsDragged = [],
  nPointsChanged = false,
  deathPtsChanged = false

export let moveDir = 0

export let creaturePts = []
let creaturePtsLen = creaturePts.length
let creaturePtsCopy = []
export let hotdogs = []

// export const creatures = []

canvas.onmousemove = (e) => {
  if (playing) return

  updateMouse(e)
  if (dragging) {
    if (selectedIdx != null && overSelected) {
      // creaturePts[selectedIdx] = creaturePtsCopy[selectedIdx].map(
      //   (coord, i) => coord + mousePos[i] - mouseDownPos[i]
      // )
      for (let xy of ["x", "y"]) {
        creaturePts[selectedIdx].pos[xy] =
          creaturePtsCopy[selectedIdx].pos[xy] + mousePos[xy] - mouseDownPos[xy]
      }
      pointsDragged = [selectedIdx]
    } else if (selectedHotdog != null) {
      for (let idx of hotdogs[selectedHotdog]) {
        // creaturePts[idx] = creaturePtsCopy[idx].map(
        //   (coord, i) => coord + mousePos[i] - mouseDownPos[i]
        // )
        for (let xy of ["x", "y"]) {
          creaturePts[idx].pos[xy] =
            creaturePtsCopy[idx].pos[xy] + mousePos[xy] - mouseDownPos[xy]
        }
        pointsDragged.push(idx)
      }
    }
  }
  checkInteraction()
}
canvas.onmouseleave = (e) => {
  if (playing) return

  // mousePos = [null, null]
  mousePos = { x: null, y: null }
  checkInteraction()
}
canvas.onmousedown = (e) => {
  if (playing) return

  if (highlightedHotdog == null && !overSelected) {
    // create points and hotdogs
    selectedHotdog = null
    if (highlightedIdx == null) {
      // ADD POINT
      // creaturePts.push(mousePos.slice())
      creaturePts.push({ pos: Object.assign({}, mousePos), deathPt: false })
      if (selectedIdx != null) {
        hotdogs.push([selectedIdx, creaturePts.length - 1])
      }
      selectedIdx = creaturePts.length - 1
    } else {
      if (!alreadyHotdog && selectedIdx != null) {
        hotdogs.push([selectedIdx, highlightedIdx])
      }
      selectedIdx = highlightedIdx
    }
  } else if (highlightedHotdog != null) {
    // select hotdog
    selectedIdx = null
    selectedHotdog = highlightedHotdog
    highlightedHotdog = null
  }
  dragging = true
  // mouseDownPos = mousePos.slice()
  mouseDownPos = Object.assign({}, mousePos)
  creaturePtsCopy = creaturePts.map((pt) => {
    return { pos: { x: pt.pos.x, y: pt.pos.y }, deathPt: pt.deathPt }
  })
  checkInteraction()
}
canvas.onmouseup = () => {
  dragging = false
  checkInteraction()
}

document.onkeydown = (e) => {
  if (e.code == "Backspace") {
    if (selectedIdx != null) {
      for (let i = hotdogs.length - 1; i >= 0; i--) {
        // delete hotdogs attached to selected pt
        if (hotdogs[i].includes(selectedIdx)) {
          hotdogs.splice(i, 1)
          continue
        }
        for (let j = 0; j < hotdogs[i].length; j++) {
          if (hotdogs[i][j] > selectedIdx) hotdogs[i][j]--
        }
      }
      // DELETE POINT
      creaturePts.splice(selectedIdx, 1)
      selectedIdx = null
    } else if (selectedHotdog != null) {
      hotdogs.splice(selectedHotdog, 1)
      selectedHotdog = null
    }
  } else if (e.code == "Escape") {
    selectedIdx = null
    selectedHotdog = null
  } else if (playing) {
    if (e.code == "ArrowRight") {
      moveDir = -1
    } else if (e.code == "ArrowLeft") {
      moveDir = 1
    }
  }
  checkInteraction()
}
document.onkeyup = (e) => {
  if (["ArrowRight", "ArrowLeft"].includes(e.code)) {
    moveDir = 0
  }
}

playBtn.onclick = async () => {
  selectedIdx = null
  highlightedIdx = null
  selectedHotdog = null
  highlightedHotdog = null
  if (playing) {
    await population.reset()
    resetOffset()
  } else {
    if (population == null) {
      addCreatures()
    }
  }
  // if (!playing) {
  //   createCreatures(popSize)
  // } else {
  //   clearCreatures()
  //   agentWorker.postMessage({ nnReady: false })
  //   loop()
  // }
  playing = !playing
  playBtn.innerHTML = playing ? "Reset" : "Play"
  checkInteraction()
}

// deathPtCheckbox.oninput = () => {
//   if (selectedIdx == null) {
//     return
//   }
//   deathPtsChanged = true
//   creaturePts[selectedIdx].deathPt = deathPtCheckbox.checked
//   checkInteraction()
// }

function checkInteraction() {
  if (playing) return

  highlightedIdx = null
  overSelected = false
  for (let i = 0; i < creaturePts.length; i++) {
    const pos = creaturePts[i].pos
    if (
      (pos.x - mousePos.x) ** 2 + (pos.y - mousePos.y) ** 2 <
      highlightBuffer * r ** 2
    ) {
      selectedIdx == i ? (overSelected = true) : (highlightedIdx = i)
    }
  }
  alreadyHotdog = !hotdogs.every(
    (hotdog) =>
      !hotdog.includes(selectedIdx) || !hotdog.includes(highlightedIdx)
  )
  highlightedHotdog = null
  if (highlightedIdx == null && !overSelected) {
    for (let i = 0; i < hotdogs.length; i++) {
      const hotdog = hotdogs[i],
        d2 = distToSegmentSquared(
          mousePos,
          creaturePts[hotdog[0]].pos,
          creaturePts[hotdog[1]].pos
        )
      if (d2 < r ** 2 && selectedHotdog != i) {
        highlightedHotdog = i
      }
    }
  }
  updateSelectedToMouse()

  if (creaturePtsLen != creaturePts.length) {
    nPointsChanged = true
    creaturePtsLen = creaturePts.length
  }
  updateCreatureViz()

  pointsDragged = []
  nPointsChanged = false
  // deathPtsChanged = false
  updateHotdogs()

  // const ptSelected = selectedIdx == null ? false : true
  // deathPtCheckbox.disabled = !ptSelected
  // deathPtCheckbox.checked = ptSelected
  //   ? creaturePts[selectedIdx].deathPt
  //   : false
}

function updateMouse(e) {
  mousePos = { x: e.clientX - canvasL, y: e.clientY - canvasT }
}

// function updateMutMagSlider() {
//   mutationMag = parseFloat(mutMagSlider.value) ** 2
//   mutMagValP.innerHTML = mutationMag.toFixed(4)
// }

// function updateMutFreqSlider() {
//   mutationFreq = parseFloat(mutFreqSlider.value)
//   mutFreqValP.innerHTML = mutationFreq.toFixed(3)
// }

// function updateSelRatioSlider() {
//   selectionRatio = parseFloat(selRatioSlider.value)
//   nSelected = Math.ceil(selectionRatio * nCreatures)
//   selRatioValP.innerHTML = nSelected
// }

function updateEpLenInput() {
  if (!isNaN(epLenInput.value) && parseInt(epLenInput.value) > 0) {
    epLength = parseInt(epLenInput.value)
  } else {
    epLenInput.value = epLength
  }
}

// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
const sqr = (x) => x * x
const dist2 = (v, w) => sqr(v.x - w.x) + sqr(v.y - w.y)
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w)
  if (l2 == 0) return dist2(p, v)
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
  t = Math.max(0, Math.min(1, t))
  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) })
}
