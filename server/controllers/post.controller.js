import Post from '../models/post.model';
import User from '../models/user.model';

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
        post.postedBy = req.profile._id;
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
        });
    });
};

const like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(result);
        });
};

const unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(result);
        });
}

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

const addSubInterest = (req, res, next) => {
    if(req.profile.subject_interests.includes(req.body.sub_interest)){
        return next();
    }
    User.findByIdAndUpdate(req.profile._id, { $push: { subject_interests: req.body.sub_interest } })
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(user);
        });
};

const removeSubInterest = (req, res) => {
    User.findByIdAndUpdate(req.profile._id, { $pull: { subject_interests: req.body.sub_interest } })
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(user);
        });
};

const listNewsFeed = (req, res) => {
    console.log(req.profile.subject_interests);
    Post.find({ tag: { $in: request.profile.subject_interests } })
        .populate('postedBy', '_id name')
        .sort('-created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(posts)
        });

};

const listByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .sort('-created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(posts);
        });
};

const remove = (req, res) => {
    let post = req.post;
    post.remove((err, deletedPost) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedPost);
        //will call next here to further delete answer,
        //comment and reply related to this post
    });
};

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if (!isPoster) {
        return res.status('403').json({
            error: "User is not authorized"
        });
    }
    next();
};

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

export default {
    createPost,
    postByID,
    isPoster,
    remove,
    photo,
    like,
    unlike,
    listNewsFeed,
    listByUser,
    addSubInterest,
    removeSubInterest
}

