import Post from '../models/post.model';
import Answer from '../models/answers.model';
import Comment from '../models/comments.model';
import Reply from '../models/replies.model'
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';
import fs from 'fs';
import formidable from 'formidable';

//post new question 
const createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image unable to upload"
            });
        }
        let post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errHandler.getErrorMessage(err)
                });
            }
            result.postedBy.salt = undefined;
            result.postedBy.hashed_password = undefined;
            res.json(result);
        })
    })
};

const postByID = (req, res, next, id) => {
    Post.findById(id).populate('postedBy', '_id name').exec((err, post) => {
        if (err || !post) {
            return res.status('400').json({
                error: "Post not found"
            });
        }
        req.post = post;
        next();
    })
};

const createAnswer = (req, res, next) => {
    let answer = new Answer();
    answer.content = req.body.content;
    answer.postedBy = req.profile;
    answer.postID = req.body.postId;
    answer.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        next();
    })
}

const answers = (req, res) => {
    Answer.find({ 'postID': req.body.postId })
        .sort({ created: 'asc' })
        .populate('postedBy', ['name', 'created', '_id'])
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errHandler.getErrorMessage(err)
                });
            }
            res.json(result);
        });
};

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
}

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if (!isPoster) {
        return res.status('403').json({
            error: "User is not authorized"
        });
    }
    next();
};

export default {
    createPost,
    postByID,
    answers,
    createAnswer,
    comment,
    reply,
    isPoster
}

