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
        let err =  new Error("no such group found");
        err.status = 404;
        err.title = "Group not found";
        throw err;
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
    async (req, res,next) => {
        let current = getCurrentUser(req);

        let organizerId = current.id;
        let {name, about, type, private, city, state} = req.body;

        let errorArr = [];
        if(name.length > 60) errorArr.push("Name must be 60 characters or less");
        if(about.length < 50)errorArr.push("About must be 50 characters or more");
        if(!(type == "Online" || type == "In-person")) errorArr.push("Type must be 'Online' or 'In-person'");
        if(typeof private != "boolean") errorArr.push("Private must be a boolean");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");

        if(errorArr.length){
            let err = new Error();
            err.errors = errorArr;
            next(err);
        }

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

//get specific group details by id
router.get(
    '/:id',
    async (req,res,next) => {
        let group = await Group.findOne({where:{id:req.params.id},include: [Venue,GroupImage], raw: true});
        if (!group) {
            const err = new Error("Group not found");
            err.status = 404;
            err.title = "Group not found";
            return next(err);
        }

        group = await addContextToGroup(group);

        res.json(group);
    }
);

//edit group by id
router.put(
    '/:id',
    requireAuth,
    async (req,res,next) => {
        let {name,about,type,private,city,state} = req.body;

        let errorArr = [];
        if(name.length > 60) errorArr.push("Name must be 60 characters or less");
        if(about.length < 50)errorArr.push("About must be 50 characters or more");
        if(!(type == "Online" || type == "In-person")) errorArr.push("Type must be 'Online' or 'In-person'");
        if(typeof private != "boolean") errorArr.push("Private must be a boolean");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");

        if(errorArr.length){
            let err = new Error();
            err.errors = errorArr;
            next(err);
        }

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

        let errorArr = [];
        if(!address)errorArr.push("Street address is required");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");
        if(lat > 90 || lat < -90)errorArr.push("Latitude is not valid");
        if(lng > 180 || lng < -180)errorArr.push("Longitude is not valid");

        if(errorArr.length){
            let err = new Error();
            err.errors = errorArr;
            next(err);
        }

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
    async (req,res,next) => {
        let {groupId, venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
        let currDate = new Date();
        let venue = await Venue.findOne({where: {id:venueId}});


        let errorArr = [];
        if(!venue) errorArr.push("Venue does not exist") ;
        if(name.length < 5)errorArr.push("Name must be at least 5 characters");
        if(!(type == "Online" || type == "In-person")) errorArr.push("Type must be 'Online' or 'In-person'");
        if(capacity < 0)errorArr.push( "Capacity must be an integer");
        if(price < 0)errorArr.push("Price is invalid");
        if(!description) errorArr.push("Description is required");
        if(!startDate || startDate < currDate) errorArr.push("Start date must be in the future");
        if(!endDate || endDate < startDate)errorArr.push("End date is less than start date");

        if(errorArr.length){
            let err = new Error();
            err.errors = errorArr;
            next(err);
        }

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
