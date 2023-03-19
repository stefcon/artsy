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
exports.CommentController = void 0;
const comments_1 = __importDefault(require("../models/comments"));
const workshop_1 = __importDefault(require("../models/workshop"));
class CommentController {
    constructor() {
        this.getCommentsForUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            const comments = yield comments_1.default.find({ sendUser: username });
            res.json(comments);
        });
        this.getCommentsForWorkshop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshopId } = req.query;
            const comments = yield comments_1.default.find({ workshopId: workshopId });
            res.json(comments);
        });
        this.addComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshop, username, inputText } = req.body;
            const newComment = new comments_1.default({
                text: inputText,
                sendUser: username,
                workshopId: workshop._id,
                workshopName: workshop.name
            });
            // Updating reference inside workshop!
            yield workshop_1.default.updateOne({ _id: workshop._id }, { $push: { comments: newComment._id } });
            newComment.save();
            res.json(newComment);
        });
        this.editComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comment } = req.body;
            const newComment = yield comments_1.default.findOneAndUpdate({ _id: comment._id }, { text: comment.text });
            res.json(newComment);
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comment } = req.body;
            // Delete comment form workshop
            yield workshop_1.default.updateOne({ _id: comment.workshopId }, { $pull: { comments: comment._id } });
            // Delete comment itself
            yield comments_1.default.deleteOne({ _id: comment._id });
            const comments = yield comments_1.default.find({});
            res.json(comments);
        });
        this.changeLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshop, username, action } = req.body;
            const workshopInfo = yield workshop_1.default.findOne({ _id: workshop._id });
            if (action) {
                workshopInfo.likedBy.push(username);
            }
            else {
                const index = workshopInfo.likedBy.indexOf(username);
                workshopInfo.likedBy.splice(index, 1);
            }
            workshopInfo.save();
            res.json({ message: 'OK' });
        });
    }
}
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map