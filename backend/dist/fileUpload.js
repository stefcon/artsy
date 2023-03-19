"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
function uploadImage() {
    const imageStorage = multer_1.default.diskStorage({
        destination: (req, file, cb) => { cb(null, './images'); },
        filename: (req, file, cb) => { cb(null, file.originalname); }
    });
    const imageFileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('You can upload only image files!'), false);
        }
        cb(null, true);
    };
    return (0, multer_1.default)({ imageFileFilter, imageStorage });
}
exports.uploadImage = uploadImage;
//# sourceMappingURL=fileUpload.js.map