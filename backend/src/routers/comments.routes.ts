import express from 'express';
import { CommentController } from '../controllers/comment.controller';

const commentRouter = express.Router();

commentRouter.get('/getComments',
    (req, res)=>new CommentController().getCommentsForUser(req, res)
);

commentRouter.get('/getCommentsWorkshop',
    (req, res) => new CommentController().getCommentsForWorkshop(req, res)
);

commentRouter.post('/sendCommentsWorkshop',
    (req, res) => new CommentController().addComment(req, res)
);

commentRouter.post('/sendLike',
    (req, res) => new CommentController().changeLike(req, res)
);

commentRouter.put('/editComment', 
    (req, res) => new CommentController().editComment(req, res)
);

commentRouter.post('/deleteComment', 
    (req, res) => new CommentController().deleteComment(req, res)
);

export default commentRouter;