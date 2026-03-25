import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Event } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Safe parsing for date, fallback if invalid string
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : 'TBA';

  const isFull = event.registeredCount >= event.maxParticipants;
  const isPast = event.status === "past";

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-muted">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <Calendar className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-primary rounded-full shadow-sm">
            {event.category}
          </span>
          <span className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur",
            event.status === 'upcoming' ? "bg-emerald-500/90 text-white" : 
            event.status === 'ongoing' ? "bg-accent/90 text-accent-foreground" :
            "bg-muted/90 text-muted-foreground"
          )}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
          {event.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-foreground/80">
            <Calendar className="w-4 h-4 mr-3 text-primary/60" />
            <span>{formattedDate} • {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-foreground/80">
            <MapPin className="w-4 h-4 mr-3 text-primary/60" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center text-sm text-foreground/80">
            <Users className="w-4 h-4 mr-3 text-primary/60" />
            <span>{event.registeredCount} / {event.maxParticipants} Registered</span>
          </div>
        </div>

        <Link 
          href={`/events/${event.id}`}
          className={cn(
            "w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-200",
            isPast || isFull
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md"
          )}
        >
          {isPast ? "Event Ended" : isFull ? "Registration Full" : "View Details & Register"}
          {!isPast && !isFull && <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
}
