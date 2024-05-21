const tf = require('@tensorflow/tfjs-node');
 
async function loadModel() {
    const modelUrl = "https://storage.googleapis.com/mencoba-01/submissions-model/model.json";
    return tf.loadGraphModel(modelUrl);
}
 
module.exports = loadModel;