const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

const { Venue} = require('../../db/models');
const { check } = require('express-validator');

const checkEmpty = (array) => {
    array.forEach(ele => {
        if(!ele) throw new Error("Input values must not be empty!")
    });
}

router.put(
    '/:id',
    requireAuth,
    async (req,res, next) => {

        let {address, city,state,lat,lng} = req.body;
        //checkEmpty([address,city,state,lat,lng]);
        let errorArr = [];
        if(!address)errorArr.push("Street address is required");
        if(!city)errorArr.push("City is required");
        if(!state)errorArr.push("State is required");
        if(!lat || lat > 90 || lat < -90)errorArr.push("Latitude is not valid");
        if(!lng || lng > 180 || lng < -180)errorArr.push("Longitude is not valid");

        if(errorArr.length){
            let err = new Error("Validation Error");
            err.errors = errorArr;
            err.status = 400
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
        venue = await Venue.findOne({where: {id: venue.id}});
        res.json(venue);
    }
  );

  module.exports = router;
