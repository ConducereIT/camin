import { AuthService } from "@genezio/auth";
import LogoWhite from "../assets/Logo fata.svg";
export const NavbarComponent = () => {
  return (
    <nav className="navbar navbar-dark " style={{ backgroundColor: "#FFAE1F" }}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src={LogoWhite}
            alt="Logo"
            className="rounded-circle -m-1"
            style={{ width: "4rem", height: "4rem", border: "1px solid #fff" }}
          />
        </a>

        <div className="d-flex align-items-center  ">
          <a className="btn btn-outline-light me-2" href="/account">
            Cont
          </a>
          <a className="btn btn-outline-light me-2" href="/myappointments">
            Programări
          </a>
          <a
            className="btn btn-outline-light"
            style={{ marginRight: "0.5rem" }}
            href="mailto:rezervaricaminleu@gmail.com"
          >
            Contact
          </a>
          <a
            className="btn btn-outline-light"
            style={{ marginRight: "1rem" }}
            onClick={async () => {
              await AuthService.getInstance().logout();
              window.location.reload();
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
};
export default NavbarComponent;
