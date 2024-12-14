const { db, admin } = require('../services/firebaseConfig');
const axios = require('axios');


const saveDiskusi = async (req, res) => {
  const { name, isiDiskusi } = req.body;

  if (!name || !isiDiskusi) {
    return res.status(400).send({ message: 'Nama dan Isi Diskusi harus diisi' });
  }

  try {
    // Query the "users" collection by the "name" field
    const userQuerySnapshot = await db.collection('users').where('name', '==', name).get();
    if (userQuerySnapshot.empty) {
      return res.status(404).send({ message: 'User tidak ditemukan' });
    }

    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();
    const username = userData.name; // Use the "name" field as the username

    // Debugging information
    console.log('User Document:', userData);

    const data = {
      text: isiDiskusi
    };

    // Call the external API for emotion prediction
    const emotionApiUrl = 'https://api-model-curhatku-92381090063.asia-southeast2.run.app/predict'; 
    const emotionResponse = await axios.post(emotionApiUrl, data);
    
    // Ambil hasil prediksi emosi dari API response
    const predictedEmotion = emotionResponse.data.emotion;  // Sesuaikan dengan struktur data API

    // Generate a unique ID for the discussion
    const newDiskusiRef = db.collection('diskusi').doc();
    const newDiskusiId = newDiskusiRef.id;

    // Save the discussion along with the predicted emotion
    await newDiskusiRef.set({
      id: newDiskusiId,
      username: username,
      isiDiskusi: isiDiskusi,
      predictedEmotion: predictedEmotion,  // Simpan prediksi emosi
      tanggal: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).send({ message: 'Diskusi berhasil disimpan', id: newDiskusiId });
  } catch (error) {
    console.error('Error saving discussion:', error);
    res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
  }
};

const getAllDiskusi = async (req, res) => {
  try {
    const snapshot = await db.collection('diskusi').get();
    const diskusiList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(diskusiList);
  } catch (error) {
    console.error('Error getting discussions:', error);
    res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
  }
};

const deleteDiskusi = async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('diskusi').doc(id).delete();
    res.status(200).send({ message: 'Diskusi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
  }
};

module.exports = {
  saveDiskusi,
  getAllDiskusi,
  deleteDiskusi
};