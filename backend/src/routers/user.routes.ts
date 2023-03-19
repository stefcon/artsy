import express from 'express';
import { UserController } from '../controllers/user.controller';
const multer = require('multer');
const uploadFolder = 'src/images';

const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
        let [filename, extension] = file.originalname.split('.');
        let nameFile = filename + "-" + Date.now() + "." + extension; // --> give "image-1622181268053.jpeg"
        cb(null, nameFile)
    }
})

const upload = multer({storage: storage});

const userRouter = express.Router();

userRouter.get('/all',
    (req, res) => new UserController().getAllUsers(req, res)
);

userRouter.get('/getUser',
    (req, res) => new UserController().getUser(req, res)
);

userRouter.route('/login').post(
    (req, res)=>new UserController().login(req,res)
);

userRouter.post('/register',
    upload.single('profile_image'), 
    (req, res)=>new UserController().register(req, res)
);

userRouter.post('/reset',
    (req,res) => new UserController().resetPasswordPost(req, res)
);

userRouter.get('/reset',
    (req, res) => new UserController().resetPasswordGet(req, res)
);

userRouter.post('/new-pass', 
    (req, res) => new UserController().changePassword(req, res)
);

userRouter.patch('/resolveRequest', 
    (req, res) => new UserController().resolveRequest(req, res)
);

userRouter.put('/editUser',
    (req, res) => new UserController().editUser(req, res)
);

userRouter.patch('/editPhoto', upload.single('photo'),
    (req, res) => new UserController().editPhoto(req, res)
);

userRouter.post('/deleteUser',
    (req, res) => new UserController().deleteUser(req, res)
);

userRouter.get('/signedSomewhere',
    (req, res) => new UserController().signedSomewhere(req, res)
);

export default userRouter;