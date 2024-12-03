const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const { Firestore } = require("@google-cloud/firestore");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion, confidenceScore } = await predictClassification(
    model,
    image
  );

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  // Coba menyimpan data ke Firestore
  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
}

// Mengambil riwayat prediksi dari Firestore
async function getHistoriesHandler(request, h) {
  const db = new Firestore();
  const predictionsCollection = db.collection("predictions");

  try {
    const snapshot = await predictionsCollection.get();
    const histories = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        history: {
          result: data.result,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
          id: data.id,
        },
      };
    });

    const response = h.response({
      status: "success",
      data: histories,
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Gagal mengambil data riwayat prediksi",
    });
    response.code(500);
    return response;
  }
}

module.exports = { postPredictHandler, getHistoriesHandler };
