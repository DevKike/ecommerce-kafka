import path from 'path';
import fs from 'fs';
import { CONSTANT_CONFIG } from '../../../../core/constants/constantsConfig';
import { findTemplateDir } from '../../../../utils/findDir/templateDir';
import { transporter } from '../transporter/mailerTransporter';
import * as handlebars from 'handlebars';

export const mailerService = {
  sendMail: async (
    to: string,
    subject: string,
    templateName: string,
    context?: Record<string, any>
  ) => {
    const templatesDir = findTemplateDir(templateName);

    const templatePath = path.join(`${templatesDir}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    const template = handlebars.compile(templateSource);

    const html = template(context);

    try {
      const mailOptions = {
        from: `"Ecommerce" <${CONSTANT_CONFIG.ENVIRONMENT.MAIL_USER}> `,
        to,
        subject,
        html,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  },
};
