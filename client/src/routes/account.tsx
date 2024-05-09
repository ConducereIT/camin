import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/navbar.component.tsx";
import { BackendService } from "@genezio-sdk/camin-runtime";
import { AuthService } from "@genezio/auth";
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [cameraModel, setCameraModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const fetchUserDetails = async () => {
    try {
      const response = await BackendService.getPhoneAndCamera();
      setPhoneNumber(response.phone);
      setCameraModel(response.camera);
      setEditMode(!!response.phone || !!response.camera);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifică doar la trimitere dacă câmpurile sunt goale
    if (!phoneNumber.trim() || !cameraModel.trim()) {
      setError("Completați toate câmpurile");
      return;
    }

    const phoneRegex = new RegExp("^[0-9]{10}$");
    if (!phoneRegex.test(phoneNumber)) {
      setError("Numărul de telefon nu este valid");
      return;
    }

    // check cameraModel max length 5 : Upperletter and 3 or 4 numbers
    const cameraModelRegex = new RegExp("^[A-Z]{1}[0-9]{3,4}$");
    if (!cameraModelRegex.test(cameraModel)) {
      setError("Modelul camerei nu este valid (ex: A1234, A123, C1234, C123)");
      return;
    }

    setLoading(true);

    try {
      if (editMode) {
        if (
          (await BackendService.updateInfoUser(phoneNumber, cameraModel)) ===
          "S-a actualizat!"
        ) {
          navigate("/");
          setEditMode(true);
        }
      } else {
        if (
          (await BackendService.addInfoUser(phoneNumber, cameraModel)) ===
          "S-a adaugat!"
        ) {
          navigate("/");
          setEditMode(true);
        }
      }
      setLoading(false);
      setError("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Error updating user details");
    }
  };

  const getUser = async () => {
    try {
      const response = await AuthService.getInstance().userInfo();
      setUser(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    getUser();
  }, []);

  return (
    <>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <NavbarComponent />
        <div className="container mt-5">
          <h1>Account Settings - {user?.name}</h1>
          <form onSubmit={handleSubmit} className="mt-2">
            {error && (
              <p
                className="text-danger alert alert-danger mt-4 "
                style={{ marginBottom: "-2rem;" }}
              >
                {error}
              </p>
            )}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label mt-2">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="camera" className="form-label">
                Camera Model
              </label>
              <input
                type="text"
                className="form-control"
                id="camera"
                value={cameraModel}
                onChange={(e) => setCameraModel(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading..." : editMode ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Account;
