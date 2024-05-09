import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import CalendarComponent from "../components/calendar.component.tsx";
import CalendarMobileComponent from "../components/calendar.mobile.component.tsx";
import { BackendService } from "@genezio-sdk/camin-runtime";
import { AuthService } from "@genezio/auth";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import NavbarComponent from "../components/navbar.component.tsx";

const dayNames = ["first", "second", "third", "four"];

const Calendars: React.FC = () => {
  const [eventsDate, setEventsDate] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState(dayNames[0]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const fetchEventsForDay = useCallback(async (day: string) => {
    try {
      return await BackendService.getEventsCalendar(day);
    } catch (error) {
      console.log(error);
      return [];
    }
  }, []);

  const initializeDefaultTab = async () => {
    try {
      const events = await fetchEventsForDay(activeTab);
      setEventsDate((prevEvents) => ({
        ...prevEvents,
        [activeTab]: events,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange: any = async (eventKey: string | null) => {
    if (eventKey) {
      setActiveTab(eventKey);
      try {
        const events = await fetchEventsForDay(eventKey);
        setEventsDate((prevEvents) => ({
          ...prevEvents,
          [eventKey]: events,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        await AuthService.getInstance().userInfoForToken(
          localStorage.getItem("token") as string,
        );
        await initializeDefaultTab();
      } catch (error) {
        console.log("Not logged in", error);
        navigate("/login");
      }
    };
    isLoggedIn();
  }, [navigate]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <>
      <NavbarComponent />
      <section className="project calendare" id="project">
        <Container>
          <Row>
            <Col size={12}>
              <div className="mt-5">
                <Tab.Container
                  id="projects-tabs"
                  activeKey={activeTab}
                  onSelect={handleTabChange}
                >
                  <Nav
                    variant="pills"
                    className="nav-pills mb-5 justify-content-center align-items-center"
                    id="pills-tab"
                  >
                    {dayNames.map((day) => (
                      <Nav.Item key={day}>
                        <Nav.Link eventKey={day}>{`Mașina ${
                          dayNames.indexOf(day) + 1
                        }`}</Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                  <Tab.Content>
                    {dayNames.map((day) => (
                      <Tab.Pane key={day} eventKey={day}>
                        <Row>
                          <Col size={12}>
                            {isMobile ? (
                              <CalendarMobileComponent
                                dayCalendar={day}
                                key={day}
                                eventsDate={eventsDate}
                                updateEventsDate={(newEvents) => {
                                  setEventsDate((prevEvents) => ({
                                    ...prevEvents,
                                    [day]: newEvents,
                                  }));
                                }}
                              />
                            ) : (
                              <CalendarComponent
                                dayCalendar={day}
                                key={day}
                                eventsDate={eventsDate}
                                updateEventsDate={(newEvents) => {
                                  setEventsDate((prevEvents) => ({
                                    ...prevEvents,
                                    [day]: newEvents,
                                  }));
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Calendars;
