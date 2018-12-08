import Answer from '../models/answers.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';
// import fs from 'fs';
// import formidable from 'formidable';

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

export default {
    createAnswer,
    answers
};
