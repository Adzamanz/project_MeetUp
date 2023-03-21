const express = require('express');
const router = express.Router();

const { EventImage } = require('../../db/models');

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
    async (req,res) =>{
          let image = await EventImage.findOne({where:{id:req.params.id}});
          if(!image){
              throw new Error("no such group image found");
          }
          await image.destroy();
          res.json("deleted");
    }
  );



module.exports = router;
