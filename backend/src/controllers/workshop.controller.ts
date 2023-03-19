import * as express from 'express';
import Workshop from '../models/workshop';
import Message from '../models/messages';
import Comment from '../models/comments';
import User from '../models/user';
import * as fs from 'fs';

import transporter from '../mailer';

export class WorkshopController {
    getAllWorkshops = (req: express.Request, res: express.Response) => {
        Workshop.find({}, (err, workshops) => {
            if (err) console.log(err);
            else res.json(workshops);
        });
    }

    getAttendedWorkshops = async (req: express.Request, res: express.Response) =>{
        const {username} = req.query;

        const attendedWorkshops = await Workshop.find({signedUp: username, date: {$lt: new Date()}});
        res.json(attendedWorkshops);
    }

    getUpcomingWorkshops = async (req: express.Request, res: express.Response) => {
        const { username } = req.query;

        const upcomingWorkshops = await Workshop.find({signedUp: username, date: {$gt: new Date()}});
        res.json(upcomingWorkshops);
    }

    getLikedWorkshops = async (req: express.Request, res: express.Response) => {
        const {username} = req.query;

        
        const likedWorkshops = await Workshop.find({likedBy : username});
        
        res.json(likedWorkshops);
    }

    hasAttendedWorkshop = async (req, res) => {
        const {workshopName, username} = req.body;

        const attendedWorkshop = await Workshop.findOne({signedUp: username,
                                                         name: workshopName,
                                                         date: {$lt: new Date()}
                                                        });
        if (attendedWorkshop) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }

    getWorkshopsWithMessages = async (req, res) => {
        const { username } = req.query;

        console.log('messages')
        Message.find({$or: [{sendUser: username}, {receiveUser: username}]})
               .populate('workshopId')
               .exec(function (err, msgs) {
                    if (err) {res.status(500).json({message: 'Error while fetching workshops'})}
                    else {
                        var workshopSet = new Set();
                        msgs.forEach((msg) => {
                            workshopSet.add(msg.workshopId);
                        });
                        res.json(Array.from(workshopSet.values()));
                    }
               })
        
    }

    addWorkshop = async (req, res) => {

        console.log('usao')
        console.log(req.body);

        // console.log(req.files);
        
        // var pictures = [];
        // if (req.files) {
        //     for (let i = 0; i < req.files.length; ++i) {
        //         pictures.push( req.protocol + '://' + req.get('host') + '\\' + req.files[i].path);
        //     }
        // }
        // else {
        //     pictures = req.body.pictures || [];
        // }
        // 
        // console.log(pictures);

        const newWorkshop = new Workshop(
            {
                name: req.body.name,
                date: new Date(req.body.date),
                address: req.body.address,
                shortDesc: req.body.shortDesc,
                longDesc: req.body.longDesc,
                likedBy: [],
                signedUp: [],
                waitlist: [],
                seats: parseInt(req.body.seats),
                organizer: req.body.organizer,
                approved: 0,
                pictures: req.body.pictures
            }
        );
        console.log(newWorkshop)
        newWorkshop.save().then(w => {
            res.json(newWorkshop);
        }).catch(err => {
            res.status(400).json({message: 'Unexpected error!' });
        });
    }

    changeMainPhoto = async (req, res) => {
        console.log(req.file);

        const id = req.body.id;
        console.log(id);

        const image_path = req.protocol + '://' + req.get("host") + '\\' + req.file.path;

        const workshopInfo = await Workshop.findOne({_id: id});
        if  (workshopInfo.pictures.length) {
            workshopInfo.pictures[0] = image_path;
        }
        else {
            workshopInfo.pictures.push(image_path);
        }
        workshopInfo.save();
        res.json({message: 'OK'});
    }

    changeGallery = async (req, res) => {
        console.log('Galerija izmena')
        console.log(req.files);

        const id = req.body.id;
        
        const workshopInfo = await Workshop.findOne({_id: id});
        const file_prefix = req.protocol + '://' + req.get('host') + '\\';

        // Delete previous pictures
        console.log(workshopInfo.pictures.length);
        for (let i = 1; i < workshopInfo.pictures.length; ++i) {
            console.log(workshopInfo.pictures[i].slice(file_prefix.length));
            fs.unlink(workshopInfo.pictures[i].slice(file_prefix.length), (err) => console.log(err));
        }

        // Update new pictures paths, except main!
        if (workshopInfo.pictures.length > 1)
            workshopInfo.pictures.splice(1, workshopInfo.pictures.length - 1);
        for (let i = 0; i < req.files.length; ++i) {
            workshopInfo.pictures.push(file_prefix + req.files[i].path);
        }

        console.log(workshopInfo);
        workshopInfo.save();
        res.json({message: 'OK'});
    }

