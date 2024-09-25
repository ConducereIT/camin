import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { BackendService } from "@genezio-sdk/camin-runtime";
import { Modal, Button } from "react-bootstrap";

interface RenderCalendarProps {
  dayCalendar: string;
  updateEventsDate: (day: string, events: any) => void;
  eventsDate: Record<string, any[]>;
}

const RenderCalendar: React.FC<RenderCalendarProps> = ({
                                                         dayCalendar,
                                                         eventsDate,
                                                       }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any | null>(null);
  const calendarRef = useRef<any>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg);
    setShowModal(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedDate) return;

    const startDate = selectedDate.startStr;
    const endDate = selectedDate.endStr;

    const getUserInfo = await BackendService.getInfoUser();
    try {
      const status = await BackendService.addPersonCalendar(
        startDate,
        endDate,
        dayCalendar,
        getUserInfo.phone,
        getUserInfo.camera
      );

      if (status.status) {
        window.location.reload();
      } else {
        showNotification(status.message);
      }
    } catch (error) {
      showNotification(String(error));
    }
    setShowModal(false);
  };

  const handleEventClick = async (event: any) => {
    try {
      const startDate = event.event.startStr;
      const endDate = event.event.endStr;
      const deleteEvents = await BackendService.deletePerson(
        startDate,
        endDate
      );

      if (deleteEvents.status) {
        showNotification(deleteEvents.message);
        window.location.reload();
      } else {
        showNotification(deleteEvents.message);
      }
    } catch (error) {
      showNotification(String(error));
    }
  };

  const eventsForDay = eventsDate && eventsDate[dayCalendar];

  if (!eventsForDay || eventsForDay.length === 0) {
    return null;
  }

  return (
    <div className="calendar" ref={calendarRef}>
      {notification && (
        <div className="notification alert alert-info mb-5">{notification}</div>
      )}
      {hoveredEvent && (
        <div
          className="hovered-event-popup bg-light border p-3 position-absolute z-3"
          style={{
            top:
              hoveredEvent.jsEvent.clientY +
              140 -
              calendarRef.current.getBoundingClientRect().top,
            left:
              hoveredEvent.jsEvent.clientX +
              60 -
              calendarRef.current.getBoundingClientRect().left,
          }}
        >
          <p className="mb-1">{hoveredEvent.event.title}</p>
        </div>
      )}
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        themeSystem={"standard"}
        headerToolbar={{
          right: "today prev,next timeGridDay,timeGridWeek",
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        stickyHeaderDates={false}
        initialView="timeGridWeek"
        slotDuration="00:30:00"
        allDaySlot={false}
        height="auto"
        selectable={true}
        select={handleDateClick}
        eventDisplay="block"
        dayHeaders={true}
        weekends={true}
        events={eventsForDay}
        eventClick={handleEventClick}
        eventMouseEnter={(arg) => {
          setHoveredEvent(arg);
        }}
        eventMouseLeave={() => {
          setHoveredEvent(null);
        }}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirma rezervarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esti sigur ca vrei sa rezervi pe data de{" "}
          {new Date(selectedDate?.startStr).toLocaleDateString("ro-RO")}{" "}
          intervalul orar{" "}
          {new Date(selectedDate?.startStr).toLocaleTimeString("ro-RO", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -
          {new Date(selectedDate?.endStr).toLocaleTimeString("ro-RO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Anuleaza
          </Button>
          <Button variant="primary" onClick={handleConfirmReservation}>
            Confirma
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RenderCalendar;