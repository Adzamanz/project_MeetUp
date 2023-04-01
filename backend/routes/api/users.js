const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

  router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      let errorArr = [];
      if(!firstName)errorArr.push("firstName must be filled out");
      if(!lastName)errorArr.push("lastName must be filled out");
      if(!email)errorArr.push("email must be filled out");
      if(errorArr.length){
        let err = new Error("Validation Error");
        err.status = 400;
        err.errors = errorArr;
      }

      const user = await User.signup({ firstName, lastName, email, username, password });

      let userB = user;

      userB.dataValues.token = await setTokenCookie(res, user);

      return res.json(user);
    }
  );


module.exports = router;
