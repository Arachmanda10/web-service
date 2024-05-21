const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();
        
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0]; // Karena Anda hanya memiliki satu output

        let label = "";
        let suggestion = "";
        
        // Menetapkan label dan saran berdasarkan rentang nilai
        if (confidenceScore > 0.5) {
            label = "Cancer";
            suggestion = "Segera periksa ke dokter!";
        } else {
            label = "Non-cancer";
            suggestion = "Anda Sehat!";
        }
 
        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}
 
module.exports = predictClassification;
