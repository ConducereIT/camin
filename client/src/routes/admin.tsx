import React, { useEffect, useState } from "react";
import { AuthService } from "@genezio/auth";
import { useNavigate } from "react-router-dom";
import { BackendService } from "@genezio-sdk/camin_eu-central-1";

const Admin: React.FC = () => {
  const [eventsDate, setEventsDate] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await AuthService.getInstance().userInfoForToken(
          localStorage.getItem("token") as string,
        );
        if (
          response.email === "rezervaricaminleu@gmail.com" ||
          response.email === "miloiuc4@gmail.com" ||
          response.email === "andreidragu27@gmail.com"
        ) {
          console.log("Admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log("Not logged in", error);
        navigate("/login");
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const events = await BackendService.getAllEvents();
        setEventsDate(events);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handleDeleteEvent = async (event: any) => {
    try {
      const deleteEvents = await BackendService.deleteEvent(event.id);
      if (deleteEvents.status) {
        window.location.reload();
      } else {
        console.log(deleteEvents.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(
    eventsDate,
    Object.keys(eventsDate).map((key) => eventsDate[key]),
  );

  return (
    <div>
      <h1>Admin</h1>
      <div>
        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">User</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(eventsDate)
              .map((key) => eventsDate[key])
              .map((event: any) => (
                <tr key={event.id}>
                  <th scope="row">{event.id}</th>
                  <td>{event.start}</td>
                  <td>{event.end}</td>
                  <td>{event.title}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteEvent(event)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
