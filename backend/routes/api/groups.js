const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

const { GroupImage, Group, Venue, Event, Membership, User} = require('../../db/models');


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
    if(preview) group.previewImage = preview.url;
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

        let newGroups = await Group.findAll({raw: true});

        res.json(await Promise.all(newGroups.map((data) => addContextToGroup(data))));

    })
//create new group

router.post(
    '/',
    requireAuth,
    async (req, res,) => {
        let current = getCurrentUser(req);

        let organizerId = current.id;
        let {name, about, type, private, city, state} = req.body;

        if(name.length > 60) throw new Error("Name must be 60 characters or less");
        if(about.length < 50)throw new Error("About must be 50 characters or more");
        if(!(type == "Online" || type == "In-person")) throw new Error("Type must be 'Online' or 'In person'");
        if(typeof private != "boolean") throw new Error("Private must be a boolean");
        if(!city)throw new Error("City is required");
        if(!state)throw new Error("State is required");

        let unit = {organizerId, name, about, type, private, city, state}

        let newGroup = await Group.create(unit)
        res.json(newGroup)
    }
);

//create new group image
router.post(
    '/:id/images',
    requireAuth,
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
    async (req,res) => {
        let user = getCurrentUser(req);
        let groupList = await Group.findAll({where: {organizerId: user.id},raw: true});
        res.json(await Promise.all(groupList.map((data) => addContextToGroup(data))));

    }
);

//get specific group description by id
router.get(
    '/:id',
    async (req,res,next) => {
        let group = await Group.findOne({where:{id:req.params.id},include: [Venue,GroupImage], raw: true});

        group = await addContextToGroup(group);

        res.json(group);
    }
);

//edit group by id
router.put(
    '/:id',
    requireAuth,
    async (req,res,) => {
        let {name,about,type,private,city,state} = req.body;

        if(name.length > 60) throw new Error("Name must be 60 characters or less");
        if(about.length < 50)throw new Error("About must be 50 characters or more");
        if(!(type == "Online" || type == "In-person")) throw new Error("Type must be 'Online' or 'In person'");
        if(typeof private != "boolean") throw new Error("Private must be a boolean");
        if(!city)throw new Error("City is required");
        if(!state)throw new Error("State is required");

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
    requireAuth,
    async (req,res) => {
        let {address, city, state, lat, lng} = req.body;
        if(!address)throw new Error("Street address is required");
        if(!city)throw new Error("City is required");
        if(!state)throw new Error("State is required");
        if(lat > 90 || lat < -90) throw new Error("Latitude is not valid");
        if(lng > 180 || lng < -180)throw new Error("Longitude is not valid");

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

//create event by group id
router.post(
    '/:id/events',
    requireAuth,
    async (req,res) => {
        let {groupId, venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
        let currDate = new Date();
        let venue = await Venue.findOne({where: {id:venueId}});
        if(!venue) throw new Error("Venue does not exist") ;
        if(name.length < 5)throw new Error("Name must be at least 5 characters");
        if(!(type == "Online" || type == "In-person")) throw new Error("Type must be 'Online' or 'In-person'");
        if(capacity < 0)throw new Error( "Capacity must be an integer");
        if(price < 0)throw new Error("Price is invalid");
        if(!description) throw new Error("Description is required");
        if(!startDate || startDate < currDate) throw new Error("Start date must be in the future");
        if(!endDate || endDate < startDate)throw new Error("End date is less than start date");

        let group = await Group.findOne({where: {id:req.params.id}});

        noGroupFound(group);

        let newEvent = await Event.create({groupId: req.params.id, venueId, name, type, capacity, price, description, startDate, endDate});

        res.json(newEvent);

    }
);

//get events by id
router.get(
    '/:id/events',
    async (req,res) => {
        let group = await Group.findOne({where:{id:req.params.id}});

        noGroupFound(group);

        let allEventsById = await Event.findAll({where:{groupId: group.id}, include: [Group, Venue]});
        res.json(allEventsById);
    }
);

//request membership
router.post(
    '/:id/membership',
    requireAuth,
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
        if(status == "Pending")throw new Error("Cannot set status to Pending.");
        console.log(memberId)

        let targetUser = await User.findOne({where:{id: memberId}});
        if(!targetUser)throw new Error("no such user found.");

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
        let user = getCurrentUser(req);
        let groupId = req.params.id;
        let group = await Group.findOne({where:{id: groupId}});
        noGroupFound(group);
        let memberList;
        if(group.organizerId == user.id){
            memberList = await Membership.findAll({where:{groupId}});
        }else{
            memberList = await Membership.findAll({[Op.or]: [{ status:'Member'},{ status:'Waitlist'},{ status:'Co-host'},{ status:'Host'}]});
        }


        res.json(memberList);
    }
)

router.delete(
    '/:id/membership',
    requireAuth,
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
    requireAuth,
    async (req,res) => {
        let group = await Group.findOne({where:{id:req.params.id}});
          noGroupFound(group);
          await group.destroy();
          res.json("deleted");
    }
)



module.exports = router;
