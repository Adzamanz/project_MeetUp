const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

const { Venue} = require('../../db/models');

router.put(
    '/:id',
    requireAuth,
    async (req,res) => {

        let {address, city,state,lat,lng} = req.body;
        if(!address)throw new Error("Street address is required");
        if(!city)throw new Error("City is required");
        if(!state)throw new Error("State is required");
        if(lat > 90 || lat < -90) throw new Error("Latitude is not valid");
        if(lng < -180 || lng > 180)throw new Error("Longitude is not valid");
        let venue = await Venue.findOne({where: {id: req.params.id}});

        if(!venue){
            //console.log("BONK");
            throw new Error("no such venue found");
        }

        await venue.set(
            {address,city,state,lat,lng}
        );
        await venue.save();
        res.json(venue);
    }
  );

  module.exports = router;
