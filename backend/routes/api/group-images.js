const express = require('express');
const router = express.Router();

const { GroupImage } = require('../../db/models');
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
          let image = await GroupImage.findOne({where:{id:req.params.id}});
          if(!image){
              throw new Error("no such group image found");
          }
          await image.destroy();
          res.json({Message: "successfully deleted Group Image"});
    }
  )



module.exports = router;
