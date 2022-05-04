importScripts("./cma_worker_lib.js")

let cma

onmessage = (e) => {
  const msg = e.data
  if (msg.hasOwnProperty("initMean")) {
    console.log("Initializing CMA")
    cma = new CMA(msg["initMean"].slice(), 2, 1, undefined)
    postMessage({ nCreatures: cma.popsize })
    const initWts = getWeights(cma)
    postMessage({ initWts })
  } else if (msg.hasOwnProperty("sol_score_array")) {
    const sol_score_array = msg["sol_score_array"]
    // for (let sol_score of sol_score_array) {
    //   console.log("solution")
    //   console.log(sol_score['solution'].slice(0,10))
    // }
    cma.tell(sol_score_array)
    const newWts = getWeights(cma)
    // console.log("new solution")
    // console.log(newWts[0].slice(0,10))
    postMessage({ newWts })
  }
}

function getWeights(cma) {
  const wts = []
  for (let i = 0; i < cma.popsize; i++) {
    const solution = cma.ask()
    wts.push(solution)
  }
  return wts
}
