import Answer from '../models/answers.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';
import fs from 'fs';
import formidable from 'formidable';

const createAnswer = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image unable to upload"
            });
        }
        let answer = new Answer(fields);
        answer.postedBy = req.profile._id;
        if (files.photo) {
            answer.photo.data = fs.readFileSync(files.photo.path);
            answer.photo.contentType = files.photo.type;
        }
        answer.save((err, answer) => {
            if (err) {
                return res.status(400).json({
                    error: errHandler.getErrorMessage(err)
                });
            }
            res.json(answer);
        });
    });
};


const answers = (req, res) => {
    Answer.find({ 'postID': req.body.postID })
        .sort('-created')
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

const like = (req, res) => {
    Answer.findByIdAndUpdate(req.body.answerId, { $push: { likes: req.body.userId } }, { new: true })
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
    Answer.findByIdAndUpdate(req.body.answerId, { $pull: { likes: req.body.userId } }, { new: true })
        .exec((err, answer) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(answer);
        });
};

const answerByID = (req, res, next, id) => {
    Answer.findById(id).populate('postedBy', '_id name').exec((err, answer) => {
        if (err || !answer) {
            return res.status('400').json({
                error: "Answer not found"
            });
        }
        req.answer = answer;
        console.log(answer);
        next();
    })
};

const remove = (req, res) => {
    let answer = req.answer;
    answer.remove((err, deletedAnswer) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedAnswer);
        //will call next here to further delete answer,
        //comment and reply related to this post
    });
};

const isAnswerer = (req, res, next) => {
    let isAnswerer = req.answer && req.auth && req.answer.postedBy._id == req.auth._id;
    if (!isAnswerer) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};

const photo = (req, res, next) => {
    res.set("Content-Type", req.answer.photo.contentType);
    return res.send(req.answer.photo.data);
};

const updateAnswer = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image unable to upload"
            });
        }
        let answer = req.answer;
        answer.updated = Date.now();
        answer = _.extend(answer, fields);
        if (files.photo) {
            answer.photo.data = fs.readFileSync(files.photo.path);
            answer.photo.contentType = files.photo.type;
        }
        answer.save((err, answer) => {
            if (err) {
                return res.status(400).json({
                    error: errHandler.getErrorMessage(err)
                });
            }
            res.json(answer);
        });
    });
}

export default {
    createAnswer,
    answers,
    like,
    unlike,
    answerByID,
    photo,
    isAnswerer,
    remove,
    updateAnswer
};
