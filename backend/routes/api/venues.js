const express = require('express')
const router = express.Router();

const { Venue} = require('../../db/models');

router.put(
    '/:id',
    async (req,res,next) => {
        let {address, city,state,lat,lng} = req.body;
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
