 const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

const { GroupImage, Group, Venue, Event, Membership, User,} = require('../../db/models');


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

const checkEmpty = (array) => {
    array.forEach(ele => {
        if(!ele) {
            let err = new Error("Input values must not be empty!");
            err.status = 400;
            throw err;
        }

    });
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
        let err =  new Error("Group not found");
        err.status = 404;
        throw err;
    }
}

//get all groups
router.get(
    '/',
    async (req, res,) => {

        let newGroups = await Group.findAll({raw: true});

        res.json({Groups: await Promise.all(newGroups.map((data) => addContextToGroup(data)))});

    })
//create new group

router.post(
    '/',
    requireAuth,
    async (req, res,next) => {
        let current = getCurrentUser(req);

        let organizerId = current.id;
        let {name, about, type, privates, city, state} = req.body;
        //checkEmpty([name, about, type, privates, city, state]);

        let errorArr = [];
        if(name.length >= 60 || name.length < 1) errorArr.push("Name must be 60 characters or less, but cannot be empty!");
        if(about.length < 50)errorArr.push("About must be 50 characters or more");
        if(!(type == "Online" || type == "In Person")) errorArr.push("Type must be 'Online' or 'In Person'");
        if(typeof privates != "boolean") errorArr.push("Private must be a boolean");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");

        console.log(name, about, type, privates, city, state)

        if(errorArr.length){
            let err = new Error("Validation Error");
            err.errors = errorArr;
            err.status = 400;
            next(err);
        }

        let unit = {organizerId, name, about, type, private: privates, city, state}

        let newGroup = await Group.create(unit)
        return res.json(newGroup)
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
        let Groups = await Promise.all(groupList.map((data) => addContextToGroup(data)))
        res.json({Groups});

    }
);

//get specific group details by id
router.get(
    '/:id',
    async (req,res,next) => {
        let group = await Group.findOne({where:{id:req.params.id}, raw: true});

        if (!group) {
            const err = new Error("Group not found");
            err.status = 404;
            err.title = "Group not found";
            return next(err);
        }
        let count = await Membership.count({where:{groupId:group.id}});
        group.numMembers = count;

        let groupImages = await GroupImage.findAll({where:{groupId: group.id}});

        group.GroupImages = groupImages;

        group.Organizer = await User.findByPk(group.organizerId);

        let groupVenues = await Venue.findAll({where:{groupId: group.id}});

        group.Venues = groupVenues;

        console.log(group)

        res.json(group);
    }
);

