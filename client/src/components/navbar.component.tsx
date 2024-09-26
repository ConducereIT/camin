import {useEffect, useState} from "react";
import {AuthService} from "@genezio/auth";
import LogoWhite from "../assets/Logo fata.svg";

export const NavbarComponent = () => {
  const [scrolled, setScrolled] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-dark navbar-expand-lg fixed-top shadow-sm ${scrolled ? "scrolled" : ""}`}
        style={{
          backgroundColor: "#FFAE1F",
          transition: "all 0.5s ease-in-out",
          borderBottomLeftRadius: scrolled ? "3rem" : "0",
          borderBottomRightRadius: scrolled ? "3rem" : "0",
        }}
      >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src={LogoWhite}
              alt="Logo"
              className="rounded-circle"
              style={{
                width: "4rem",
                height: "4rem",
                border: "1px solid #fff",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.transform = "scale(1)";
              }}
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex ms-auto align-items-center">
              <a className="btn btn-light me-2" href="/account" style={{ border: "1px solid black" }}>
                Cont
              </a>
              <a className="btn btn-light me-2" href="/myappointments" style={{ border: "1px solid black" }}>
                Programări
              </a>
              <a className="btn btn-light me-2" href="mailto:rezervaricaminleu@gmail.com" style={{ border: "1px solid black" }}>
                Contact
              </a>
              <a
                className="btn btn-light"
                onClick={async () => {
                  await AuthService.getInstance().logout();
                  window.location.reload();
                }}
                style={{ border: "1px solid black" }}
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ height: navbarHeight }}></div>
    </>
  );
};

export default NavbarComponent;
