// import Post from '../models/post.model';
// import _ from 'lodash';
// import errHandler from './../helpers/dbErrorHandler';
// import fs from 'fs';
// import formidable from 'formidable';

// //post new question 
// const create = (req, res, next) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "Image unable to upload"
//             });
//         }
//         let post = new Post(fields);
//         post.postedBy = req.profile;
//         if (files.photo) {
//             post.photo.data = fs.readFileSync(files.photo.path);
//             post.photo.contentType = files.photo.type;
//         }
//         post.save((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: errHandler.getErrorMessage(err)
//                 });
//             }
//             result.postedBy.salt = undefined;
//             result.postedBy.hashed_password = undefined;
//             res.json(result);
//         })
//     })
// };

// const answer = (req, res) => {
//     let answer = {};
//     answer.content = req.body.answer;
//     answer.postedBy = req.body.userId;
//     Post.findByIdAndUpdate(req.body.postId, { $push: { answers: answer } }, { new: true })
//         .populate('answers.postedBy', '_id name')
//         .populate('postedBy', '_id name')
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: errHandler.getErrorMessage(err)
//                 })
//             }
//             res.json(result)
//         })
// }

// const comment = (req, res, next) => {

//     Post.findById(req.body.postId)
//         .populate('answers.comments.postedBy', '_id name')
//         .exec((err, result) => {
//             if (err) {
//                 res.status(400).json({
//                     error: errHandler.getErrorMessage(err)
//                 })
//             }
//             for (let i = 0; i < result.answers.length; i++) {
//                 if (result.answers[i].id === req.body.answerId) {
//                     result.answers[i].comments.push({
//                         text: req.body.comment,
//                         postedBy: {
//                             _id: req.profile.id,
//                             name: req.profile.name,
//                         }
//                     })
//                     break;
//                 }
//             }
//             result.save((err, post) => {
//                 if (err) {
//                     res.status(400).json({
//                         error: errHandler.getErrorMessage(err)
//                     })
//                 }
//                 res.json(post);
//             })
//         })
// }

// export default {
//     create,
//     answer,
//     comment
// }

