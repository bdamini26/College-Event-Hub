import { Link } from "wouter";
import { ArrowRight, Calendar, Users, Trophy, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useGetEvents, useGetStats } from "@workspace/api-client-react";
import { EventCard } from "@/components/ui/EventCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Technical", icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
  { name: "Cultural", icon: Users, color: "bg-purple-500/10 text-purple-600" },
  { name: "Sports", icon: Trophy, color: "bg-orange-500/10 text-orange-600" },
  { name: "Workshops", icon: Calendar, color: "bg-emerald-500/10 text-emerald-600" },
];

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: events, isLoading: eventsLoading } = useGetEvents({ status: "upcoming" });

  const featuredEvents = events?.slice(0, 3) || [];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
            src={`${import.meta.env.BASE_URL}college-video.mp4`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* College Logo */}
            <motion.img
              src={`${import.meta.env.BASE_URL}college-logo.png`}
              alt="PSCMR-CET Logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-28 h-28 mx-auto mb-6 drop-shadow-2xl"
            />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Empowering Student Excellence
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Discover & Engage in <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Campus Events</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              The official event management portal for PSCMR College of Engineering and Technology. 
              Register for technical symposiums, workshops, and cultural fests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/events" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Explore Events <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/about" 
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-border text-foreground rounded-xl font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Events", value: stats?.totalEvents || "50+", icon: Calendar },
              { label: "Upcoming", value: stats?.upcomingEvents || "12", icon: ArrowRight },
              { label: "Registrations", value: stats?.totalRegistrations || "1.2k+", icon: Users },
              { label: "Active Students", value: stats?.totalStudents || "2.5k+", icon: BookOpen },
            ].map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-secondary/50 border border-secondary flex flex-col items-center text-center"
              >
                <div className="p-3 bg-primary/10 text-primary rounded-xl mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h4 className="font-display text-3xl font-bold text-foreground mb-1">
                  {statsLoading ? <Skeleton className="h-9 w-16" /> : stat.value}
                </h4>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-3">Featured Events</h2>
              <p className="text-muted-foreground">Don't miss out on these upcoming activities.</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[450px] rounded-2xl bg-muted animate-pulse" />
              ))
            ) : featuredEvents.length > 0 ? (
              featuredEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-muted-foreground">
                No upcoming events found. Check back later!
              </div>
            )}
          </div>
          <div className="mt-10 sm:hidden">
             <Link href="/events" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect events that match your interests and domain.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <Link key={category.name} href={`/events?category=${category.name}`}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all cursor-pointer text-center group"
                >
                  <div className={cn("w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", category.color)}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{category.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
