const express = require('express')
const router = express.Router();

const { Op } = require("sequelize");
const { Group, Venue, Event, EventImage, Attendance, Membership, User } = require('../../db/models');
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
        newImage = await EventImage.scope("basic").findOne({where:{id: newImage.id}});
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
        console.log(page,size)
        let search = {};
        let offset = 0;
        if(page && size){
            page = Number(page);
            size = Number(size);
            if(name)search.name = name;
            if(type)search.type = type;
            offset = (page - 1) * size;
        }



        if(startDate && startDate != '')search.startDate = startDate

        console.log(search,page,size, offset);

        allEvents = await Event.findAll({
            include: [
                {model: Group, attributes: ["id","name","city","state"]},
                {model: Venue, attributes: ["id","city","state"]}
            ]});
        let errorArr = [];
        if(page < 0 || page > 10)errorArr.push("page minimum is 0, page maximum is 10");
        if(size < 0 || size > 20)errorArr.push("size minimum is 0, size maximum is 20");
        if(name && typeof name != "string")errorArr.push("name must be a string");
        if(type && typeof type != "string")errorArr.push("type must be a string");
        if(startDate && typeof startDate != "string")errorArr.push("startDate must be a string");
        if(errorArr.length){
            let err = new Error("Validation Error");
            err.status = 400;
            err.errors = errorArr;
            next()
        }
        if(search){
            allEvents = await Event.findAll({where: search,include: [
                {model: Group, attributes: ["id","name","city","state"]},
                {model: Venue, attributes: ["id","city","state"]}
                ],offset, limit: size});
        }


        console.log(allEvents)
        res.json({ Events: allEvents});
    }
);
//get event by id
router.get(
    '/:id',
    async (req,res) =>{
        let event = await Event.findOne({where: {id:req.params.id}, include: [
            {model: Group, attributes: ["id","name","city","state"]},
            {model: Venue, attributes: ["id","address","city","state","lat","lng"]},
            {model: EventImage, attributes: ["id", "url", "preview"]}
            ]});

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
        if(!venue) throw new Error("that Venue does not exist") ;

        if(name.length < 5)throw new Error("Name must be at least 5 characters");
        if(!(type == "Online" || type == "In person")) throw new Error("Type must be 'Online' or 'In person'");
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
        event = await Event.findOne({where:{id: event.id}})
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
        let test = await Attendance.findOne({where:{eventId: req.params.id, userId: currentUser.id}});
        if(test)throw new Error("Attendance has already been requested")
        let newAttendance = await Attendance.create({eventId: req.params.id, userId: currentUser.id});
        newAttendance = await Attendance.findOne({where:{id: newAttendance.id}});
        res.json(newAttendance);
    }
);
//edit attendance
router.put(
    '/:id/attendance',
    requireAuth,
    async (req,res) => {
        let {userId, status} = req.body;
        if(status == "pending")throw new Error("Cannot set status to pending.");

        let event = await Event.findOne({where: {id: req.params.id}});
        noEventFound(event);

        let attendance = await Attendance.findOne({where: {userId: userId, eventId: req.params.id}});
        if(!attendance){
            throw new Error("Attendance between the user and the event does not exist");
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
        let membership = await Membership.findOne({where:{groupId: event.groupId, userId: user.id},raw:true});
        console.log(membership)
        let attendees;
        if(membership &&(membership.status == "co-host" || membership.status == "host")){
            attendees = await Attendance.findAll({where:{eventId: req.params.id},raw:true});
        }
        else{
            attendees = await Attendance.findAll({where:{eventId: req.params.id, [Op.or]: [{ status:'attending'},{ status:'waitlist'}]},raw:true});
        }
        let attendeeArr = []

        let loot = await Promise.all(attendees.map(async (ele) =>  {
            let userinfo = await User.findOne({where: {id:ele.userId},raw:true});
            userinfo.Attendance = {};
            userinfo.Attendance.status = ele.status;
            attendeeArr.push(userinfo);
            return userinfo;


        }))
        res.json({Attendances: loot});

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
            throw new Error("Attendance between the user and the event does not exist");
        }
        await attendance.destroy();
        res.json("successfully deleted Attendance");
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
          res.json("successfully deleted Event");
    }
  );
module.exports = router;
