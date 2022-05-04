import { w, h } from "../globals.mjs"
const blue = 0x87ceeb
// export const w = 1000,
//   h = 600

PIXI.settings.RESOLUTION = window.devicePixelRatio

export const renderer = PIXI.autoDetectRenderer({
  width: w,
  height: h,
  backgroundColor: blue,
  // antialias: true,
  // resolution: 1,
  // autoDensity: true,
  autoResize: true
})

// renderer.view.style.position = "absolute"
// renderer.view.style.display = "block"

const renderDiv = document.getElementById("render-div")
renderDiv.appendChild(renderer.view)
