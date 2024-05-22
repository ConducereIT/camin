import nodemailer from "nodemailer";
import { GenezioDeploy } from "@genezio/types";
import juice from "juice";

@GenezioDeploy()
export class Send_mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SEND_MAIL_HOST,
      service: process.env.SEND_MAIL_SERVICE,
      auth: {
        user: process.env.SEND_MAIL_USER,
        pass: process.env.SEND_MAIL_PASS,
      },
    });
  }

  async send(
    to: string,
    subject: string,
    nume: string,
    start: string,
    end: string,
    numarMasina: string,
  ): Promise<boolean> {
    try {
      console.log("Sending to:", to);
      const linkGoogleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        subject,
      )}&dates=${encodeURIComponent(start.replace(/[:\+-]/g, ""))}/${encodeURIComponent(
        end.replace(/[:\+-]/g, ""),
      )}&details=${encodeURIComponent(
        "Programare pentru spălarea hainelor la căminul Leu. Vă rugăm să respectați ora programării. Vă mulțumim!",
      )}&location=${encodeURIComponent("Cămin Leu A")}&ctz=Europe/Bucharest`;

      const html = `<!doctype html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Title</title>
</head>
<body>
<div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: center;">
    <h1 style="color: #333;">Salutare, ${nume}!</h1>
    <p>Programarea ta a fost înregistrată cu succes!</p>
    <h2>Detalii programare:</h2>
    <p><strong>Data și ora începerii:</strong> ${start.replace("T", " ")}</p>
    <p><strong>Data și ora terminării:</strong> ${end.replace("T", " ")}</p>
    <p><strong>Număr mașină:</strong> ${numarMasina}</p>
    <p><strong>Obs: Intervalul orar aflat în link-ul de mai jos poate diferii în functie de fusul orar al telefonului.</strong></p>
    <p><strong>Obs: Dacă sunteți pe telefon, deschideți link-ul de mai jos în browser </strong></p>
    <a href="${linkGoogleCalendar}" target="_blank" style="text-decoration: none; color: #fff; background-color: #007bff; padding:10px; border-radius: 5px; display: inline-block;">Adaugă în Google Calendar</a>
    <p>Comitet Cămin Leu</p>
    <a href="https://www.camin.lsebucuresti.org" style="text-decoration: none; color: #007bff;">https://www.camin.lsebucuresti.org</a>
</div>
</body>
</html>`;

      const inlinedHtml = juice(html);

      await this.transporter.sendMail({
        from: process.env.SEND_MAIL_USER,
        to,
        subject,
        html: inlinedHtml,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return false;
  }

  async sendNotifyFinish(
    to: string,
    subject: string,
    nume: string,
  ): Promise<boolean> {
    try {
      console.log("Sending to:", to);
      const html = `<!doctype html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Title</title>
</head>
<body>
<div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: center;">
    <h1 style="color: #333;">Salutare, ${nume}!</h1>
    <p>În 10 minute se termină programarea ta!</p>
    <p>Comitet Cămin Leu</p>
    <a href="https://www.camin.lsebucuresti.org" style="text-decoration: none; color: #007bff;">https://www.camin.lsebucuresti.org</a>
</div>
</body>
</html>`;

      const inlinedHtml = juice(html);

      await this.transporter.sendMail({
        from: process.env.SEND_MAIL_USER,
        to,
        subject,
        html: inlinedHtml,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return false;
  }

  async sendNotifyStart(
    to: string,
    subject: string,
    nume: string,
  ): Promise<boolean> {
    try {
      console.log("Sending to:", to);
      const html = `<!doctype html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Title</title>
</head>
<body>
<div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: center;">
    <h1 style="color: #333;">Salutare, ${nume}!</h1>
    <p>În 10 minute aveți programare!</p>
    <p>Comitet Cămin Leu</p>
    <a href="https://www.camin.lsebucuresti.org" style="text-decoration: none; color: #007bff;">https://www.camin.lsebucuresti.org</a>
</div>
</body>
</html>`;

      const inlinedHtml = juice(html);

      await this.transporter.sendMail({
        from: process.env.SEND_MAIL_USER,
        to,
        subject,
        html: inlinedHtml,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return false;
  }
}
