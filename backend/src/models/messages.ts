import { Schema, model, Types } from 'mongoose';

const Message = new Schema({
    text: {
        type: String
    },
    sendUser: {
        type: String
    },
    receiveUser: {
        type: String
    },
    workshopId: {
        type: Types.ObjectId,
        ref: 'Workshop',
        required: true
    }
},
{
    timestamps: true
});

export default model('Message', Message, 'messages');
