import React, { useState } from "react";

import NavBar from "./NavBar";
import Footer from "./Footer";
import ContactUs from "./ContactUs";
import OurTeam from "./OurTeam";
import Events from "./Events";

function HomePage() {
  const [activeComponent, setActiveComponent] = useState("home");
  return (
    <div className="relative">
      <NavBar active={activeComponent} setComponent={setActiveComponent} />
      <main className="w-full overflow-hidden">
        {activeComponent == "contact" && <ContactUs />}
        {activeComponent == "ourteam" && <OurTeam />}
        {activeComponent == "events" && <Events />}
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
