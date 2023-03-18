const express = require('express')
const router = express.Router();

const { Event, EventImage } = require('../../db/models');

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
        res.send(newImage);
    }
)

module.exports = router;
