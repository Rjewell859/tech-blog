const router = require('express').Router();
const { Comment, Blog } = require('../../models');
const withAuth = require('../../utils/auth');

// POST route for creating a comment

router.post('/', withAuth, async (req, res) => {
  console.log(req)
  try {
    const newComment = await Comment.create({
     include: [{model: Blog}],
      ...req.body,
      user_id: req.session.user_id,
      
    })
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE route for deleting a comment

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
