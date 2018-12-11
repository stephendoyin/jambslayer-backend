import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import ansCtrl from '../controllers/answer.controller';

const router = express.Router();

router.route('/api/post/answer/:userId')
    .post(authCtrl.requireSignin, ansCtrl.createAnswer);

router.route('/api/post/answers')
    .get(authCtrl.requireSignin, ansCtrl.answers);

//api to like an answer
router.route('/api/post/answer/like')
    .put(authCtrl.requireSignin, ansCtrl.like);

//api to like an answer
router.route('/api/post/answer/unlike')
    .put(authCtrl.requireSignin, ansCtrl.unlike);

//api to get photo that may be posted with answers
router.route('/api/post/answer/photo/:answerId')
    .get(ansCtrl.photo);

//api to remove an answer
router.route('/api/post/answer/remove/:answerId')
    .delete(authCtrl.requireSignin, ansCtrl.isAnswerer, ansCtrl.remove);

//api to edit answer
router.route('/api/post/answer/:answerId')
    .put(authCtrl.requireSignin, ansCtrl.isAnswerer, ansCtrl.updateAnswer);

router.param('userId', userCtrl.userByID);
router.param('answerId', ansCtrl.answerByID);

export default router;