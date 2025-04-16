import nodemailer from 'nodemailer';
import { CONSTANT_CONFIG } from '../../../../core/constants/constantsConfig';

export const transporter = nodemailer.createTransport({
  service: CONSTANT_CONFIG.ENVIRONMENT.MAIL_SERVICE,
  auth: {
    user: CONSTANT_CONFIG.ENVIRONMENT.MAIL_USER,
    pass: CONSTANT_CONFIG.ENVIRONMENT.MAIL_PASSWORD,
  },
});
