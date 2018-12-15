import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import replyCtrl from '../controllers/reply.controller';

const router = express.Router();

//api to add reply to comment
router.route('/api/comment/reply')
  .post(authCtrl.requireSignin, replyCtrl.reply);

//api to like comment
router.route('/api/comment/like')
  .put(authCtrl.requireSignin, replyCtrl.like);

//api to like an answer
router.route('/api/comment/unlike')
  .put(authCtrl.requireSignin, replyCtrl.unlike);

router.param('userId', userCtrl.userByID);
router.param('commentId', replyCtrl.replyByID);
export default router;