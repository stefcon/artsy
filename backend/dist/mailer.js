"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'bs190253d@student.etf.bg.ac.rs',
        pass: '1912000710280'
    }
});
exports.default = transporter;
//# sourceMappingURL=mailer.js.map