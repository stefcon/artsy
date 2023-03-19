import mongoose, { Types } from 'mongoose';


const Schema = mongoose.Schema;

let User = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    tel: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    type: {
        type: Number
    },
    profileImage: {
        type:  String
    },
    status: {
        type: Number
    },
    organizationName: {
        type: String
    },
    organizationAddress: {
        type: String
    },
    organizationID: {
        type: String
    },
    resetLinkDate: {
        type: Date
    }
}
);

export default mongoose.model('User', User, 'users');