import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    content: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    modified: Boolean
});

export default mongoose.model('Reply', ReplySchema);