    editWorkshop = async (req, res) => {
        const { id } = req.params;
        const { workshop } = req.body;

        const newWorkshop = await Workshop.findOneAndUpdate({_id: id}, workshop);
        if (!newWorkshop) { 
            res.status(404).json({message: 'Object not found'});
        }
        else {
            res.json(newWorkshop);
        }
    }

    deleteWorkshop = async (req, res) => {
        const { id } = req.params;
        console.log(id);

        const workshopInfo = await Workshop.findOne({ _id: id});
        
        // Delete commentns on the workshop being deleted
        await Comment.deleteMany({workshopId: workshopInfo._id});
        
        // Delete messages connected to workshop
        await Message.deleteMany({workshopId: workshopInfo._id});

        // Delete workshop itself
        Workshop.deleteOne({ _id: id}).then(function () {
            res.json({message: 'OK'});
        }).catch(function (error) {
            res.status(500).json(error);
        });
    }

    resolveRequest = async (req, res) => {
        const {workshop, action} = req.body;
        console.log(workshop);
        console.log(action)

        if (action) {
            // Accept
            await Workshop.updateOne({_id: workshop._id}, {approved: 1});
            // Upgrade User to organizer, whatever he may be
            await User.updateOne({username: workshop.organizer}, {$set: {type: 1}});
        }
        else {
            // Reject
            await Workshop.updateOne({_id: workshop._id}, {approved: 2});
        }

        res.json({message: 'OK'});
    }

    cancelApplication = async (req, res) => {
        const {workshop, username} = req.body;

        const workshopInfo = await Workshop.findOneAndUpdate({ _id: workshop._id}, {$pull: {signedUp: username}});
        console.log(workshopInfo);

        // Notify everyone that is on email list if 
        if (workshopInfo.emailList.length) {
            let emails = ''
            for (let i = 0; i < workshopInfo.emailList.length; ++i) {
                emails += workshopInfo.emailList[i];
                if (i < workshopInfo.signedUp.length - 1) emails += ', ';
            }

            let mailOptions = {
                from: 'bs190253d@student.etf.bg.ac.rs',
                subject: 'Workshop Notification',
                to: emails,
                text: `Radionica ${workshopInfo.name} ponovo ima slobodnih mesta. Zauzmite dok jos mozete!`
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) console.log(err);
                else console.log(`Email has been sent: ${info.response}`);
            });

            // Empty email list
            workshopInfo.emailList = [];
            workshopInfo.save();
        }

        // Return updated list
        const upcomingWorkshops = await Workshop.find({signedUp: username, date: {$gt: new Date()}});
        res.json(upcomingWorkshops);
    }

    cancelWorkshop = async (req, res) => {
        const { workshop } = req.body;

        const workshopInfo = await Workshop.findOneAndUpdate({ _id: workshop._id}, {$set: {approved: 2}});

        // Contact everyone who signed up
        let emails = '';
        for (let i = 0; i < workshopInfo.signedUp.length; ++i) {
            const user = await User.findOne({username: workshopInfo.signedUp[i]});
            emails += user.email;
            if (i < workshopInfo.signedUp.length - 1) emails += ', ';
        }
        console.log(emails);
        let mailOptions = {
            from: 'bs190253d@student.etf.bg.ac.rs',
            to: emails,
            subject: 'Workshop Cancellation',
            text: `Radionica ${workshopInfo.name} je otkazana.`
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err);
            else console.log(`Email has been sent: ${info.response}`);
        });

        res.json({message: 'OK'});
    }

    notifyUser = async (req, res) => {
        const { email, workshop } = req.body;

        console.log(email); 

        const workshopInfo = await Workshop.findOneAndUpdate({ _id: workshop._id }, {$push: {emailList: email}});
        res.json(workshopInfo);
    }
}