import {
  GenezioAuth,
  GenezioDeploy,
  GenezioMethod,
  GnzContext,
} from "@genezio/types";
import moment from "moment";
import {PrismaClient} from "@prisma/client";
import {Send_mailer} from "./send-mail";

export type AddPersonResponse = {
  status: boolean;
  message: string;
};

export type DeletePersonResponse = {
  status: boolean;
  message: string;
};

@GenezioDeploy()
export class BackendService {
  prisma: PrismaClient;
  mailer: Send_mailer;

  constructor() {
    this.prisma = new PrismaClient();
    this.mailer = new Send_mailer();
  }

  @GenezioAuth()
  async addInfoUser(
    context: GnzContext,
    phone: string,
    camera: string,
  ): Promise<string> {
    try {
      await this.prisma.infoUser.create({
        data: {
          userId: context.user!.userId,
          phone: phone,
          camera: camera,
        },
      });

      return "S-a adaugat!";
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return "Eroare internă. Te rog reîncearcă mai târziu!";
    }
  }

  @GenezioAuth()
  async getInfoUser(context: GnzContext): Promise<{
    phone: string;
    camera: string;
  }> {
    try {
      const infoUser = await this.prisma.infoUser.findUnique({
        where: {userId: context.user!.userId},
      });

      if (!infoUser) {
        return {
          phone: "",
          camera: "",
        };
      }
      return {
        phone: infoUser.phone,
        camera: infoUser.camera,
      };
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return {
        phone: "",
        camera: "",
      };
    }
  }

  @GenezioAuth()
  async checkHasPhoneAndCamera(context: GnzContext): Promise<boolean> {
    try {
      const infoUser = await this.prisma.infoUser.findUnique({
        where: {userId: context.user!.userId},
      });

      return !(infoUser?.phone === undefined || infoUser?.camera === undefined);
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return false;
    }
  }

  @GenezioAuth()
  async updateInfoUser(
    context: GnzContext,
    phone: string,
    camera: string,
  ): Promise<string> {
    try {
      await this.prisma.infoUser.update({
        where: {userId: context.user!.userId},
        data: {
          phone: phone,
          camera: camera,
        },
      });

      return "S-a actualizat!";
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return "Eroare internă. Te rog reîncearcă mai târziu!";
    }
  }

  @GenezioAuth()
  async getEventsCalendar(
    context: GnzContext,
    numberCalendar: string,
  ): Promise<
    {
      end: string;
      start: string;
      title: string;
    }[]
  > {
    try {
      // Find all events in the database
      const events = await this.prisma.events.findMany({
        where: {calendar_n: numberCalendar},
      });

      // Convert the events to the desired format for the calendar
      return events.map((event) => {
        const eventStart = new Date(event.start_event).toISOString();
        const eventEnd = new Date(event.end_event).toISOString();
        const title = event.title + "  " + event.phone + " - " + event.camera;
        return {
          title: title,
          start: eventStart,
          end: eventEnd,
        };
      });
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return [];
    }
  }

  @GenezioAuth()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAllEvents(context: GnzContext): Promise<
    {
      end: string;
      start: string;
      title: string;
      number: string;
    }[]
  > {
    try {
      // Find all events in the database
      const events = await this.prisma.events.findMany();

      // Convert the events to the desired format for the calendar
      return events.map((event) => {
        const eventStart = new Date(event.start_event).toISOString();
        const eventEnd = new Date(event.end_event).toISOString();
        const title = event.title + "  " + event.phone + " - " + event.camera;
        const number = event.calendar_n;
        return {
          id: event.id,
          title: title,
          start: eventStart,
          end: eventEnd,
          number: number,
        };
      });
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return [];
    }
  }

