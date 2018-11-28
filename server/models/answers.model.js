import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    postID: String,
    content: {
        type: String,
        required: 'Cannot post empty answer'
    },
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    likes: { type: mongoose.Schema.ObjectId, ref: 'User' },

});

export default mongoose.model('Answer', AnswerSchema);



