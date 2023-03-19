import multer from 'multer';

export function uploadImage() {

    const imageStorage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, './images'); },
        filename: (req, file, cb) => {cb(null, file.originalname) }
    });

    const imageFileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('You can upload only image files!'), false);
        }
        cb(null, true);
    };

    return multer({imageFileFilter, imageStorage});
}