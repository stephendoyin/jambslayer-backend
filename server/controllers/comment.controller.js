import Comment from '../models/comments.model';
import Reply from '../models/replies.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';
// import fs from 'fs';
// import formidable from 'formidable';

const comment = (req, res) => {
    let comment = new Comment();
    comment.content = req.body.content;
    comment.postedBy = req.profile;
    comment.answerID = req.body.answerId;
    comment.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errHandler.getErrorMessage(err)
            });
        }
        Comment.find({ 'answerID': req.body.answerId })
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
    });
};

const reply = (req, res) => {
    let reply = new Reply();
    reply.content = req.body.content;
    reply.postedBy = req.profile;
    reply.commentID = req.body.commentId;
    reply.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errHandler.getErrorMessage(err)
            });
        }
        Reply.find({ 'commentID': req.body.commentId })
            .populate('postedBy', ['name', 'created', '_id'])
            .sort('-created')
            .exec((err, replies) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler.getErrorMessage(err)
                    });
                }
                res.json(replies);
            });
    });
};



export default {
    comment,
    reply
}