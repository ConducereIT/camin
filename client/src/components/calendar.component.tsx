import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { BackendService } from "@genezio-sdk/camin-runtime";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";

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
  const [showToast, setShowToast] = useState(false);
  const calendarRef = useRef<any>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
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
      <ToastContainer
        position="top-end"
        style={{ position: "fixed", top: 10, right: 10, zIndex: 1000, paddingTop:"6.5rem", paddingRight:"1rem", }}
      >
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide style={{background:"white"}}>
          <Toast.Header>
            <strong className="me-auto">Notificare</strong>
          </Toast.Header>
          <Toast.Body>{notification}</Toast.Body>
        </Toast>
      </ToastContainer>

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
          <Modal.Title>Confirmă rezervarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ești sigur că vrei să rezervi pe data de{" "}
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
            Anulează
          </Button>
          <Button variant="secondary" onClick={handleConfirmReservation}>
            Confirmă
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RenderCalendar;
