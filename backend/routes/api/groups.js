const express = require('express')
const router = express.Router();

const { GroupImage, Group, Venue, Event} = require('../../db/models');


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

//create new group image
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


//get all groups made by current user
router.get(
    '/current',
    async (req,res,next) => {
        let user = getCurrentUser(req);
        let groupList = await Group.findAll({where: {organizerId: user.id}});
        res.send(groupList);
    }
);

//get specific group by id
router.get(
    '/:id',
    async (req,res,next) => {
        let groupDesc = await Group.findOne({where:{id:req.params.id}});
        res.send(groupDesc.about);
    }
);

//edit group by id
router.put(
    '/:id',
    async (req,res,next) => {
        let {name,about,type,private,city,state} = req.body;
        let group = await Group.findOne({where: {id: req.params.id}});

        if(!group){
            throw new Error("no such group found");
        }

       await group.set(
            {name,about,type,private,city,state}
        );
        await group.save();
        res.send(group);
    }
);

//VENUES

//create new venue
router.post(
    '/:id/venues',
    async (req,res,next) => {
        let {address, city, state, lat, lng} = req.body;

        let group = await Group.findOne({where: {id:req.params.id}});

        if(!group){
            throw new Error("no such group found");
        }

        let newVenue = await Venue.create({
            groupId: group.id,
            address,
            city,
            state,
            lat,
            lng
        });

        res.json(newVenue);

    }
);

//get all venues by group id
router.get(
    '/:id/venues',
    async (req, res, next) => {
        let allVenuesByGroup = await Venue.findAll({where: {groupId: req.params.id}});

        res.json(allVenuesByGroup);

    }
);

//edit venue
//uh, the required path is url/venues, NOT url/group/venues, so i think this has to go in ./venues

//create event
router.post(
    '/:id/events',
    async (req,res) => {
        let { venueId, name, type, capacity, price, description, tartDate, endDate} = req.body;

        let group = await Group.findOne({where: {id:req.params.id}});

        if(!group){
            throw new Error("no such group found");
        }

        let newEvent = await Event.create({venueId, name, type, capacity, price, description, tartDate, endDate});

        res.json(newEvent);

    }
)





module.exports = router;
