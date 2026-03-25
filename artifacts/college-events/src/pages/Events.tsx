import { useState } from "react";
import { useGetEvents, useGetCategories, GetEventsStatus } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventCard } from "@/components/ui/EventCard";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<GetEventsStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: events, isLoading } = useGetEvents({
    search: searchTerm || undefined,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const { data: categories } = useGetCategories();

  const statuses: { label: string; value: GetEventsStatus | "all" }[] = [
    { label: "All Events", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Past", value: "past" },
  ];

  return (
    <AppLayout>
      <div className="bg-primary pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Discover Events</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Browse and register for technical symposiums, cultural fests, sports meets, and workshops.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 bg-white p-4 rounded-2xl shadow-sm border border-border">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search events by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-5 h-5 text-muted-foreground mr-2" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as GetEventsStatus | "all")}
              className="py-3 px-4 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-3 px-4 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
            >
              <option value="all">All Categories</option>
              {categories?.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              {/* Fallback if API fails */}
              {!categories && (
                <>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshops">Workshops</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Event Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[450px] rounded-2xl bg-muted animate-pulse" />
              ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
