import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import commentCtrl from '../controllers/comment.controller';

const router = express.Router();

//api to add comment to answers
router.route('/api/post/answer/comment/:userId')
  .post(authCtrl.requireSignin, commentCtrl.comment);

router.route('/api/post/answer/comments')
  .get(authCtrl.requireSignin, commentCtrl.comments);

//api to like comment
router.route('/api/post/answer/comment/like')
  .put(authCtrl.requireSignin, commentCtrl.like);

//api to like an answer
router.route('/api/post/answer/comment/unlike')
  .put(authCtrl.requireSignin, commentCtrl.unlike);

router.route('/api/post/answer/comment/remove/:commentId')
  .delete(authCtrl.requireSignin, commentCtrl.isCommenter, commentCtrl.remove);

router.route('/api/post/answer/comment/:commentId')
  .put(authCtrl.requireSignin, commentCtrl.isCommenter, commentCtrl.update);

router.param('userId', userCtrl.userByID);
router.param('commentId', commentCtrl.commentByID);
export default router;