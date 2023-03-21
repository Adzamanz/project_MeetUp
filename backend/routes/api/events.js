const express = require('express')
const router = express.Router();

const { Event, EventImage, Attendance } = require('../../db/models');

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

router.post(
    '/:id/images',
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
router.get(
    '/',
    async (req,res) => {
        let allEvents = await Event.findAll();
        res.json(allEvents);
    }
);
router.get(
    '/:id',
    async (req,res) =>{
        let eventDesc = await Event.findOne({where: {id:req.params.id}});

        noEventFound(eventDesc)

        res.json(eventDesc.description);
    }
);

router.put(
    '/:id',
    async (req,res,next) => {
        let {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
        let event = await Event.findOne({where: {id: req.params.id}});

        noEventFound(event);

       await event.set(
        {venueId, name, type, capacity, price, description, startDate, endDate}
        );
        await event.save();
        res.json(event);
    }
);

router.post(
    '/:id/attendance',
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

router.put(
    '/:id/attendance',
    async (req,res) => {
        let {userId, status} = req.body
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

router.get(
    '/:id/attendees',
    async (req,res) => {
        let event = await Event.findOne({where: {id: req.params.id}});

        noEventFound(event);
        let attendees = await Attendance.findAll({where:{eventId: req.params.id}});

        res.json(attendees);

    }
);

router.delete(
    '/:id/attendance',
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

router.delete(
    '/:id',
    async (req,res) =>{
          let event = await Event.findOne({where:{id:req.params.id}});
          noEventFound(event);
          await event.destroy();
          res.json("deleted");
    }
  );
module.exports = router;
