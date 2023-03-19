"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Comment = new mongoose_1.Schema({
    text: {
        type: String
    },
    sendUser: {
        type: String
    },
    workshopId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Workshop',
        required: true
    },
    workshopName: {
        type: String
    },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Comment', Comment, 'comments');
//# sourceMappingURL=comments.js.map