import Comment from '../models/comments.model';
//import Reply from '../models/replies.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';

const comment = (req, res) => {
    let comment = new Comment(req.body);
    comment.postedBy = req.profile._id;
    console.log(comment);
    comment.save((err, comment) => {
        if (err) {
            return res.status(400).json({
                error: errHandler.getErrorMessage(err)
            });
        }
        res.json(comment);
    });
};

//return all comments for a particular answer
const comments = (req, res) => {
    Comment.find({ 'answerID': req.body.answerID })
        .populate('postedBy', ['name', 'created', '_id'])
        .sort('-created')
        .exec((err, comments) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(comments);
        });
};

const like = (req, res) => {
    Comment.findByIdAndUpdate(req.body.commentId, { $push: { likes: req.body.userId } }, { new: true })
        .exec((err, answer) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(answer);
        });
};

const unlike = (req, res) => {
    Comment.findByIdAndUpdate(req.body.commentId, { $pull: { likes: req.body.userId } }, { new: true })
        .exec((err, comment) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(comment);
        });
};

const commentByID = (req, res, next, id) => {
    Comment.findById(id).populate('postedBy', '_id name').exec((err, comment) => {
        if (err || !comment) {
            return res.status('400').json({
                error: "Comment not found"
            });
        }
        req.comment = comment;
        console.log(comment);
        next();
    })
};

const isCommenter = (req, res, next) => {
    let isCommenter = req.comment && req.auth && req.comment.postedBy._id == req.auth._id;
    if (!isCommenter) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};

const update = (req, res) => {
    let comment = req.comment;
    comment.content = req.body.content;
    comment.modified = true;
    comment.save((err, comment) => {
        if(err){
            return res.status(400).json({
                error: errHandler.getErrorMessage(err)
            });
        }
        res.json(comment);
        // res.status(200).json({
        //     message: "sucessfully updated comment"
        // });
    });
};

const remove = (req, res) => {
    let comment = req.comment;
    comment.remove((err, deletedComment) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedComment);
    });
};


// const reply = (req, res) => {
//     let reply = new Reply();
//     reply.content = req.body.content;
//     reply.postedBy = req.profile;
//     reply.commentID = req.body.commentId;
//     reply.save((err, result) => {
//         if (err) {
//             return res.status(400).json({
//                 error: errHandler.getErrorMessage(err)
//             });
//         }
//         Reply.find({ 'commentID': req.body.commentId })
//             .populate('postedBy', ['name', 'created', '_id'])
//             .sort('-created')
//             .exec((err, replies) => {
//                 if (err) {
//                     return res.status(400).json({
//                         error: errorHandler.getErrorMessage(err)
//                     });
//                 }
//                 res.json(replies);
//             });
//     });
// };



export default {
    comment,
    comments,
    like,
    unlike,
    commentByID,
    remove,
    update,
    isCommenter
    //reply
}