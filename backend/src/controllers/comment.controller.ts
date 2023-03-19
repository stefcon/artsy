import * as express from 'express';
import Comment from '../models/comments';
import Workshop from '../models/workshop';

export class CommentController {
    getCommentsForUser = async (req, res) => {
        const {username} = req.query;
        const comments = await Comment.find({sendUser: username});
        res.json(comments);
    }

    getCommentsForWorkshop = async (req, res) => {
        const { workshopId } = req.query;

        const comments = await Comment.find({workshopId: workshopId});
        res.json(comments);
    }

    addComment = async (req, res) => {
        const { workshop, username, inputText } = req.body;

        const newComment = new Comment({
            text: inputText,
            sendUser: username,
            workshopId: workshop._id,
            workshopName: workshop.name
        });

        // Updating reference inside workshop!
        await Workshop.updateOne({_id: workshop._id}, { $push: {comments: newComment._id}});
        
        newComment.save();
        res.json(newComment);
    }

    editComment = async (req, res) => {
        const { comment } = req.body;

        const newComment = await Comment.findOneAndUpdate({ _id: comment._id }, { text: comment.text });
        res.json(newComment);
    }

    deleteComment = async (req, res) => {
        const { comment } = req.body;

        // Delete comment form workshop
        await Workshop.updateOne({ _id: comment.workshopId }, { $pull: {comments: comment._id }});

        // Delete comment itself
        await Comment.deleteOne({ _id: comment._id});

        const comments = await Comment.find({});

        res.json(comments);
    }

    changeLike = async (req, res) => {
        const { workshop, username, action } = req.body;

        const workshopInfo = await Workshop.findOne({_id: workshop._id});
        if (action) {
            workshopInfo.likedBy.push(username);
        }
        else {
            const index = workshopInfo.likedBy.indexOf(username);
            workshopInfo.likedBy.splice(index, 1);
        }
        workshopInfo.save();
        res.json({message: 'OK'});
    }



}