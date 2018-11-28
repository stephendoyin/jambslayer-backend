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
    tag: {
        type: String,
        required: 'tag cannot be empty'
    },
    edited: Boolean,
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    created: { type: Date, default: Date.now }
});

export default mongoose.model('Post', PostSchema);