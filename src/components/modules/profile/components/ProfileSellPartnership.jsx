"use client";

import { useState } from "react";
import { ProfilePartnership, ProfileReceivedLinks } from "..";

function ProfileSellPartnership() {
  const [activeSection, setActiveSection] = useState("partnership");

  return (
    <>
      {activeSection === "partnership" && (
        <ProfilePartnership setActiveSection={setActiveSection} />
      )}
      {activeSection === "links" && (
        <ProfileReceivedLinks setActiveSection={setActiveSection} />
      )}
    </>
  );
}

export default ProfileSellPartnership;
