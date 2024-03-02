import React, { useEffect, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AuthService } from "@genezio/auth";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { BackendService } from "@genezio-sdk/camin_eu-central-1";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const isLoggedIn = async () => {
      try {
        const response = await AuthService.getInstance().userInfoForToken(
          localStorage.getItem("token") as string,
        );

        if (isMounted && response) {
          navigate("/");
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

      console.log(await BackendService.checkHasPhoneAndCamera());

      if (await BackendService.checkHasPhoneAndCamera()) {
        //add event in google calendar

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
    <div className="form-container">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin(credentialResponse);
        }}
        //@ts-ignore
        render={({ onClick }) => (
          <button onClick={onClick} disabled={googleLoginLoading}>
            {googleLoginLoading ? "Loading..." : "Login with Google"}
          </button>
        )}
      />
    </div>
  );
};

export default Login;
