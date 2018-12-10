import Answer from '../models/answers.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';
import fs from 'fs';
import formidable from 'formidable';

// const createAnswer = (req, res, next) => {
//     let answer = new Answer();
//     answer.content = req.body.content;
//     answer.postedBy = req.profile;
//     answer.postID = req.body.postId;
//     answer.save((err, result) => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             })
//         }
//         next();
//     })
// }

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

export default {
    createAnswer,
    answers
};
