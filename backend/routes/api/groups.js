const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group } = require('../../db/models');

router.get(
    '/',
    async (req, res,) => {
        let allGroups = await Group.findAll();
        res.json(allGroups)
    }
)



module.exports = router;