  @GenezioAuth()
  async deleteEvent(
    context: GnzContext,
    eventId: number,
  ): Promise<DeletePersonResponse> {
    try {
      // Find the event to deleted
      const findEventToDeleted = await this.prisma.events.findFirst({
        where: {id: eventId},
      });


      // If the event exits, delete it
      if (findEventToDeleted) {

        const deletedUser = await this.prisma.events.deleteMany({
          where: {id: eventId},
        });
        if (deletedUser) return {status: true, message: "Event sters"};
        else {
          return {status: false, message: "Event negasit"};
        }
      } else {
        return {
          status: false,
          message: "Eroare nu poti sterge evenimentul altcuiva!",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Eroare. Te rog reincearca mai tarziu!",
      };
    }
  }

  @GenezioAuth()
  async getPhoneAndCamera(context: GnzContext): Promise<{
    phone: string;
    camera: string;
  }> {
    try {
      if (!context.user?.userId) {
        return {
          phone: "",
          camera: "",
        };
      }

      const infoUser = await this.prisma.infoUser.findUnique({
        where: {userId: context.user?.userId},
      });

      if (!infoUser) {
        return {
          phone: "",
          camera: "",
        };
      }

      return {
        phone: infoUser.phone,
        camera: infoUser.camera,
      };
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return {
        phone: "",
        camera: "",
      };
    }
  }

  @GenezioAuth()
  async addPersonCalendar(
    context: GnzContext,
    startDate: string,
    endDate: string,
    number: string,
    phone: string,
    camera: string,
  ): Promise<AddPersonResponse> {
    try {
      if (new Date(startDate).getTime() < new Date().getTime()) {
        return {
          status: false,
          message: "Nu poti adauga evenimente in trecut!",
        };
      }

      if (new Date(endDate).getTime() - new Date(startDate).getTime() > 8 * 60 * 60 * 1000) {
        return {
          status: false,
          message: "Nu poti adauga un eveniment mai mare de 8 ore!",
        };
      }

      // Check if an event with the provided title (email) already exists
      const existingEvent = await this.prisma.events.findMany({
        where: {title: context.user?.name},
      });

      const getAllEvents = await this.prisma.events.findMany();

      const checkPhoneAndCamera = await this.checkHasPhoneAndCamera(context);
      if (!checkPhoneAndCamera) {
        return {
          status: false,
          message:
            "Te rog sa completezi datele din profil (camera si numarul de telefon)!",
        };
      }

      for (let i = 0; i < getAllEvents.length; i++) {
        if (getAllEvents[i].calendar_n === number) {
          if (new Date(startDate).getTime() === new Date(getAllEvents[i].start_event).getTime()) {
            return {
              status: false,
              message: "Evenimentul se intersecteaza cu un eveniment existent!",
            };
          }
          if (new Date(endDate).getTime() === new Date(getAllEvents[i].end_event).getTime()) {
            return {
              status: false,
              message: "Evenimentul se intersecteaza cu un eveniment existent!",
            };
          }
        }

        if (
          (getAllEvents[i].calendar_n === number &&
            new Date(startDate).getTime() > new Date(getAllEvents[i].start_event).getTime() &&
            new Date(startDate).getTime() < new Date(getAllEvents[i].end_event).getTime()) ||
          (getAllEvents[i].calendar_n === number &&
            new Date(endDate).getTime() > new Date(getAllEvents[i].start_event).getTime() &&
            new Date(endDate).getTime() < new Date(getAllEvents[i].end_event).getTime()) ||
          (getAllEvents[i].calendar_n === number &&
            new Date(startDate).getTime() < new Date(getAllEvents[i].start_event).getTime() &&
            new Date(endDate).getTime() > new Date(getAllEvents[i].end_event).getTime()) ||
          (getAllEvents[i].calendar_n === number && (
            new Date(startDate).getTime() === new Date(getAllEvents[i].start_event).getTime() ||
            new Date(endDate).getTime() === new Date(getAllEvents[i].end_event).getTime()))
        ) {
          return {
            status: false,
            message: "Evenimentul se intersecteaza cu un eveniment existent!",
          };
        }
      }

      //count the number of events at the same week in existingEvent
      let count = 0;
      const start = moment(startDate).startOf("week").toDate();
      const end = moment(startDate).endOf("week").toDate();
      for (let i = 0; i < existingEvent.length; i++) {
        if (
          existingEvent[i].start_event >= start &&
          existingEvent[i].end_event <= end
        ) {
          count++;
        }
      }

      if (count >= 10) {
        return {
          status: false,
          message:
            "Ai adaugat deja numarul maxim de evenimente (10) in aceeasta saptamana!",
        };
      }

      // Insert the new event into the database
      await this.prisma.events.create({
        data: {
          title: context.user!.name!,
          email: context.user!.email,
          start_event: new Date(startDate),
          end_event: new Date(endDate),
          calendar_n: number,
          phone: phone,
          camera: camera,
        },
      });

      let masina = "";
      switch (number) {
        case "first":
          masina = "masina 1";
          break;
        case "second":
          masina = "masina 2";
          break;
        case "third":
          masina = "masina 3";
          break;
        case "four":
          masina = "masina 4";
          break;
        default:
          masina = "masina 1";
          break;
      }

      await this.mailer.send(
        context.user!.email,
        "Programare spalatorie camin leu - " + masina,
        context.user!.name!,
        startDate,
        endDate,
        masina,
      );

      return {status: true, message: "S-a adaugat!"};
    } catch (error) {
      console.error("Eroare de conectare la baza de date", error);
      return {
        status: false,
        message: "Eroare interna. Te rog reincearca mai tarziu!",
      };
    }
  }

  @GenezioAuth()
  async deletePerson(
    context: GnzContext,
    startDate: Date,
    endDate: Date,
  ): Promise<DeletePersonResponse> {
    try {
      // Find the event to deleted
      const findEventToDeleted = await this.prisma.events.findFirst({
        where: {
          title: context.user?.name,
          start_event: startDate,
          end_event: endDate,
        },
      });
      // If the event exits, delete it
      if (findEventToDeleted) {
        if (findEventToDeleted.start_event < new Date()) {
          return {
            status: false,
            message: "Nu poti sterge evenimente in trecut!",
          };
        }

        const deletedUser = await this.prisma.events.deleteMany({
          where: {
            title: context.user?.name,
            start_event: startDate,
            end_event: endDate,
          },
        });
        if (deletedUser) return {status: true, message: "Event sters"};
        else {
          return {status: false, message: "Event negasit"};
        }
      } else {
        return {
          status: false,
          message: "Eroare nu poti sterge evenimentul altcuiva!",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Eroare. Te rog reincearca mai tarziu!",
      };
    }
  }

  @GenezioMethod({type: "cron", cronString: "20,50 * * * *"})
  async cronJob() {
    console.log("Cron job running at " + new Date().toISOString());
    try {
      const events = await this.prisma.events.findMany({
        where: {
          end_event: {
            gte: new Date(),
            lt: new Date(new Date().getTime() + 10 * 60 * 1000),
          },
        },
      });

      const eventsStart = await this.prisma.events.findMany({
        where: {
          start_event: {
            gte: new Date(),
            lt: new Date(new Date().getTime() + 10 * 60 * 1000),
          },
        },
      });

      for (let i = 0; i < events.length; i++) {
        await this.mailer.sendNotifyFinish(
          events[i].email,
          "Programarea ta se termina in 10 minute!",
          events[i].title,
        );
      }

      for (let i = 0; i < eventsStart.length; i++) {
        await this.mailer.sendNotifyStart(
          eventsStart[i].email,
          "Programarea ta incepe in 10 minute!",
          eventsStart[i].title,
        );
      }
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    }
  }

  @GenezioAuth()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getNumberUsers(context: GnzContext): Promise<number> {
    try {
      const users = await this.prisma.infoUser.findMany();
      return users.length;
    } catch (error) {
      console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
      return 0;
    }
  }
}
