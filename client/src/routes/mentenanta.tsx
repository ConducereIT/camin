import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BackendService } from "@genezio-sdk/camin-runtime";

const Mentenanta: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaintenance = async () => {
      const maintenance = await BackendService.isMaintenance();
      if (maintenance.status) {
        setIsMaintenance(true);
        const targetDate = new Date(maintenance.date);
        setTimeLeft(targetDate.getTime() - new Date().getTime());
      } else {
        setIsMaintenance(false);
      }
    };

    fetchMaintenance();
  }, []);

  useEffect(() => {
    if (isMaintenance && timeLeft > 0) {
      const countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1000;
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else if (isMaintenance && timeLeft <= 0) {
      const disableMaintenance = async () => {
        await BackendService.disableMaintenance();
        setIsMaintenance(false);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      };

      disableMaintenance();
    }
  }, [isMaintenance, timeLeft]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    if (days == 1)
      return `${days} zi și ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ore`;
    else if (days > 0) {
      return `${days} zile și ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ore`;
    } else {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ore`;
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Row className="w-100">
        <Col xs={12} md={10} lg={8} xl={6} className="mx-auto">
          <Card className="text-center shadow-lg p-4">
            <Card.Body>
              <Card.Title>
                <h1 className="display-4">Mentenanță</h1>
              </Card.Title>
              <Card.Text className="mt-3">
                {isMaintenance ? (
                  <>
                    <p>
                      Acest site este în mentenanță. Vă rugăm să reveniți mai
                      târziu.
                    </p>
                    <p>Timp estimat până la revenire:</p>
                    <h2 className="display-5 mb-4">{formatTime(timeLeft)}</h2>
                  </>
                ) : (
                  <p>Revenim în curând!</p>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Mentenanta;
