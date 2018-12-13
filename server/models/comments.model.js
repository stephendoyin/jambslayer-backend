import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    answerID: String,
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    content: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    modified: Boolean,
    replies: [{
        likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        content: String,
        created: { type: Date, default: Date.now },
        postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }]
});

export default mongoose.model('Comment', CommentSchema);
