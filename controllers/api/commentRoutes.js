const router = require('express').Router();
const session = require('express-session');
const { Comment, Blog } = require('../../models');
const { belongsTo, beforeBulkDestroy } = require('../../models/User');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  console.log(req)
  try {
    const newComment = await Comment.create({
     
      ...req.body,
      user_id: req.session.user_id,
      
    })
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
