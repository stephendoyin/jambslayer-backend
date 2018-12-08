import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import ansCtrl from '../controllers/answer.controller';

const router = express.Router();

router.route('/api/posts/answers/:userId')
    .put(authCtrl.requireSignin, ansCtrl.createAnswer, ansCtrl.answers);

// //api to like an answer
// router.route('/api/posts/answer/like')
//     .put(authCtrl.requireSignin, postCtrl.answerLike);

// //api to get photo that may be posted with answers
// router.route('/api/posts/photo/answer/:postId')
//     .get(postCtrl.photo);

// //api to unlike an answer
// router.route('/api/posts/answer/unlike')
//     .put(authCtrl.requireSignin, postCtrl.answerUnlike);

// //api to edit answer
// router.route('/api/posts/answer/:answerId')
//     .put(authCtrl.requireSignin, postCtrl.isAnswerer, postCtrl.editAnswer);

router.param('userId', userCtrl.userByID);
//router.param('answerId', postCtrl.answerID);

export default router;