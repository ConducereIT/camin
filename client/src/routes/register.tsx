import React, { useEffect, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AuthService } from "@genezio/auth";
import { useNavigate } from "react-router-dom";
import { BackendService } from "@genezio-sdk/camin-runtime";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerLoading, setRegisterLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterLoading(true);

    try {
      await AuthService.getInstance().register(email, password, name);
      navigate("/login");
    } catch (error: any) {
      alert(error.message);
    }
    setRegisterLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const isLoggedIn = async () => {
      try {
        const response = await AuthService.getInstance().userInfoForToken(
          localStorage.getItem("token") as string,
        );

        if (isMounted && response && await BackendService.checkHasPhoneAndCamera()) {
          navigate("/");
        } else {
          navigate("/account");
        }
      } catch (error) {
        console.log("Not logged in", error);
      }
    };

    isLoggedIn();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setGoogleLoginLoading(true);

    try {
      await AuthService.getInstance().googleRegistration(
        credentialResponse.credential!,
      );

      if (await BackendService.checkHasPhoneAndCamera()) {
        navigate("/");
      } else {
        navigate("/account");
      }
    } catch (error: any) {
      console.log("Login Failed", error);
      alert("Login Failed");
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="mb-1 text-center">
          <div className="d-flex justify-content-center">
            {googleLoginLoading ? (
              <div className="spinner-border text-muted" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLogin(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                  alert("Login Failed");
                }}
                theme="outline"
                shape="circle"
                text="signup_with"
              />
            )}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center my-4">
          <div className="flex-grow-1 border-top"></div>
          <span className="mx-2 text-muted">OR</span>
          <div className="flex-grow-1 border-top"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">
              Nume:
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Parolă:
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-secondary w-100"
          >
            {registerLoading ? "Loading..." : "Crează cont"}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn btn-secondary w-100 mt-3"
          >
            Autentificare
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