//edit group by id
router.put(
    '/:id',
    requireAuth,
    async (req,res,next) => {
        let {name,about,type,private,city,state} = req.body;
        //checkEmpty([name, about, type, private, city, state]);

        let errorArr = [];
        if(name.length >= 60 || name.length < 1) errorArr.push("Name must be 60 characters or less, but cannot be empty!");
        if(about.length < 50)errorArr.push("About must be 50 characters or more");
        if(!(type == "Online" || type == "In person")) errorArr.push("Type must be 'Online' or 'In person'");
        if(typeof private != "boolean") errorArr.push("Private must be a boolean");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");

        if(errorArr.length){
            let err = new Error("Validation Error");
            err.status = 400
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
        //checkEmpty([address, city,state,lat,lng]);
        let errorArr = [];
        if(!address)errorArr.push("Street address is required");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");
        if(!lat || lat > 90 || lat < -90)errorArr.push("Latitude is not valid");
        if(!lng || lng > 180 || lng < -180)errorArr.push("Longitude is not valid");

        if(errorArr.length){
            let err = new Error("Validation Error");
            err.status = 400;
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
        newVenue = await Venue.findByPk(newVenue.id)
        newVenue.lat = Number(newVenue.lat);
        newVenue.lng = Number(newVenue.lng);
        res.json(newVenue);

    }
);

//get all venues by group id
router.get(
    '/:id/venues',
    async (req, res, next) => {
        let allVenuesByGroup = await Venue.findAll({where: {groupId: req.params.id}});

       allVenuesByGroup.map((ele) => {
            ele.lat = Number(ele.lat);
            ele.lng = Number(ele.lng);
        });

        res.json({Venues: allVenuesByGroup});

    }
);

//edit venue
//uh, the required path is url/venues, NOT url/group/venues, so i think this has to go in ./venues

//create event by group id
router.post(
    '/:id/events',
    requireAuth,
    async (req,res,next) => {
        let groupId = req.params.id;
        let {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
        let currDate = new Date();

        //checkEmpty([groupId, venueId, name, type, capacity, price, description, startDate, endDate]);

        let venue = await Venue.findOne({where: {id:venueId}});


        let errorArr = [];
        if(!venue) errorArr.push("Venue does not exist") ;
        if(name.length < 5)errorArr.push("Name must be at least 5 characters");
        if(!(type == "Online" || type == "In person")) errorArr.push("Type must be 'Online' or 'In person'");
        if(capacity < 0)errorArr.push( "Capacity must be a positive integer");
        if(price < 0)errorArr.push("Price is invalid");
        if(!description) errorArr.push("Description is required");
        if(!startDate || startDate < currDate) errorArr.push("Start date must be in the future");
        if(!endDate || endDate < startDate)errorArr.push("End date is less than start date");

        if(errorArr.length){
            let err = new Error();
            err.status = 400;
            err.errors = errorArr;
            next(err);
        }

        let group = await Group.findOne({where: {id:req.params.id}});

        noGroupFound(group);

        let newEvent = await Event.create({groupId: req.params.id, venueId, name, type, capacity, price, description, startDate, endDate});
        newEvent = await Event.findOne({where: {id: newEvent.id}});

        res.json(newEvent);

    }
);

//get events by id
router.get(
    '/:id/events',
    async (req,res) => {
        let group = await Group.findOne({where:{id:req.params.id}});

        noGroupFound(group);

        let allEventsById = await Event.findAll({where:{groupId: group.id}, include: [
            {model: Group, attributes: ["id","name","city","state"]},
            {model: Venue, attributes: ["id","city","state"]}
            ]});

        res.json({Events: allEventsById});
    }
);

//request membership
router.post(
    '/:id/membership',
    requireAuth,
    async (req, res, next)=>{
        let currentUser = getCurrentUser(req);

        let group = await Group.findOne({where:{id:req.params.id}});
        noGroupFound(group);
        let testMembership = await Membership.findOne({where: {userId: currentUser.id}, attributes: {include: ["status"]}, raw:true});
        console.log(testMembership)
        if(testMembership &&testMembership.status == "member") {
            let err = new Error("User is already a Member of the Group");
            err.status = 400;
            next(err);
        }else if(testMembership && testMembership.status == "pending") {
            let err = new Error("Membership has already been requested");
            err.status = 400;
            next(err);
        }
        let newMembership = await Membership.create({
            groupId: group.id,
            userId: currentUser.id,
        })
        newMembership = await Membership.findOne({where: {id: newMembership.id}});
        res.json(newMembership);
    }
);
//change membership status
router.put(
    '/:id/membership',
    async (req, res) =>{
        let {memberId, status} = req.body;
        if(status == "pending")throw new Error("Cannot set status to pending.");
        console.log(memberId)

        let targetUser = await User.findOne({where:{id: memberId}});
        if(!targetUser){
            let err = new Error("User not found.");
            err.status = 404;
            throw err;
        }

        let targetMembership = await Membership.findOne({where:{groupId: req.params.id, userId: targetUser.id}});
        if(!targetMembership) throw new Error("Membership between the user and the group does not exits");

        targetMembership.set({status: status});
        await targetMembership.save();
        targetMembership = await Membership.findOne({where:{groupId: req.params.id, userId: targetUser.id}});
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
            memberList = await Membership.findAll({where:{groupId}, raw:true});
        }else{
            memberList = await Membership.findAll({where:{groupId},[Op.or]: [{ status:'member'},{ status:'waitlist'},{ status:'co-host'},{ status:'host'}]});
        }
        memberArr = [];

        await Promise.all(memberList.map(async (ele) => {
            let memberInfo = await User.findOne({where: {id: ele.userId},attributes: {exclude:["username"]},raw:true});

            memberInfo.Membership = {};
            memberInfo.Membership.status = ele.status;
            memberArr.push(memberInfo);
        }))

        res.json({Members: memberArr});
    }
)

router.delete(
    '/:id/membership',
    requireAuth,
    async (req,res) => {

        let currentUser = getCurrentUser(req);
        let membership = await Membership.findOne({where:{groupId:req.params.id,userId:currentUser.id}});
        if(!membership){
            let err = new Error("no such membership found");
            err.status = 404;
            throw err;
        }
        await membership.destroy();
        res.json({Message: "successfully deleted Membership"});
    }
)

router.delete(
    '/:id',
    requireAuth,
    async (req,res) => {
        let group = await Group.findOne({where:{id:req.params.id}});
          noGroupFound(group);
          await group.destroy();
          res.json({Message: "successfully deleted Group"});
    }
)



module.exports = router;
