import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router();

router.route('/api/posts/new/:userId')
  .post(authCtrl.requireSignin, postCtrl.createPost);

//api to delete post
router.route('/api/posts/:postId')
  .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove);

router.route('/api/posts/photo/:postId')
  .get(postCtrl.photo);

//api to like post
router.route('/api/posts/like')
  .put(authCtrl.requireSignin, postCtrl.like);

//api to unlike post
router.route('/api/posts/unlike')
  .put(authCtrl.requireSignin, postCtrl.unlike);

//api that gets post according to user's interest tags
router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed);

// //api to get photo that may be posted with answers
// router.route('/api/posts/photo/answer/:postId')
//     .get(postCtrl.photo);

// //api to view user specific post (questions by user if there is)
// router.route('/api/posts/by/:userId')
//     .get(authCtrl.requireSignin, postCtrl.listByUser);

//api to add comment to answers
router.route('/api/post/answer/comment/:userId')
  .put(authCtrl.requireSignin, postCtrl.comment);

//api to add reply to comment
router.route('/api/post/answer/comment/reply/:userId')
  .put(authCtrl.requireSignin, postCtrl.reply);

router.route('/api/posts/answers/:userId')
  .put(authCtrl.requireSignin, postCtrl.createAnswer, postCtrl.answers);

// api to remove comment
// router.route('/api/post/answer/uncomment')
//   .put(authCtrl.requireSignin, postCtrl.uncomment);

// //api to like an answer
// router.route('/api/posts/answer/like')
//     .put(authCtrl.requireSignin, postCtrl.answerLike);

// //api to unlike an answer
// router.route('/api/posts/answer/unlike')
//     .put(authCtrl.requireSignin, postCtrl.answerUnlike);

// //api to edit answer
// router.route('/api/posts/answer/:answerId')
//     .put(authCtrl.requireSignin, postCtrl.isAnswerer, postCtrl.editAnswer);

router.param('userId', userCtrl.userByID);
router.param('postId', postCtrl.postByID);
//router.param('answerId', postCtrl.answerID);

export default router;