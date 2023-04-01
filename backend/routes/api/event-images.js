const express = require('express');
const router = express.Router();

const { EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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

router.delete(
    '/:id',
    requireAuth,
    async (req,res) =>{
          let image = await EventImage.findOne({where:{id:req.params.id}});
          if(!image){
            let err = new Error("no such group image found");
            err.status = 404;
            throw err;
          }
          await image.destroy();
          res.json({Message: "successfully deleted Event Image"});
    }
  );



module.exports = router;
