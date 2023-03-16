const express = require('express')
const router = express.Router();

const { GroupImage } = require('../../db/models');
const { Group } = require('../../db/models');

//i think most of these are unused
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
// const { setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth');
// const { ParameterStatusMessage } = require('pg-protocol/dist/messages');

const getCurrentUser = (req) => {
    //this snippet comes from api/users for get current user
    const { user } = req;
    let current;
    if (user) {
        current = user.toSafeObject();
    } else current = null;
    //end of snippet
    return current;
}

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
        let current = getCurrentUser(req);

        let organizerId = current.id;
        let {name, about, type, private, city, state} = req.body;
        let unit = {organizerId, name, about, type, private, city, state}
        let newGroup = await Group.create(unit)
        res.json(newGroup)
    }
);

router.post(
    '/:id/images',
    async (req, res, next) => {
        let {url, preview} = req.body;
        let group = await Group.findOne({where:{id: req.params.id}})
        if(!group){
            throw new Error("no such group found");
        }
        let newGroupImage = await GroupImage.create(
                {
                    groupId: group.id,
                    url,
                    preview,
                }
            );
        let theThing = await GroupImage.scope('basic').findByPk(newGroupImage.id)
        res.json(theThing);
    }
);

router.get(
    '/current',
    async (req,res,next) => {
        let user = getCurrentUser(req);
        let groupList = await Group.findAll({where: {organizerId: user.id}});
        res.send(groupList);
    }
);

router.get(
    '/:id',
    async (req,res,next) => {
        let groupDesc = await Group.findOne({where:{id:req.params.id}});
        res.send(groupDesc.about);
    }
);

router.put(
    '/:id',
    async (req,res,next) => {
        let {name,about,type,private,city,state} = req.body;
        let group = await Group.findOne({where: {id:req.params.id}});

        if(!group){
            throw new Error("no such group found");
        }

        group.set(
            {name,about,type,private,city,state}
        );
        await group.save();
        res.send(group);
    }
);

//VENUES

router.post(
    '/:id/venues',
    async (req,res,next) => {
        let {address, city, state, lat, lng} = req.body;
        
    }
)




module.exports = router;
