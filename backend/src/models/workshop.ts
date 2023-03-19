import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

let Workshop = new Schema({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    address: {
        type: String
    },
    shortDesc: {
        type: String
    },
    longDesc: {
        type: String
    },
    likedBy: {
        type: [String],
        default: [] 
    },
    signedUp: {
        type: [String],
        default: [] 
    },
    waitlist: {
        type: [String],
        default: [] 
    },
    emailList: {
        type: [String],
        default: []
    },
    seats: {
        type: Number
    },
    organizer: {
        type: String
    },
    approved: {
        type: Number
    },
    comments: {
        type: [Types.ObjectId], 
        ref: 'Comment', 
        default: []
    },
    pictures: {
        type: [String]
    }
});

export default mongoose.model('Workshop', Workshop, 'workshops');