import path from 'path';

export const findTemplateDir = (templateName: string): string => {
  const templateDir = `${__dirname}/../../modules/common/templates/mail/${templateName}`;
  return path.join(templateDir);
};
