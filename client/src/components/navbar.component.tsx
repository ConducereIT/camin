import { AuthService } from "@genezio/auth";

export const NavbarComponent = () => {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="/">
          <h3>Acasă</h3>
        </a>


        <div className="d-flex align-items-center">
          <a className="btn btn-outline-light me-2" href="/account">
            Cont
          </a>
          <a className="btn btn-outline-light me-2" href="/myappointments">
            Programări
        </a>
          <a
            className="btn btn-outline-light"
            style={{marginRight: "0.5rem"}}
            href="mailto:rezervaricaminleu@gmail.com"
          >
            Contact
          </a>
          <button
            className="btn btn-outline-light"
            style={{marginRight: "1rem"}}
            onClick={async () => {
              await AuthService.getInstance().logout();
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
export default NavbarComponent;
