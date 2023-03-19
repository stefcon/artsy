import express from 'express';
import { MessageController } from '../controllers/message.controller';

const messageRouter = express.Router();

messageRouter.get('/chat',
    (req, res)=>new MessageController().getMessagesForChat(req, res)
);

messageRouter.post('/chat',
    (req, res) => new MessageController().addMessage(req, res)
);

messageRouter.get('/getChatParticipants', 
    (req, res) => new MessageController().getUsersWhoContactedMe(req, res)
);

export default messageRouter;