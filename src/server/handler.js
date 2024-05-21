// handler.js

const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData'); // Pastikan path ini benar
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": Firestore.Timestamp.fromDate(new Date(createdAt)) // Simpan sebagai Timestamp
  };

  // Gunakan fungsi storeData untuk menyimpan data ke Firestore
  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  });
  
  response.code(201);
  return response;
}

async function getPredictHistoriesHandler(request, h) {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  const snapshots = await predictCollection.get();

  const histories = [];
  snapshots.forEach((doc) => {
    const data = doc.data();
    histories.push({
      id: doc.id,
      history: {
        result: data.result,
        createdAt: data.createdAt instanceof Firestore.Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt, // Periksa tipe data
        suggestion: data.suggestion,
        id: doc.id,
      }
    });
  });

  return {
    status: 'success',
    data: histories,
  };
}

module.exports = { postPredictHandler, getPredictHistoriesHandler };
