const express = require('express');
const { saveComment, getAllComments } = require('../handlers/commentHandler');

const router = express.Router();

// Endpoint untuk menyimpan komentar
router.post('/', saveComment);

// Endpoint untuk mengambil semua komentar berdasarkan discussionId
router.get('/:discussionId', getAllComments);

module.exports = router;