import Post from '../models/post.model';
import _ from 'lodash';
import errHandler from './../helpers/dbErrorHandler';
import fs from 'fs';
import formidable from 'formidable';

const create = (req, res, next) => {
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

const answer = (req, res) => {
    let answer = {};
    answer.content = req.body.answer;
    answer.postedBy = req.body.userId;
    console.log(answer)
    Post.findByIdAndUpdate(req.body.postId, {$push: {answers: answer}}, {new: true})
    .populate('answers.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
  }

export default {
    create,
    answer
}

