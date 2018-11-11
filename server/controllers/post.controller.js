import Post from '../models/post.model';
import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';

const create = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Post couldn't be uploaded"
            });
        }
        let post = new Post(fields);
        post.posted
    })
}