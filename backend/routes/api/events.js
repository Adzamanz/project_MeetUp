const express = require('express')
const router = express.Router();

const { Group, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const noEventFound = (event) => {
    if(!event){
        throw new Error("no such event found");
    }
}
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
//create event image
router.post(
    '/:id/images',
    requireAuth,
    async (req,res) => {
        let {url, preview} = req.body;
        let event = await Event.findOne({where: {id: req.params.id}});
        if(!event){
            //console.log("BONK");
            throw new Error("no such event found");
        }
        let newImage = await EventImage.create({eventId: event.id, url, preview});
        res.json(newImage);
    }
)
//get all events
router.get(
    '/',
    async (req,res,next) => {
        // page: integer, minimum: 0, maximum: 10, default: 0
        // size: integer, minimum: 0, maximum: 20, default: 20
        // name: string, optional
        // type: string, optional
        // startDate: string, optional
        let {page, size, name, type, startDate} = req.query;
        let allEvents;
        let search = {};
        if(name)search.name = name;
        if(type)search.type = type;
        if(startDate && startDate != '')search.startDate = startDate
        let offset = (page - 1) * size;
        console.log(req.query);
        if(!req.query) allEvents = await Event.findAll({include: [Group, Venue]});
        else if(page < 0 || page > 10)throw new Error("page minimum is 0, page maximum is 10");
        else if(size < 0 || size > 20)throw new Error("size minimum is 0, size maximum is 20");
        else if(name && typeof name != "string")throw new Error("name must be a string");
        else if(type && typeof type != "string")throw new Error("type must be a string");
        else if(startDate && typeof startDate != "string")throw new Error("startDate must be a string");
        else allEvents = await Event.findAll({where: search,include: [Group, Venue],offset, limit: size});
        res.json(allEvents);
    }
);
//get event by id
router.get(
    '/:id',
    async (req,res) =>{
        let event = await Event.findOne({where: {id:req.params.id}, include: [Group, Venue, EventImage]});

        noEventFound(event)

        res.json(event);
    }
);
//edit event
router.put(
    '/:id',
    requireAuth,
    async (req,res,next) => {
        let {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
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
        let event = await Event.findOne({where: {id: req.params.id}});

        noEventFound(event);

       await event.set(
        {venueId, name, type, capacity, price, description, startDate, endDate}
        );
        await event.save();
        res.json(event);
    }
);
//request attendance
router.post(
    '/:id/attendance',
    requireAuth,
    async (req,res) => {
        let currentUser = getCurrentUser(req);
        let event = await Event.findOne({where: {id: req.params.id}});
        noEventFound(event);
        let test = await Attendance.findOne({eventId: req.params.id, userId: currentUser.id});
        if(test)throw new Error("attendance ticket already exists!")
        let newAttendance = await Attendance.create({eventId: req.params.id, userId: currentUser.id});
        res.json(newAttendance);
    }
);
//edit attendance
router.put(
    '/:id/attendance',
    requireAuth,
    async (req,res) => {
        let {userId, status} = req.body;
        if(status == "Pending")throw new Error("Cannot set status to Pending.");

        let event = await Event.findOne({where: {id: req.params.id}});
        noEventFound(event);

        let attendance = await Attendance.findOne({where: {userId: userId, eventId: req.params.id}});
        if(!attendance){
            throw new Error("no such attendance found");
        }
        attendance.set({status});
        await attendance.save();
        res.json(attendance);
    }
);
//get attendance
router.get(
    '/:id/attendees',
    async (req,res) => {
        let event = await Event.findOne({where: {id: req.params.id}});
        noEventFound(event);
        let user = getCurrentUser(req);
        let membership = await Membership.findOne({where:{groupId: event.groupId, userId: user.id}});
        let attendees;
        if(membership.status == "Co-host" || membership.status == "Host") attendees = await Attendance.findAll({where:{eventId: req.params.id}});
        else attendees = await Attendance.findAll({where:{eventId: req.params.id, [Op.or]: [{ status:'Attending'},{ status:'Waitlist'}]}});

        attendees = await Attendance.findAll({where:{eventId: req.params.id}});

        res.json(attendees);

    }
);
//delete attendance
router.delete(
    '/:id/attendance',
    requireAuth,
    async (req, res) => {

        let currentUser = getCurrentUser(req);
        let attendance = await Attendance.findOne({where:{eventId: req.params.id, userId: currentUser.id}});
        if(!attendance){
            throw new Error("no such attendance found");
        }
        await attendance.destroy();
        res.json("deleted");
    }
)
//delete event
router.delete(
    '/:id',
    requireAuth,
    async (req,res) =>{
          let event = await Event.findOne({where:{id:req.params.id}});
          noEventFound(event);
          await event.destroy();
          res.json("deleted");
    }
  );
module.exports = router;
