"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
        type: [mongoose_1.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    pictures: {
        type: [String]
    }
});
exports.default = mongoose_1.default.model('Workshop', Workshop, 'workshops');
//# sourceMappingURL=workshop.js.map