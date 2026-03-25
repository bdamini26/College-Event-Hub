import { Link } from "wouter";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <span className="font-display font-bold text-xl text-white">PSCMR-CET</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-sm mb-6">
              Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology. 
              Fostering excellence in engineering education and holistic student development through engaging events and technical symposiums.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/events" className="hover:text-accent transition-colors">All Events</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors">Photo Gallery</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/admin" className="hover:text-accent transition-colors">Committee Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>Kothapeta, Vijayawada,<br/>Andhra Pradesh 520001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+91 866 2423442</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>events@pscmr.ac.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} PSCMR-CET. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Built with <span className="text-accent">♥</span> by{" "}
            <span className="text-accent font-semibold ml-1">InnoMind Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
