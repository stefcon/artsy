"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
        type: String
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
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map