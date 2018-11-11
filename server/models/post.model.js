import mongoose from 'mongoose';
//import bycrpt from 'bcrypt';

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: 'Empty Post'
    },
    edited: Boolean,
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    created: {
        type: Date,
        default: Date.now
    },
    Answers: [{
        content: {
            type: String,
            required: 'Empty Post'
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        edited: Boolean,
        likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        created: { type: Date, default: Date.now },
        comments: [{
            likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }]
    }],
    tag: {
        type: String,
        required: 'tag cannot be empty'
}
});

// const PostSchema = new mongoose.Schema({
//     text: {
//       type: String,
//       required: 'Name is required'
//     },
//     photo: {
//       data: Buffer,
//       contentType: String
//     },
//     likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
//     comments: [{
//       text: String,
//       created: { type: Date, default: Date.now },
//       postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
//     }],
//     postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
//     created: {
//       type: Date,
//       default: Date.now
//     }
//   })
  
export default mongoose.model('Post', PostSchema);