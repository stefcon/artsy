import * as express from 'express';
import Workshop from '../models/workshop';
import Message from '../models/messages';
import User from '../models/user';

export class MessageController {
    getMessagesForChat = async (req, res) => {
        const {sender, receiver, workshopId} = req.query;
        
        console.log('hvataj poruke');

        console.log(sender);
        console.log(receiver);
        console.log(workshopId);

        const firstCondition = { sendUser: sender, receiveUser: receiver, workshopId: workshopId }
        const secondCondition = { sendUser: receiver, receiveUser: sender, workshopId: workshopId }

        const messages = await Message.find({ $or: [firstCondition, secondCondition]}).sort({timestamp: -1});
        res.json(messages);
    }

    addMessage = async (req, res) => {
        const {message} = req.body;
        const newMessage = new Message();
        newMessage.text = message.text;
        newMessage.sendUser = message.sendUser;
        newMessage.receiveUser = message.receiveUser;
        newMessage.workshopId = message.workshopId;

        newMessage.save((err) => {
            if (err) {
                res.status(500).json(err);
            }
            else {
                res.send({message: 'OK'});
            }
        });
    }

    getUsersWhoContactedMe = async (req, res) => {

        const {workshopId, username} = req.query;

        console.log('contact me');
        console.log(workshopId);
        console.log(username);

        const messagesReceived = await Message.find({receiveUser: username, workshopId: workshopId}).sort({timestamp: -1});
        var participantArray = [];

        if (messagesReceived.length) {
            console.log(messagesReceived);
            var participantSet = new Set<string>();
            messagesReceived.forEach((m) => {
                participantSet.add(m.sendUser);
            });
    
            participantArray = Array.from(participantSet.values());
    
            participantArray = await User.find({username: {$in: participantArray}});
        }
        console.log(participantArray);
        res.json(participantArray);
    }
}