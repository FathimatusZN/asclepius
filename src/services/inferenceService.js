const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);

    const score = await prediction.data();

    const cancerProbability = score[0]; // Probabilitas untuk kelas "Cancer"
    const threshold = 0.5;
    const label = cancerProbability > threshold ? "Cancer" : "Non-cancer";

    const confidenceScore = (cancerProbability * 100).toFixed(2); // Persentase kepercayaan
    let suggestion;

    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    if (error.message.includes("shape of dict")) {
      throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
    }
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
