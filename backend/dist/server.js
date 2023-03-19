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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const workshop_routes_1 = __importDefault(require("./routers/workshop.routes"));
const comments_routes_1 = __importDefault(require("./routers/comments.routes"));
const messages_routes_1 = __importDefault(require("./routers/messages.routes"));
const path = __importStar(require("path"));
// Setting up app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Serving static files
app.use("/src/images", express_1.default.static(path.join("src/images")));
// Setting up MongoDB
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect('mongodb://localhost:27017/piaproject');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('db connection ok');
});
// Connecting app with its routers
const router = express_1.default.Router();
router.use('/users', user_routes_1.default);
router.use('/workshops', workshop_routes_1.default);
router.use('/comments', comments_routes_1.default);
router.use('/messages', messages_routes_1.default);
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map