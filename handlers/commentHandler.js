const { db, admin } = require('../services/firebaseConfig');

const saveComment = async (req, res) => {
  const { discussionId, name, comment } = req.body;

  if (!discussionId || !name || !comment) {
    return res.status(400).send({ message: 'Discussion ID, Name, dan Comment harus diisi' });
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

    // Generate a unique ID for the comment
    const newCommentRef = db.collection('diskusi').doc(discussionId).collection('comments').doc();
    const newCommentId = newCommentRef.id;

    // Save the comment
    await newCommentRef.set({
      id: newCommentId,
      username: username,
      comment: comment,
      tanggal: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).send({ message: 'Comment berhasil disimpan', id: newCommentId });
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
  }
};

const getAllComments = async (req, res) => {
  const { discussionId } = req.params;

  if (!discussionId) {
    return res.status(400).send({ message: 'Discussion ID harus diisi' });
  }

  try {
    const snapshot = await db.collection('diskusi').doc(discussionId).collection('comments').get();
    const commentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(commentsList);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
  }
};

module.exports = {
  saveComment,
  getAllComments
};