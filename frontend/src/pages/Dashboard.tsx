import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Calendar, Plus, Ticket, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const myEvents = events.filter(event => event.createdBy === user?.id);
  const attendingEvents = events.filter(event => user && event.attendees.includes(user.id));

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground">
                Manage your events and RSVPs
              </p>
            </div>
            <Link to="/create-event">
              <Button variant="hero" size="lg">
                <Plus className="w-5 h-5" />
                Create Event
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl p-5 border border-border/50 shadow-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{myEvents.length}</p>
              <p className="text-sm text-muted-foreground">Events Created</p>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border/50 shadow-card">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <Ticket className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{attendingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Events Attending</p>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border/50 shadow-card">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">
                {myEvents.reduce((acc, event) => acc + event.attendees.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Attendees</p>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border/50 shadow-card">
              <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="created" className="gap-2">
                <Calendar className="w-4 h-4" />
                My Events ({myEvents.length})
              </TabsTrigger>
              <TabsTrigger value="attending" className="gap-2">
                <Ticket className="w-4 h-4" />
                Attending ({attendingEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="animate-fade-in">
              {myEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEvents.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    No events yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first event and start building your community
                  </p>
                  <Link to="/create-event">
                    <Button variant="hero">Create Your First Event</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="attending" className="animate-fade-in">
              {attendingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attendingEvents.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                  <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    No RSVPs yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Browse events and RSVP to ones that interest you
                  </p>
                  <Link to="/">
                    <Button variant="hero">Browse Events</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
