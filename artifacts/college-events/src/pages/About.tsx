import { AppLayout } from "@/components/layout/AppLayout";
import { CheckCircle2, Code2, Github } from "lucide-react";

const teamMembers = [
  { name: "B. Damini",   rollNo: "24KT1A5405", role: "Frontend Developer" },
  { name: "B. Rasagna",  rollNo: "24KT1A5409", role: "UI/UX Designer" },
  { name: "B. Akhilesh", rollNo: "24KT1A5406", role: "Backend Developer" },
  { name: "T. Charan",   rollNo: "24KT1A5456", role: "Full Stack Developer" },
];

export default function About() {
  return (
    <AppLayout>
      <div className="bg-primary pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${import.meta.env.BASE_URL}images/pattern.png`} alt="Pattern" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">About PSCMR-CET</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology is committed to providing quality education and fostering an environment of innovation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary mb-6">The Event Committee (SAC)</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              The Student Activity Center (SAC) organizes various technical, cultural, and sports events throughout the academic year. Our goal is to provide a platform for students to showcase their talents, develop leadership skills, and create lasting memories.
            </p>
            <ul className="space-y-4">
              {[
                "Organize national level technical symposiums",
                "Facilitate industry expert workshops and seminars",
                "Host the annual cultural fest 'JIGNASA'",
                "Promote sports and extracurricular activities"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-primary/5 absolute -top-10 -right-10 w-full h-full -z-10" />
            <img 
              // {/* campus building engineering students working together */}
              src="https://pixabay.com/get/gce84d7be73949f8c1301bde3a17c6f05e3141ea61c273fd1a9dc4b26ac34e1595b4ec94d659f44cbaa26d0bb464e50767626fba9be3f6cd6a5a03fe31a379b3d_1280.jpg" 
              alt="College Campus" 
              className="rounded-2xl shadow-2xl relative z-0 object-cover w-full h-full aspect-[4/3]"
            />
          </div>
        </div>
      </div>

      {/* Developed By Section */}
      <div className="bg-primary/5 border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              <Code2 className="w-4 h-4" />
              Developed By
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Team <span className="text-primary">InnoMind</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              This Event Management System was designed and developed by final-year students of PSCMR-CET as part of their project work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => {
              const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase();
              return (
                <div
                  key={member.rollNo}
                  className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-md">
                    {initials}
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-xs font-mono text-muted-foreground mt-1 mb-3 tracking-wide">{member.rollNo}</p>
                  <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {member.role}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Department of Computer Science & Engineering &nbsp;|&nbsp; PSCMR College of Engineering and Technology, Vijayawada
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
