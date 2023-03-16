const express = require('express')
const router = express.Router();

//i think most of these are unused
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { GroupImage } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth');
const { Group } = require('../../db/models');
const { ParameterStatusMessage } = require('pg-protocol/dist/messages');

//get all groups
router.get(
    '/',
    async (req, res,) => {
        let allGroups = await Group.findAll();
        res.json(allGroups)
    }
)
//create new group

router.post(
    '/',
    async (req, res,) => {
        //this snippet comes from api/users for get current user
        const { user } = req;
        let current;
        if (user) {
            current = user.toSafeObject();
        } else current = null;
        //end of snippet

        let organizerId = current.id;
        let {name, about, type, private, city, state} = req.body;
        let unit = {organizerId, name, about, type, private, city, state}
        let newGroup = await Group.create(unit)
        res.json(newGroup)
    }
);

router.post(
    '/:id/images',
    async (req, res,) => {
        let {url, preview} = req.body;
        let newGroupImage = await GroupImage.create(
            {
                groupId: req.params.id,
                url,
                preview,
            }
        )
        let theThing = await GroupImage.scope('basic').findByPk(newGroupImage.id)
        res.json(theThing);
    }
)



module.exports = router;
