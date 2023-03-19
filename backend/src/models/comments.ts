import { Schema, model, Types } from 'mongoose';

const Comment = new Schema({
    text: {
        type: String
    },
    sendUser: {
        type: String
    },
    workshopId: {
        type: Types.ObjectId,
        ref: 'Workshop',
        required: true
    },
    workshopName: {
        type: String
    },
},
{
    timestamps: true
});

export default model('Comment', Comment, 'comments');
