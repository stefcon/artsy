"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const messages_1 = __importDefault(require("../models/messages"));
const user_1 = __importDefault(require("../models/user"));
class MessageController {
    constructor() {
        this.getMessagesForChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { sender, receiver, workshopId } = req.query;
            console.log('hvataj poruke');
            console.log(sender);
            console.log(receiver);
            console.log(workshopId);
            const firstCondition = { sendUser: sender, receiveUser: receiver, workshopId: workshopId };
            const secondCondition = { sendUser: receiver, receiveUser: sender, workshopId: workshopId };
            const messages = yield messages_1.default.find({ $or: [firstCondition, secondCondition] }).sort({ timestamp: -1 });
            res.json(messages);
        });
        this.addMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { message } = req.body;
            const newMessage = new messages_1.default();
            newMessage.text = message.text;
            newMessage.sendUser = message.sendUser;
            newMessage.receiveUser = message.receiveUser;
            newMessage.workshopId = message.workshopId;
            newMessage.save((err) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    res.send({ message: 'OK' });
                }
            });
        });
        this.getUsersWhoContactedMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshopId, username } = req.query;
            console.log('contact me');
            console.log(workshopId);
            console.log(username);
            const messagesReceived = yield messages_1.default.find({ receiveUser: username, workshopId: workshopId }).sort({ timestamp: -1 });
            var participantArray = [];
            if (messagesReceived.length) {
                console.log(messagesReceived);
                var participantSet = new Set();
                messagesReceived.forEach((m) => {
                    participantSet.add(m.sendUser);
                });
                participantArray = Array.from(participantSet.values());
                participantArray = yield user_1.default.find({ username: { $in: participantArray } });
            }
            console.log(participantArray);
            res.json(participantArray);
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map