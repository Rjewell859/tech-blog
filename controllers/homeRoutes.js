const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET route for the homepage
router.get('/', async (req, res) => {
  try {
    // Find all blogs and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['user_name'],
        }, 
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for an individual blog by id

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['user_name'],
        }, {model: Comment},
      ],
    });

    const blog = blogData.get({ plain: true });
   
    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for an individual comment by id

router.get('/comment/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id)

    const comment = commentData.get({ plain: true });

    res.render('comment', {
      ...comment,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for user dasshboard which uses withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user by primary key using the session user id
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog },],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for login page

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  // If the user is not already logged in, render the login page
  res.render('login');
});

// GET route for the signup page

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

module.exports = router;
