"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.WorkshopController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const messages_1 = __importDefault(require("../models/messages"));
const comments_1 = __importDefault(require("../models/comments"));
const user_1 = __importDefault(require("../models/user"));
const fs = __importStar(require("fs"));
const mailer_1 = __importDefault(require("../mailer"));
class WorkshopController {
    constructor() {
        this.getAllWorkshops = (req, res) => {
            workshop_1.default.find({}, (err, workshops) => {
                if (err)
                    console.log(err);
                else
                    res.json(workshops);
            });
        };
        this.getAttendedWorkshops = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            const attendedWorkshops = yield workshop_1.default.find({ signedUp: username, date: { $lt: new Date() } });
            res.json(attendedWorkshops);
        });
        this.getUpcomingWorkshops = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            const upcomingWorkshops = yield workshop_1.default.find({ signedUp: username, date: { $gt: new Date() } });
            res.json(upcomingWorkshops);
        });
        this.getLikedWorkshops = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            const likedWorkshops = yield workshop_1.default.find({ likedBy: username });
            res.json(likedWorkshops);
        });
        this.hasAttendedWorkshop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshopName, username } = req.body;
            const attendedWorkshop = yield workshop_1.default.findOne({ signedUp: username,
                name: workshopName,
                date: { $lt: new Date() }
            });
            if (attendedWorkshop) {
                res.json(true);
            }
            else {
                res.json(false);
            }
        });
        this.getWorkshopsWithMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            console.log('messages');
            messages_1.default.find({ $or: [{ sendUser: username }, { receiveUser: username }] })
                .populate('workshopId')
                .exec(function (err, msgs) {
                if (err) {
                    res.status(500).json({ message: 'Error while fetching workshops' });
                }
                else {
                    var workshopSet = new Set();
                    msgs.forEach((msg) => {
                        workshopSet.add(msg.workshopId);
                    });
                    res.json(Array.from(workshopSet.values()));
                }
            });
        });
        this.addWorkshop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('usao');
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
            const newWorkshop = new workshop_1.default({
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
            });
            console.log(newWorkshop);
            newWorkshop.save().then(w => {
                res.json(newWorkshop);
            }).catch(err => {
                res.status(400).json({ message: 'Unexpected error!' });
            });
        });
        this.changeMainPhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.file);
            const id = req.body.id;
            console.log(id);
            const image_path = req.protocol + '://' + req.get("host") + '\\' + req.file.path;
            const workshopInfo = yield workshop_1.default.findOne({ _id: id });
            if (workshopInfo.pictures.length) {
                workshopInfo.pictures[0] = image_path;
            }
            else {
                workshopInfo.pictures.push(image_path);
            }
            workshopInfo.save();
            res.json({ message: 'OK' });
        });
        this.changeGallery = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Galerija izmena');
            console.log(req.files);
            const id = req.body.id;
            const workshopInfo = yield workshop_1.default.findOne({ _id: id });
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
            res.json({ message: 'OK' });
        });
        this.editWorkshop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { workshop } = req.body;
            const newWorkshop = yield workshop_1.default.findOneAndUpdate({ _id: id }, workshop);
            if (!newWorkshop) {
                res.status(404).json({ message: 'Object not found' });
            }
            else {
                res.json(newWorkshop);
            }
        });
        this.deleteWorkshop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const workshopInfo = yield workshop_1.default.findOne({ _id: id });
            // Delete commentns on the workshop being deleted
            yield comments_1.default.deleteMany({ workshopId: workshopInfo._id });
            // Delete messages connected to workshop
            yield messages_1.default.deleteMany({ workshopId: workshopInfo._id });
            // Delete workshop itself
            workshop_1.default.deleteOne({ _id: id }).then(function () {
                res.json({ message: 'OK' });
            }).catch(function (error) {
                res.status(500).json(error);
            });
        });
        this.resolveRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshop, action } = req.body;
            console.log(workshop);
            console.log(action);
            if (action) {
                // Accept
                yield workshop_1.default.updateOne({ _id: workshop._id }, { approved: 1 });
                // Upgrade User to organizer, whatever he may be
                yield user_1.default.updateOne({ username: workshop.organizer }, { $set: { type: 1 } });
            }
            else {
                // Reject
                yield workshop_1.default.updateOne({ _id: workshop._id }, { approved: 2 });
            }
            res.json({ message: 'OK' });
        });
        this.cancelApplication = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshop, username } = req.body;
            const workshopInfo = yield workshop_1.default.findOneAndUpdate({ _id: workshop._id }, { $pull: { signedUp: username } });
            console.log(workshopInfo);
            // Notify everyone that is on email list if 
            if (workshopInfo.emailList.length) {
                let emails = '';
                for (let i = 0; i < workshopInfo.emailList.length; ++i) {
                    emails += workshopInfo.emailList[i];
                    if (i < workshopInfo.signedUp.length - 1)
                        emails += ', ';
                }
                let mailOptions = {
                    from: 'bs190253d@student.etf.bg.ac.rs',
                    subject: 'Workshop Notification',
                    to: emails,
                    text: `Radionica ${workshopInfo.name} ponovo ima slobodnih mesta. Zauzmite dok jos mozete!`
                };
                mailer_1.default.sendMail(mailOptions, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(`Email has been sent: ${info.response}`);
                });
                // Empty email list
                workshopInfo.emailList = [];
                workshopInfo.save();
            }
            // Return updated list
            const upcomingWorkshops = yield workshop_1.default.find({ signedUp: username, date: { $gt: new Date() } });
            res.json(upcomingWorkshops);
        });
        this.cancelWorkshop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workshop } = req.body;
            const workshopInfo = yield workshop_1.default.findOneAndUpdate({ _id: workshop._id }, { $set: { approved: 2 } });
            // Contact everyone who signed up
            let emails = '';
            for (let i = 0; i < workshopInfo.signedUp.length; ++i) {
                const user = yield user_1.default.findOne({ username: workshopInfo.signedUp[i] });
                emails += user.email;
                if (i < workshopInfo.signedUp.length - 1)
                    emails += ', ';
            }
            console.log(emails);
            let mailOptions = {
                from: 'bs190253d@student.etf.bg.ac.rs',
                to: emails,
                subject: 'Workshop Cancellation',
                text: `Radionica ${workshopInfo.name} je otkazana.`
            };
            mailer_1.default.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(`Email has been sent: ${info.response}`);
            });
            res.json({ message: 'OK' });
        });
        this.notifyUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, workshop } = req.body;
            console.log(email);
            const workshopInfo = yield workshop_1.default.findOneAndUpdate({ _id: workshop._id }, { $push: { emailList: email } });
            res.json(workshopInfo);
        });
    }
}
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map