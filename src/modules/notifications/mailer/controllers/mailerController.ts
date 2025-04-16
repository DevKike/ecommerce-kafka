import { Templates } from '../../../common/templates/enums/templatesEnum';
import { mailerService } from '../services/mailerService';

export const mailerController = {
  sendWelcomeEmail: async (email: string, context?: Record<string, any>) => {
    try {
      await mailerService.sendMail(email, 'Welcome to E-commerce', Templates.WELCOME, {
        name: context!.name,
      });
    } catch (error) {
      throw error;
    }
  },
};
