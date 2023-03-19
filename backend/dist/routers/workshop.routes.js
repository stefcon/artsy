"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workshop_controller_1 = require("../controllers/workshop.controller");
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
const workshopRouter = express_1.default.Router();
workshopRouter.get('/getAllWorkshops', (req, res) => new workshop_controller_1.WorkshopController().getAllWorkshops(req, res));
workshopRouter.get('/attendedWorkshops', (req, res) => new workshop_controller_1.WorkshopController().getAttendedWorkshops(req, res));
workshopRouter.get('/upcomingWorkshops', (req, res) => new workshop_controller_1.WorkshopController().getUpcomingWorkshops(req, res));
workshopRouter.get('/likedWorkshops', (req, res) => new workshop_controller_1.WorkshopController().getLikedWorkshops(req, res));
workshopRouter.post('/hasAttended', (req, res) => new workshop_controller_1.WorkshopController().hasAttendedWorkshop(req, res));
workshopRouter.put('/:id', (req, res) => new workshop_controller_1.WorkshopController().editWorkshop(req, res));
workshopRouter.delete('/:id', (req, res) => new workshop_controller_1.WorkshopController().deleteWorkshop(req, res));
workshopRouter.post('/main', upload.single('mainPhoto'), (req, res) => new workshop_controller_1.WorkshopController().changeMainPhoto(req, res));
workshopRouter.post('/gallery', upload.array('pictures'), (req, res) => new workshop_controller_1.WorkshopController().changeGallery(req, res));
workshopRouter.get('/withMessages', (req, res) => new workshop_controller_1.WorkshopController().getWorkshopsWithMessages(req, res));
// upload.array('pictures'),
workshopRouter.post('/', (req, res) => new workshop_controller_1.WorkshopController().addWorkshop(req, res));
workshopRouter.patch('/resolveRequest', (req, res) => new workshop_controller_1.WorkshopController().resolveRequest(req, res));
workshopRouter.patch('/cancelApplication', (req, res) => new workshop_controller_1.WorkshopController().cancelApplication(req, res));
workshopRouter.post('/cancelWorkshop', (req, res) => new workshop_controller_1.WorkshopController().cancelWorkshop(req, res));
workshopRouter.patch('/notifyUser', (req, res) => new workshop_controller_1.WorkshopController().notifyUser(req, res));
exports.default = workshopRouter;
//# sourceMappingURL=workshop.routes.js.map