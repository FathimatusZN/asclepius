const { Firestore } = require("@google-cloud/firestore");

async function storeData(id, data) {
  const db = new Firestore();

  const predictCollection = db.collection("predictions");
  try {
    await predictCollection.doc(id).set(data);
    console.log("Data successfully saved to Firestore");
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
  }
}

module.exports = storeData;
