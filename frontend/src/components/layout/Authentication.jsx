import { Outlet } from "react-router-dom";
import logo from "../../assets/images/logo02.png";

export default function Authentication() {
  return (
  <div className="h-screen w-screen overflow-hidden bg-white">
    <div className="grid h-full w-full grid-cols-1 bg-white lg:grid-cols-[60%_40%]">
      {/* Left Form */}
      <Outlet />
      {/* Right Logo */}
      <section className="hidden items-center justify-center bg-white px-10 lg:flex">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="AITasker Logo"
            className="w-[590px] max-w-full object-contain"
          />

          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="h-2 w-2 rounded-full bg-[#132238]" />
          </div>
        </div>
      </section>
    </div>
  </div>
  );
}
