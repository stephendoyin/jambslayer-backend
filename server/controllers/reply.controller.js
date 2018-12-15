import Comment from '../models/comment.model';
import Reply from '../models/reply.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';

const reply = (req, res) => {
    let reply = new Reply();
    reply.content = req.body.content;
    reply.postedBy = req.body.userId;
    reply.save((err, reply) => {
        console.log(reply);
        if (err) {
            return res.status(400).json({
                error: errHandler.getErrorMessage(err)
            });
        }
        Comment.findByIdAndUpdate(req.body.commentId, { $push: { replies: reply } }, { new: true })
            .populate({
                path: 'replies',
                select: 'name _id created content',
                populate: {
                    path: 'postedBy',
                    select: 'name _id created',
                }
            })
            .exec((err, comment) => {
                if (err) {
                    return res.status(400).json({
                        error: errHandler.getErrorMessage(err)
                    });
                }
                res.json(comment);
            });
    });
};

const like = (req, res) => {
    Reply.findByIdAndUpdate(req.body.replyId, { $push: { likes: req.body.userId } }, { new: true })
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
    Reply.findByIdAndUpdate(req.body.replyId, { $pull: { likes: req.body.userId } }, { new: true })
        .exec((err, reply) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(reply);
        });
};

const replyByID = (req, res, next, id) => {
    Reply.findById(id).populate('postedBy', '_id name').exec((err, reply) => {
        if (err || !reply) {
            return res.status('400').json({
                error: "Comment not found"
            });
        }
        req.reply = reply;
        next();
    })
}; 

export default {
    reply,
    like, 
    unlike,
    replyByID
}