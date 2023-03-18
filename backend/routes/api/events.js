const express = require('express')
const router = express.Router();

const { Event, EventImage } = require('../../db/models');

const noEventFound = (group) => {
    if(!group){
        throw new Error("no such event found");
    }
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
module.exports = router;
