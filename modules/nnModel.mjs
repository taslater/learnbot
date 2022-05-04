import { nnInfo } from "./globals.mjs"

export function nnModel(nInputs, nOutputs) {
  const model = tf.sequential()
  // model.add(tf.layers.layerNormalization({ inputShape: [nInputs] }))
  model.add(
    tf.layers.dense({
      units: nnInfo.widths[0],
      inputShape: [nInputs],
      // activation: "LeakyReLU",
      // activation: "tanh",
      // activation: "elu",
      activation: nnInfo.activation,
    })
  )
  // model.add(tf.layers.layerNormalization())
  // model.add(tf.layers.leakyReLU())
  for (let width of nnInfo.widths.slice(1)) {
    model.add(
      tf.layers.dense({
        units: width,
        // activation: "LeakyReLU",
        // activation: "tanh",
        // activation: "elu",
        activation: nnInfo.activation,
      })
    )
    // model.add(tf.layers.leakyReLU())
  }
  // model.add(tf.layers.dense({ units: nOutputs, activation: "tanh" }))
  model.add(tf.layers.dense({ units: nOutputs, activation: "linear" }))
  return model
}
