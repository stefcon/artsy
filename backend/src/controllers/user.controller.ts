import * as express from 'express';
import User from '../models/user';
import Comment from '../models/comments';
import Message from '../models/messages';
import Workshop from '../models/workshop';
import crypto from 'crypto';
import transporter from '../mailer';

export class UserController {

    
    login = async (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        
        User.findOne({username: username, password: password, status: 1}, (err, user)=>{
            if (err) console.log(err);
            else {console.log(user); res.json(user);}
        });
    }

    getAllUsers = async (req, res) => {
        const users = await User.find({});
        res.json(users);
    }
    
    getUser = async (req, res) => {
        const { username } = req.query;

        const user = await User.findOne({username: username});
        console.log(user);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({message: 'User not found'})
        }
    }

    register = (req, res: express.Response) => {
        
        // Password checks
        let password1 = req.body.password1;
        let password2 = req.body.password2;

        if (password1 !== password2) return res.status(400).json({ 'message' : "Passwords do not match!"});
        if (password1.length < 8 || password1.length > 16) return res.status(400).json({ 'message' : "Password must be between 8 and 16 characters!"});
        if (/^[a-zA-Z]/.test(password1) == false) return res.status(400).json({ 'message' : "Password must start with a letter!"});

        const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%\^&(){}\[\]:;<>,.?\/~_+=|-]).{8,16}$/;
        if (passRegex.test(password1) == false) return res.status(400).json({ 'message' : "Password must at least contain: one uppercase letter, one number and one special character!"});



        console.log(req.body.email);
        console.log(req.body.username);
        console.log(req.file);


        User.findOne({$or:[{username: req.body.username}, {email: req.body.email}]}, (err, user)=>{
            if (err) console.log(err);
            else {
                if (user){
                    
                    console.log(user);
                    return res.status(400).json({'message': 'Username or email are already in use!'});
                }
                else {
                    const filePath = req.protocol + '://' + req.get("host") + '\\' + ((req.file) ? req.file.path : 'src\\images\\default.jpg');
                    console.log(filePath);

                    let user = new User(
                        {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username,
                            password: req.body.password1,
                            tel: req.body.tel,
                            email: req.body.email,
                            type: parseInt(req.body.type),
                            profileImage: filePath,
                            status: (req.body.direct === 'true')? 1 : 0,
                            organizationName: req.body.organizationName,
                            organizationAddress: req.body.organizationAddress,
                            organizationID: req.body.organizationID
                        }
                    )
                    console.log(user);
                    user.save().then(user=>{
                        res.status(200).json({'message': 'ok'});
                    }).catch(err=>{
                        res.status(400).json({'message': 'Unexpected error!'});
                    }); 
                }
            }
        });
    }

    generatePasswordResetHash = (password) => {
        const resetHash = crypto.createHash('sha512').update(password).digest('hex');
        return resetHash;
    }

    verifyPasswordResetHash = (resetLinkDate: Date, password: string, resetHash = undefined) => {
        console.log((new Date().getTime() - resetLinkDate.getTime()) / (1000*60*60))
        return this.generatePasswordResetHash(password) === resetHash 
            && ((new Date().getTime() - resetLinkDate.getTime()) / (1000*60*60) < 30);
    }

    resetPasswordPost = async (req: express.Request, res: express.Response) => {
        try {
            const user = await User.findOne({email: req.body.email});
            if (user) {
                const hash = await this.generatePasswordResetHash(user.password);
                //generate a password reset link
                const resetLink = `http://localhost:4200/reset?email=${user.email}&hash=${hash}`
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
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) console.log(err);
                    else console.log(`Email has been sent: ${info.response}`);
                });
                res.json({message: 'Reset link has been sent to your email address.'})
            }
            else {
                return res.status(400).json({
                    message: "Email Address is invalid."
                })
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal server error."
            })
        }
    }

    resetPasswordGet = async (req, res: express.Response) => {
        try {
            //check for email and hash in query parameter
            if (req.query && req.query.email && req.query.hash) {
                //find user with suh email address
                console.log(req.query.email);
                const user = await User.findOne({ email: req.query.email })
                //check if user object is not empty
                if (user) {
                    //now check if hash is valid
                    if (this.verifyPasswordResetHash(user.resetLinkDate, user.password, req.query.hash)) {
                        //issue a password reset form
                        return res.status(200).json(user);
                    } else {
                        return res.status(400).json({
                            message: "You have provided an invalid reset link."
                        })
                    }
                } else {
                    return res.status(400).json({
                        message: "You have provided an invalid reset link. (email)"
                    })
                }
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    changePassword = async (req, res) => {
        console.log('Usao za pass')
        const { username, password } = req.body;
        await User.updateOne({username: username}, {password: password});

        res.json({message: 'OK'});
    }

    resolveRequest = async (req, res) => {
        const { username, action } = req.body;

        if (action) {
            // Accept
            await User.updateOne({username: username}, {status: 1});
        }
        else {
            // Reject
            await User.updateOne({username: username}, {status: 2});
        }

        res.json({message: 'OK'});
    }

    editUser = async (req, res) => {
        const { user } = req.body;
        console.log(user);

        await User.replaceOne({username: user.username}, user);

        res.json({message: 'OK'});
    }

    editPhoto = async (req, res) => {
        console.log(req.file);
        const filePath =  req.protocol + '://' + req.get("host") + '\\' + req.file.path;

        const { username } = req.query;
        await User.updateOne({username: username}, {profileImage: filePath});

        res.json({message: 'OK'});
    }

    deleteUser = async (req, res) => {
        const { username } = req.body;
       
        // Remove likes from user that is being delted
        await Workshop.updateMany({likedBy: username}, {$pull: {likedBy: username}});
        
        // Remove all comments from user that is being deleted (from the workshops first)
        const userComments = await Comment.find({sendUser: username});
        for (let i = 0; i < userComments.length; ++i) {
            await Workshop.updateMany({comments: userComments[i]._id}, {$pull: {comments: userComments[i]._id}});
        }
        await Comment.deleteMany({sendUser: username});

        // Delete all messages that had user involved
        await Message.deleteMany({$or:[{sendUser: username}, {receiveUser: username}]});

        await User.deleteOne({username: username});

        // If organizer, delete all workshops that he had organized
        const workshops = await Workshop.find({organizer: username});
        workshops.forEach(async (workshopInfo) => {
            // Delete commentns on the workshop being deleted
            await Comment.deleteMany({workshopId: workshopInfo._id});
    
            // Delete messages connected to workshop
            await Message.deleteMany({workshopId: workshopInfo._id});
    
            // Delete workshop itself
            workshopInfo.delete();
        });

        res.json({message: 'OK'});
    }

    signedSomewhere = async (req, res) => {
        const { username } = req.query;

        const signedUpWorkshops = await Workshop.find({signedUp: username});
        if (signedUpWorkshops.length) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }

}