import React, { useEffect, useState } from "react";
import { AuthService } from "@genezio/auth";
import { useNavigate } from "react-router-dom";
import { BackendService } from "@genezio-sdk/camin-runtime";
import { formatDate } from "@fullcalendar/core";
import NavbarComponent from "../components/navbar.component.tsx";

const MyAppointments: React.FC = () => {
  const [eventsDate, setEventsDate] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        await AuthService.getInstance().userInfoForToken(
          localStorage.getItem("token") as string
        );
      } catch (error) {
        console.log("Not logged in", error);
        navigate("/login");
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await BackendService.getAllEventsByUser();
        events.sort((a: any, b: any) => b.start - a.start);
        setEventsDate(events);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (event: any) => {
    try {
      const deleteEvents = await BackendService.deleteEventByIdwithUser(
        event.id
      );
      if (deleteEvents.status) {
        window.location.reload();
      } else {
        console.log(deleteEvents.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, width: "100%" }}>
      <NavbarComponent />
      <div className="container pt-5">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h1>Programările mele</h1>
            </div>
            <div className="table-responsive">
              <table className="table mt-3">
                <thead>
                <tr>
                  <th scope="col">Incepe la</th>
                  <th scope="col">Se termină la</th>
                  <th scope="col">Masina</th>
                  <th scope="col">Delete</th>
                </tr>
                </thead>
                <tbody>
                {Object.values(eventsDate).map((event: any) => (
                  <tr key={event.id}>
                    <td>
                      {formatDate(event.start, {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                      })}
                    </td>
                    <td>
                      {formatDate(event.end, {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                      })}
                    </td>
                    <td>
                      {["first", "second", "third", "four"].includes(event.number)
                        ? event.number === "first"
                          ? "1"
                          : event.number === "second"
                            ? "2"
                            : event.number === "third"
                              ? "3"
                              : event.number === "four"
                                ? "4"
                                : "invalid"
                        : ""}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteEvent(event)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {Object.keys(eventsDate).length === 0 && (
                  <tr>
                    <td colSpan={4}>Nu ai programări</td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
