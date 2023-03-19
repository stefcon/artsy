"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const multer = require('multer');
const uploadFolder = 'src/images';
const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
        let [filename, extension] = file.originalname.split('.');
        let nameFile = filename + "-" + Date.now() + "." + extension; // --> give "image-1622181268053.jpeg"
        cb(null, nameFile);
    }
});
const upload = multer({ storage: storage });
const userRouter = express_1.default.Router();
userRouter.get('/all', (req, res) => new user_controller_1.UserController().getAllUsers(req, res));
userRouter.get('/getUser', (req, res) => new user_controller_1.UserController().getUser(req, res));
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.post('/register', upload.single('profile_image'), (req, res) => new user_controller_1.UserController().register(req, res));
userRouter.post('/reset', (req, res) => new user_controller_1.UserController().resetPasswordPost(req, res));
userRouter.get('/reset', (req, res) => new user_controller_1.UserController().resetPasswordGet(req, res));
userRouter.post('/new-pass', (req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.patch('/resolveRequest', (req, res) => new user_controller_1.UserController().resolveRequest(req, res));
userRouter.put('/editUser', (req, res) => new user_controller_1.UserController().editUser(req, res));
userRouter.patch('/editPhoto', upload.single('photo'), (req, res) => new user_controller_1.UserController().editPhoto(req, res));
userRouter.post('/deleteUser', (req, res) => new user_controller_1.UserController().deleteUser(req, res));
userRouter.get('/signedSomewhere', (req, res) => new user_controller_1.UserController().signedSomewhere(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map