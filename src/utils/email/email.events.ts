import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail";

export enum EMAIL_EVENTS_Enum {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
}

export class EmailEvent {
  constructor(private readonly emitter: EventEmitter) {}
  subscribe = (event: EMAIL_EVENTS_Enum, callback: (payload: any) => void) => {
    this.emitter.on(event, callback);
  };

  publish = (event: EMAIL_EVENTS_Enum, payload: any) => {
    this.emitter.emit(event, payload);
  };
}

const emitter = new EventEmitter();
export const emailEvent = new EmailEvent(emitter);

emailEvent.subscribe(
  EMAIL_EVENTS_Enum.VERIFY_EMAIL,
  async ({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) => {
    await sendEmail({ to, subject, html });
  }
);
