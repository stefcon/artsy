import express from 'express';
import { WorkshopController } from '../controllers/workshop.controller';

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

const upload = multer({ storage: storage });

const workshopRouter = express.Router();

workshopRouter.get('/getAllWorkshops',
    (req, res)=>new WorkshopController().getAllWorkshops(req, res)
);

workshopRouter.get('/attendedWorkshops',
    (req, res) => new WorkshopController().getAttendedWorkshops(req, res)
);

workshopRouter.get('/upcomingWorkshops',
    (req, res) => new WorkshopController().getUpcomingWorkshops(req, res)
);

workshopRouter.get('/likedWorkshops',
    (req, res) => new WorkshopController().getLikedWorkshops(req, res)
);

workshopRouter.post('/hasAttended',
    (req, res) => new WorkshopController().hasAttendedWorkshop(req, res)
);

workshopRouter.put('/:id',
    (req, res) => new WorkshopController().editWorkshop(req, res)
);

workshopRouter.delete('/:id',
    (req, res) => new WorkshopController().deleteWorkshop(req, res)
);

workshopRouter.post('/main', upload.single('mainPhoto'),
    (req, res) => new WorkshopController().changeMainPhoto(req, res)
);

workshopRouter.post('/gallery',  upload.array('pictures'),
    (req, res) => new WorkshopController().changeGallery(req, res)
);

workshopRouter.get('/withMessages',
    (req, res) => new WorkshopController().getWorkshopsWithMessages(req, res)
);

// upload.array('pictures'),
workshopRouter.post('/', 
    (req, res) => new WorkshopController().addWorkshop(req, res)
);

workshopRouter.patch('/resolveRequest',
    (req, res) => new WorkshopController().resolveRequest(req, res)
);

workshopRouter.patch('/cancelApplication', 
    (req, res) => new WorkshopController().cancelApplication(req, res)
);

workshopRouter.post('/cancelWorkshop', 
    (req, res) => new WorkshopController().cancelWorkshop(req, res)
);

workshopRouter.patch('/notifyUser',
    (req, res) => new WorkshopController().notifyUser(req, res)
);

export default workshopRouter;