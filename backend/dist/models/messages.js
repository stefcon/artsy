"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Message = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
        ref: 'Workshop',
        required: true
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Message', Message, 'messages');
//# sourceMappingURL=messages.js.map