import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetEvents, useGetStats, useDeleteEvent, useCreateEvent, useGetEventRegistrations } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, Download, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  venue: z.string().min(3),
  date: z.string(),
  time: z.string(),
  maxParticipants: z.coerce.number().min(1),
  organizer: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  prizes: z.string().optional(),
  entryFee: z.string().optional()
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "registrations">("dashboard");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  
  const { data: stats } = useGetStats();
  const { data: events, isLoading: eventsLoading } = useGetEvents();
  const { data: registrations, isLoading: regsLoading } = useGetEventRegistrations(selectedEventId || 0, {
    query: { enabled: !!selectedEventId }
  });

  const deleteMutation = useDeleteEvent();
  const createMutation = useCreateEvent();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema)
  });

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Event deleted successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      } catch (e) {
        toast({ title: "Failed to delete event", variant: "destructive" });
      }
    }
  };

  const onSubmit = async (data: CreateEventForm) => {
    try {
      await createMutation.mutateAsync({ data });
      toast({ title: "Event created successfully!" });
      reset();
      setActiveTab("dashboard");
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    } catch (e) {
      toast({ title: "Failed to create event", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="bg-background min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-display font-bold text-primary">Admin Dashboard</h1>
            <div className="flex bg-white rounded-lg p-1 border border-border shadow-sm">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:bg-muted'}`}
              >
                Manage Events
              </button>
              <button 
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'create' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <Plus className="w-4 h-4" /> Create Event
              </button>
              <button 
                onClick={() => setActiveTab("registrations")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'registrations' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:bg-muted'}`}
              >
                Registrations
              </button>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Events</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalEvents || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Upcoming</p>
                  <p className="text-3xl font-bold text-primary">{stats?.upcomingEvents || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Registrations</p>
                  <p className="text-3xl font-bold text-accent">{stats?.totalRegistrations || 0}</p>
                </div>
              </div>

              {/* Events Table */}
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/50 border-b border-border text-sm">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-foreground">Title</th>
                        <th className="px-6 py-4 font-semibold text-foreground">Date</th>
                        <th className="px-6 py-4 font-semibold text-foreground">Status</th>
                        <th className="px-6 py-4 font-semibold text-foreground">Reg.</th>
                        <th className="px-6 py-4 font-semibold text-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {eventsLoading ? (
                        <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
                      ) : events?.map(event => (
                        <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{event.title}</td>
                          <td className="px-6 py-4 text-muted-foreground">{event.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-secondary-foreground'}`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">{event.registeredCount}/{event.maxParticipants}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => { setSelectedEventId(event.id); setActiveTab("registrations"); }}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg mr-2 transition-colors"
                              title="View Registrations"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(event.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-6">Create New Event</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Event Title</label>
                    <input {...register("title")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                    {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea {...register("description")} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select {...register("category")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 bg-white">
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Workshops">Workshops</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Venue</label>
                    <input {...register("venue")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date (YYYY-MM-DD)</label>
                    <input type="date" {...register("date")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input type="time" {...register("time")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Participants</label>
                    <input type="number" {...register("maxParticipants")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Organizer Name</label>
                    <input {...register("organizer")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input type="email" {...register("contactEmail")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Phone</label>
                    <input type="tel" {...register("contactPhone")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Prizes (Optional)</label>
                    <input {...register("prizes")} placeholder="e.g. 10k Pool" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Entry Fee (Optional)</label>
                    <input {...register("entryFee")} placeholder="e.g. Free or ₹200" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Publish Event"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "registrations" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold">Event Registrations</h2>
                  <p className="text-sm text-muted-foreground">Select an event to view its participants.</p>
                </div>
                <select 
                  className="px-4 py-2 border rounded-lg bg-white min-w-[250px]"
                  value={selectedEventId || ""}
                  onChange={(e) => setSelectedEventId(Number(e.target.value))}
                >
                  <option value="" disabled>Select an Event</option>
                  {events?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>

              {selectedEventId ? (
                regsLoading ? (
                  <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
                ) : registrations && registrations.length > 0 ? (
                  <div>
                    <div className="flex justify-end mb-4">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Download className="w-4 h-4" /> Export CSV
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 border-b">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Roll No</th>
                            <th className="px-4 py-3 font-semibold">Branch/Year</th>
                            <th className="px-4 py-3 font-semibold">Contact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {registrations.map(r => (
                            <tr key={r.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{r.studentName}</td>
                              <td className="px-4 py-3 uppercase">{r.rollNumber}</td>
                              <td className="px-4 py-3">{r.branch} - {r.year}</td>
                              <td className="px-4 py-3">
                                <div className="text-xs">{r.email}</div>
                                <div className="text-xs text-muted-foreground">{r.phone}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    No registrations found for this event yet.
                  </div>
                )
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-secondary/20 text-muted-foreground">
                  Please select an event from the dropdown above.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
