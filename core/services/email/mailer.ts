import { getEnv } from "@/lib/server/env";
import { render } from "@react-email/render";
import * as nodemailer from "nodemailer";
import { createElement, type ComponentType } from "react";
import { z } from "zod";

const mailerOptions =
  getEnv("DEBUG").toLowerCase() === "true"
    ? {
        host: "localhost",
        port: 1025,
        secure: false,
      }
    : {
        service: getEnv("SMTP_HOST"),
        auth: {
          user: getEnv("DEFAULT_APP_EMAIL"),
          pass: getEnv("SMTP_PASSWORD"),
        },
      };

const transporter = nodemailer.createTransport(mailerOptions);

const Email = z.email();

interface EmailFrom {
  name: string;
  email: string;
}

type MailBase = {
  from?: EmailFrom;
  to: string;
  subject: string;
  text?: string;
};

export async function sendEmail<P extends Record<string, unknown>>(
  args: MailBase & { component: ComponentType<P>; props: P },
): Promise<void>;
export async function sendEmail(args: MailBase): Promise<void>;

export async function sendEmail<P extends Record<string, unknown>>({
  from,
  to,
  subject,
  text,
  component,
  props,
}: MailBase & { component?: ComponentType<P>; props?: P }) {
  const fromFinal: EmailFrom = from ?? {
    name: getEnv("DEFAULT_FROM_NAME"),
    email: getEnv("DEFAULT_APP_EMAIL"),
  };
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${fromFinal.name}" <${fromFinal.email}>`,
    to: Email.parse(to),
    subject: subject,
    text: text,
  };

  if (component) {
    const html = await render(
      createElement(
        component as unknown as ComponentType<Record<string, unknown>>,
        (props ?? {}) as Record<string, unknown>,
      ),
    );
    mailOptions.html = html;
  }
  async function s() {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
  setImmediate(s);
}
