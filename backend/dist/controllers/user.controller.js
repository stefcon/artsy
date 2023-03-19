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
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const comments_1 = __importDefault(require("../models/comments"));
const messages_1 = __importDefault(require("../models/messages"));
const workshop_1 = __importDefault(require("../models/workshop"));
const crypto_1 = __importDefault(require("crypto"));
const mailer_1 = __importDefault(require("../mailer"));
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ username: username, password: password, status: 1 }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    console.log(user);
                    res.json(user);
                }
            });
        });
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield user_1.default.find({});
            res.json(users);
        });
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            const user = yield user_1.default.findOne({ username: username });
            console.log(user);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        });
        this.register = (req, res) => {
            // Password checks
            let password1 = req.body.password1;
            let password2 = req.body.password2;
            if (password1 !== password2)
                return res.status(400).json({ 'message': "Passwords do not match!" });
            if (password1.length < 8 || password1.length > 16)
                return res.status(400).json({ 'message': "Password must be between 8 and 16 characters!" });
            if (/^[a-zA-Z]/.test(password1) == false)
                return res.status(400).json({ 'message': "Password must start with a letter!" });
            const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%\^&(){}\[\]:;<>,.?\/~_+=|-]).{8,16}$/;
            if (passRegex.test(password1) == false)
                return res.status(400).json({ 'message': "Password must at least contain: one uppercase letter, one number and one special character!" });
            console.log(req.body.email);
            console.log(req.body.username);
            console.log(req.file);
            user_1.default.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    if (user) {
                        console.log(user);
                        return res.status(400).json({ 'message': 'Username or email are already in use!' });
                    }
                    else {
                        const filePath = req.protocol + '://' + req.get("host") + '\\' + ((req.file) ? req.file.path : 'src\\images\\default.jpg');
                        console.log(filePath);
                        let user = new user_1.default({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username,
                            password: req.body.password1,
                            tel: req.body.tel,
                            email: req.body.email,
                            type: parseInt(req.body.type),
                            profileImage: filePath,
                            status: (req.body.direct === 'true') ? 1 : 0,
                            organizationName: req.body.organizationName,
                            organizationAddress: req.body.organizationAddress,
                            organizationID: req.body.organizationID
                        });
                        console.log(user);
                        user.save().then(user => {
                            res.status(200).json({ 'message': 'ok' });
                        }).catch(err => {
                            res.status(400).json({ 'message': 'Unexpected error!' });
                        });
                    }
                }
            });
        };
        this.generatePasswordResetHash = (password) => {
            const resetHash = crypto_1.default.createHash('sha512').update(password).digest('hex');
            return resetHash;
        };
        this.verifyPasswordResetHash = (resetLinkDate, password, resetHash = undefined) => {
            console.log((new Date().getTime() - resetLinkDate.getTime()) / (1000 * 60 * 60));
            return this.generatePasswordResetHash(password) === resetHash
                && ((new Date().getTime() - resetLinkDate.getTime()) / (1000 * 60 * 60) < 30);
        };
        this.resetPasswordPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ email: req.body.email });
                if (user) {
                    const hash = yield this.generatePasswordResetHash(user.password);
                    //generate a password reset link
                    const resetLink = `http://localhost:4200/reset?email=${user.email}&hash=${hash}`;
                    // Store reset link date
                    user.resetLinkDate = new Date();
                    user.save();
                    // send email to the user
                    let mailOptions = {
                        from: 'bs190253d@student.etf.bg.ac.rs',
                        subject: 'Password Reset',
                        to: user.email,
                        text: `Link za resetovanje vase lozinke: ${resetLink}`
                    };
                    mailer_1.default.sendMail(mailOptions, function (err, info) {
                        if (err)
                            console.log(err);
                        else
                            console.log(`Email has been sent: ${info.response}`);
                    });
                    res.json({ message: 'Reset link has been sent to your email address.' });
                }
                else {
                    return res.status(400).json({
                        message: "Email Address is invalid."
                    });
                }
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Internal server error."
                });
            }
        });
        this.resetPasswordGet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //check for email and hash in query parameter
                if (req.query && req.query.email && req.query.hash) {
                    //find user with suh email address
                    console.log(req.query.email);
                    const user = yield user_1.default.findOne({ email: req.query.email });
                    //check if user object is not empty
                    if (user) {
                        //now check if hash is valid
                        if (this.verifyPasswordResetHash(user.resetLinkDate, user.password, req.query.hash)) {
                            //issue a password reset form
                            return res.status(200).json(user);
                        }
                        else {
                            return res.status(400).json({
                                message: "You have provided an invalid reset link."
                            });
                        }
                    }
                    else {
                        return res.status(400).json({
                            message: "You have provided an invalid reset link. (email)"
                        });
                    }
                }
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Usao za pass');
            const { username, password } = req.body;
            yield user_1.default.updateOne({ username: username }, { password: password });
            res.json({ message: 'OK' });
        });
        this.resolveRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, action } = req.body;
            if (action) {
                // Accept
                yield user_1.default.updateOne({ username: username }, { status: 1 });
            }
            else {
                // Reject
                yield user_1.default.updateOne({ username: username }, { status: 2 });
            }
            res.json({ message: 'OK' });
        });
        this.editUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user } = req.body;
            console.log(user);
            yield user_1.default.replaceOne({ username: user.username }, user);
            res.json({ message: 'OK' });
        });
        this.editPhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.file);
            const filePath = req.protocol + '://' + req.get("host") + '\\' + req.file.path;
            const { username } = req.query;
            yield user_1.default.updateOne({ username: username }, { profileImage: filePath });
            res.json({ message: 'OK' });
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.body;
            // Remove likes from user that is being delted
            yield workshop_1.default.updateMany({ likedBy: username }, { $pull: { likedBy: username } });
            // Remove all comments from user that is being deleted (from the workshops first)
            const userComments = yield comments_1.default.find({ sendUser: username });
            for (let i = 0; i < userComments.length; ++i) {
                yield workshop_1.default.updateMany({ comments: userComments[i]._id }, { $pull: { comments: userComments[i]._id } });
            }
            yield comments_1.default.deleteMany({ sendUser: username });
            // Delete all messages that had user involved
            yield messages_1.default.deleteMany({ $or: [{ sendUser: username }, { receiveUser: username }] });
            yield user_1.default.deleteOne({ username: username });
            // If organizer, delete all workshops that he had organized
            const workshops = yield workshop_1.default.find({ organizer: username });
            workshops.forEach((workshopInfo) => __awaiter(this, void 0, void 0, function* () {
                // Delete commentns on the workshop being deleted
                yield comments_1.default.deleteMany({ workshopId: workshopInfo._id });
                // Delete messages connected to workshop
                yield messages_1.default.deleteMany({ workshopId: workshopInfo._id });
                // Delete workshop itself
                workshopInfo.delete();
            }));
            res.json({ message: 'OK' });
        });
        this.signedSomewhere = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username } = req.query;
            const signedUpWorkshops = yield workshop_1.default.find({ signedUp: username });
            if (signedUpWorkshops.length) {
                res.json(true);
            }
            else {
                res.json(false);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map