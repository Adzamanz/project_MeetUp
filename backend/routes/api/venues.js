const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

const { Venue} = require('../../db/models');

router.put(
    '/:id',
    requireAuth,
    async (req,res,next) => {

        let {address, city,state,lat,lng} = req.body;

        let errorArr = [];
        if(!address)errorArr.push("Street address is required");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");
        if(lat > 90 || lat < -90)errorArr.push("Latitude is not valid");
        if(lng > 180 || lng < -180)errorArr.push("Longitude is not valid");

        if(errorArr.length){
            let err = new Error("Validation Error");
            err.errors = errorArr;
            next(err);
        }

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
