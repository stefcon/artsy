"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const messageRouter = express_1.default.Router();
messageRouter.get('/chat', (req, res) => new message_controller_1.MessageController().getMessagesForChat(req, res));
messageRouter.post('/chat', (req, res) => new message_controller_1.MessageController().addMessage(req, res));
messageRouter.get('/getChatParticipants', (req, res) => new message_controller_1.MessageController().getUsersWhoContactedMe(req, res));
exports.default = messageRouter;
//# sourceMappingURL=messages.routes.js.map