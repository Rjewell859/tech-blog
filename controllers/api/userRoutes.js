const router = require('express').Router();
const {
  User
} = require('../../models');

// POST route for creating a user when signing up

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// POST route for logging in to a user account

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        user_name: req.body.user_name
      }
    });

    // If the user data is not found

    if (!userData) {
      res
        .status(400)
        .json({
          message: 'Incorrect user name or password, please try again'
        });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    // If the password is not valid based on the method call on the previous line

    if (!validPassword) {
      res
        .status(400)
        .json({
          message: 'Incorrect user name or password, please try again'
        });
      return;
    }
    // Saves logged in user_id and login status to the session

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({
        user: userData,
        message: 'You are now logged in!'
      });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// POST route for logging a user out

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;