const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/secrets')
const Users = require('../users/users-model.js');
const jwt = require('jsonwebtoken')

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = makeToken(user)

        res.status(200).json({
          message: `Welcome ${user.username} you are logged in !`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
});

function makeToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  } 
  const options = {
    expiresIn: '8h'
  }
  return jwt.sign(payload, jwtSecret, options)
}
module.exports = router;
