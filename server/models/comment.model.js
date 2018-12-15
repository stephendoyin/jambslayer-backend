import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    answerID: String,
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    content: String,
    replies: [{ type: mongoose.Schema.ObjectId, ref: 'Reply' }],
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    modified: Boolean

});

export default mongoose.model('Comment', CommentSchema);
