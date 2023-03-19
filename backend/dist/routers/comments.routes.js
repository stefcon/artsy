"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const commentRouter = express_1.default.Router();
commentRouter.get('/getComments', (req, res) => new comment_controller_1.CommentController().getCommentsForUser(req, res));
commentRouter.get('/getCommentsWorkshop', (req, res) => new comment_controller_1.CommentController().getCommentsForWorkshop(req, res));
commentRouter.post('/sendCommentsWorkshop', (req, res) => new comment_controller_1.CommentController().addComment(req, res));
commentRouter.post('/sendLike', (req, res) => new comment_controller_1.CommentController().changeLike(req, res));
commentRouter.put('/editComment', (req, res) => new comment_controller_1.CommentController().editComment(req, res));
commentRouter.post('/deleteComment', (req, res) => new comment_controller_1.CommentController().deleteComment(req, res));
exports.default = commentRouter;
//# sourceMappingURL=comments.routes.js.map