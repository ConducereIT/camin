import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { BackendService } from "@genezio-sdk/camin-runtime";

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
  const [hoveredEvent, setHoveredEvent] = useState<any | null>(null); // Stare pentru evenimentul peste care mouse-ul a intrat

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleDateClick = async (arg: any) => {
    const startDate = arg.startStr;
    const endDate = arg.endStr;

    const getUserInfo = await BackendService.getInfoUser();
    try {
      const status = await BackendService.addPersonCalendar(
        startDate,
        endDate,
        dayCalendar,
        getUserInfo.phone,
        getUserInfo.camera,
      );

      if (status.status) {
        window.location.reload();
      } else {
        showNotification(status.message);
      }
    } catch (error) {
      showNotification(String(error));
    }
  };

  const handleEventClick = async (event: any) => {
    try {
      const startDate = event.event.startStr;
      const endDate = event.event.endStr;
      const deleteEvents = await BackendService.deletePerson(
        startDate,
        endDate,
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

  if (!eventsForDay) {
    return null;
  }

  return (
    <div className="calendar">
      {notification && (
        <div className="notification alert alert-info mb-5">{notification}</div>
      )}
      {hoveredEvent && (
        <div
          className="hovered-event-popup bg-light border p-3 position-absolute z-3"
          style={{
            top: hoveredEvent.jsEvent.clientY + 10,
            left: hoveredEvent.jsEvent.clientX + 10,
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
          setHoveredEvent(arg); // Actualizează starea atunci când mouse-ul intră peste un eveniment
        }}
        eventMouseLeave={() => {
          setHoveredEvent(null); // Resetarea stării când mouse-ul părăsește evenimentul
        }}
      />
    </div>
  );
};

export default RenderCalendar;
