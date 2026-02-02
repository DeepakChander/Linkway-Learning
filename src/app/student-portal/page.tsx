import type { Metadata } from "next";
import StudentPortalContent from "./StudentPortalContent";

export const metadata: Metadata = {
  title: "Student Portal",
  description:
    "Access your Linkway Learning student portal — live classes, recorded sessions, assignments, certificates, and career support all in one place.",
};

export default function StudentPortal() {
  return <StudentPortalContent />;
}
