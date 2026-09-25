import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export type EmailContent = {
  subject: string;
  html: string;
};

const LOCAL_TEMPLATE_DIR = path.join(__dirname, "templates");
// Compiled code lives in build/emails; deployments also include the source templates.
const TEMPLATE_DIR = fs.existsSync(LOCAL_TEMPLATE_DIR)
  ? LOCAL_TEMPLATE_DIR
  : path.resolve(__dirname, "../../emails/templates");

const compiledTemplates = new Map<string, Handlebars.TemplateDelegate>();

/**
 * Load and compile the Handlebars template at templates/<name>.html,
 * caching the compiled template for reuse.
 */
const getTemplate = (name: string): Handlebars.TemplateDelegate => {
  const cached = compiledTemplates.get(name);
  if (cached) {
    return cached;
  }
  const source = fs.readFileSync(
    path.join(TEMPLATE_DIR, `${name}.html`),
    "utf-8",
  );
  const template = Handlebars.compile(source);
  compiledTemplates.set(name, template);
  return template;
};

export type RejectionEmailContext = {
  firstName: string;
  position: string;
  term: string;
};

export const buildRejectionEmail = (
  context: RejectionEmailContext,
): EmailContent => {
  return {
    subject: `Your UW Blueprint ${context.term} Application`,
    html: getTemplate("rejection")(context),
  };
};
