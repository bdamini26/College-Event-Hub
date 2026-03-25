import { useParams } from "wouter";
import { useGetEvent, useRegisterForEvent } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MapPin, Calendar, Clock, Users, Mail, Phone, IndianRupee, Trophy, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const registrationSchema = z.object({
  studentName: z.string().min(2, "Name is required"),
  rollNumber: z.string().min(5, "Valid Roll Number required"),
  branch: z.string().min(2, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone required"),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function EventDetail() {
  const params = useParams();
  const eventId = parseInt(params.id || "0");
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const { data: event, isLoading, error } = useGetEvent(eventId);
  const registerMutation = useRegisterForEvent();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema)
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-24"><div className="h-96 bg-muted animate-pulse rounded-2xl" /></div>
      </AppLayout>
    );
  }

  if (error || !event) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <Link href="/events" className="text-primary hover:underline mt-4 inline-block">Return to events</Link>
        </div>
      </AppLayout>
    );
  }

  const isFull = event.registeredCount >= event.maxParticipants;
  const isPast = event.status === "past";
  
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      await registerMutation.mutateAsync({
        data: {
          eventId: event.id,
          ...data
        }
      });
      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for the event.",
      });
      setShowModal(false);
      reset();
    } catch (e) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout>
      {/* Banner */}
      <div className="relative h-80 md:h-[400px] w-full bg-primary/90">
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute top-8 left-4 md:left-8">
          <Link href="/events" className="flex items-center text-white/80 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="flex gap-3 mb-4">
              <span className="px-4 py-1.5 bg-accent text-accent-foreground text-sm font-bold rounded-full shadow-sm">
                {event.category}
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur text-white text-sm font-bold rounded-full border border-white/20">
                {event.status.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 font-display">About Event</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
            </section>

            {(event.prizes || event.entryFee) && (
              <section className="bg-secondary/30 p-8 rounded-2xl border border-secondary">
                <h3 className="text-xl font-bold mb-6 font-display">Rewards & Requirements</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {event.prizes && (
                    <div className="flex gap-4">
                      <div className="p-3 bg-accent/20 text-accent-foreground rounded-xl h-fit">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Prizes</h4>
                        <p className="text-muted-foreground mt-1">{event.prizes}</p>
                      </div>
                    </div>
                  )}
                  {event.entryFee && (
                    <div className="flex gap-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl h-fit">
                        <IndianRupee className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Entry Fee</h4>
                        <p className="text-muted-foreground mt-1">{event.entryFee}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-xl font-bold mb-6 font-display">Contact Organizers</h3>
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Coordinator</p>
                  <p className="font-semibold text-foreground">{event.organizer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary/60" />
                  <a href={`mailto:${event.contactEmail}`} className="text-primary hover:underline">{event.contactEmail}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary/60" />
                  <a href={`tel:${event.contactPhone}`} className="text-primary hover:underline">{event.contactPhone}</a>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-border shadow-xl shadow-primary/5 rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
              
              <h3 className="font-display text-xl font-bold mb-6">Event Details</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary"><Calendar className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary"><Clock className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium text-foreground">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary"><Users className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="font-medium text-foreground">
                      {event.registeredCount} / {event.maxParticipants} Registered
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all", isFull ? "bg-destructive" : "bg-primary")} 
                        style={{ width: `${Math.min(100, (event.registeredCount / event.maxParticipants) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                disabled={isPast || isFull}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-lg transition-all",
                  isPast || isFull 
                    ? "bg-muted text-muted-foreground cursor-not-allowed" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1"
                )}
              >
                {isPast ? "Event Ended" : isFull ? "Registration Full" : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </button>
            
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-primary">Register for Event</h2>
              <p className="text-muted-foreground text-sm">{event.title}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input {...register("studentName")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                {errors.studentName && <span className="text-destructive text-xs">{errors.studentName.message}</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Roll Number</label>
                  <input {...register("rollNumber")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none uppercase" />
                  {errors.rollNumber && <span className="text-destructive text-xs">{errors.rollNumber.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select {...register("year")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                    <option value="">Select</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                  {errors.year && <span className="text-destructive text-xs">{errors.year.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <select {...register("branch")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                    <option value="IT">IT</option>
                </select>
                {errors.branch && <span className="text-destructive text-xs">{errors.branch.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" {...register("email")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" {...register("phone")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50">
                  {isSubmitting ? "Submitting..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
