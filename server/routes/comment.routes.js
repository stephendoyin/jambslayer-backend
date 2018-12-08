import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import commentCtrl from '../controllers/comment.controller';

const router = express.Router();

//api to add comment to answers
router.route('/api/post/answer/comment/:userId')
  .put(authCtrl.requireSignin, commentCtrl.comment);

//api to add reply to comment
router.route('/api/post/answer/comment/reply/:userId')
  .put(authCtrl.requireSignin, commentCtrl.reply);

// api to remove comment
// router.route('/api/post/answer/uncomment')
//   .put(authCtrl.requireSignin, commentCtrl.uncomment);

router.param('userId', userCtrl.userByID);

export default router;