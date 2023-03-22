const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { GroupImage, Group, Venue, Event, Membership} = require('../../db/models');


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

const addContextToGroup = async (group) =>{
    let count = await Membership.count({where:{groupId:group.id}});
    group.numMembers = count;
    let preview = await GroupImage.findOne({where:{preview:true}});
    group.previewImage = preview.url;
    return group;
}


const noGroupFound = (group) => {
    if(!group){
        throw new Error("no such group found");
    }
}

//get all groups
router.get(
    '/',
    async (req, res,) => {
        let allGroups = await Group.findAll({raw: true});
        let newGroups = [];

        //need to use the below method to encapsulate async func: TOO MANY ASYNC FUNC IN ITTERABLE
        // let result = await Promise.all(
        //     products.map(async (product) => {
        //       const productId = await getProductId(product);
        //       console.log(productId);

        //       const capitalizedId = await capitalizeId(productId)
        //       console.log(capitalizedId);
        //     })
        //   )
        Promise.all(
            newGroups = allGroups.map(async (data) =>{
                let newEle = await addContextToGroup(data);
                console.log('bbbbbbbbbbb',newEle)
                return newEle;
            })
        ).then(data => {;});
        res.json(newGroups)
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
        noGroupFound(group);
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
    requireAuth,
    async (req,res,next) => {
        let user = getCurrentUser(req);
        let groupList = await Group.findAll({where: {organizerId: user.id}});
        groupList.forEach(async ele => {
            ele = addContextToGroup(ele);
        });
        res.json(groupList);
    }
);

//get specific group description by id
router.get(
    '/:id',
    async (req,res,next) => {
        let groupDesc = await Group.findOne({where:{id:req.params.id}});

        res.json(groupDesc.about);
    }
);

//edit group by id
router.put(
    '/:id',
    async (req,res,next) => {
        let {name,about,type,private,city,state} = req.body;
        let group = await Group.findOne({where: {id: req.params.id}});

        noGroupFound(group);

       group.set(
            {name,about,type,private,city,state}
        );
        await group.save();
        res.json(group);
    }
);



//VENUES

//create new venue
router.post(
    '/:id/venues',
    async (req,res,next) => {
        let {address, city, state, lat, lng} = req.body;

        let group = await Group.findOne({where: {id:req.params.id}});

        noGroupFound(group);

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
        let {groupId, venueId, name, type, capacity, price, description, tartDate, endDate} = req.body;

        let group = await Group.findOne({where: {id:req.params.id}});

        noGroupFound(group);

        let newEvent = await Event.create({groupId: req.params.id, venueId, name, type, capacity, price, description, tartDate, endDate});

        res.json(newEvent);

    }
);

//get events by id
router.get(
    '/:id/events',
    async (req,res) => {
        let group = await Group.findOne({where:{id:req.params.id}});

        noGroupFound(group);

        let allEventsById = await Event.findAll({where:{groupId: group.id}});
        res.json(allEventsById);
    }
);

//request membership
router.post(
    '/:id/membership',
    async (req, res)=>{
        let currentUser = getCurrentUser(req);

        let group = await Group.findOne({where:{id:req.params.id}});
        noGroupFound(group);

        let newMembership = await Membership.create({
            groupId: group.id,
            userId: currentUser.id,
        })
        res.json(newMembership);
    }
);
//change membership status
router.put(
    '/:id/membership',
    async (req, res) =>{
        let {memberId, status} = req.body;
        console.log(memberId)
        let targetMembership = await Membership.findOne({where:{groupId: req.params.id, userId: memberId}});
        if(!targetMembership) throw new Error("no such membership found.");
        targetMembership.set({status: status});
        await targetMembership.save();
        res.json(targetMembership);
    }
);
//get member list
router.get(
    '/:id/members',
    async (req, res) => {
        let groupId = req.params.id;
        let group = await Group.findOne({where:{id: groupId}});
        noGroupFound(group);

        let memberList = await Membership.findAll({where:{groupId}});

        res.json(memberList);
    }
)

router.delete(
    '/:id/membership',
    async (req,res) => {

        let currentUser = getCurrentUser(req);
        let membership = await Membership.findOne({where:{groupId:req.params.id,userId:currentUser.id}});
        if(!membership){
            throw new Error("no such membership found");
        }
        await membership.destroy();
        res.json("deleted");
    }
)

router.delete(
    '/:id',
    async (req,res) => {
        let group = await Group.findOne({where:{id:req.params.id}});
          noGroupFound(group);
          await group.destroy();
          res.json("deleted");
    }
)



module.exports = router;
