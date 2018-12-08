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

//api to update user interest to return applicable post
router.route('/api/post/tag/:userId')
  .put(authCtrl.requireSignin, postCtrl.addSubInterest, postCtrl.removeSubInterest);

//api to view user specific post (questions by user if there is)
router.route('/api/posts/by/:userId')
  .get(authCtrl.requireSignin, postCtrl.listByUser);

router.param('userId', userCtrl.userByID);
router.param('postId', postCtrl.postByID);

export default router;