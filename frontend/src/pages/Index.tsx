import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { useEvents } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Sparkles, Users, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { events } = useEvents();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Discover Amazing Events
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Find Events That{' '}
              <span className="text-primary">Inspire</span>{' '}
              You
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Discover and RSVP to events in your community. Create your own events 
              and connect with like-minded people.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base rounded-xl shadow-soft border-border/50 focus:border-primary focus:ring-primary"
              />
            </div>

            {!isAuthenticated && (
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/signup">
                  <Button variant="hero" size="xl">
                    Start Exploring
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{events.length}+</p>
              <p className="text-sm text-muted-foreground">Events</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-accent/10">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Attendees</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-xl bg-secondary/10">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">25+</p>
              <p className="text-sm text-muted-foreground">Locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
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
                No events found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Be the first to create an event!"}
              </p>
              {isAuthenticated && (
                <Link to="/create-event">
                  <Button variant="hero">Create Event</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Evently. Built with ❤️ for amazing events.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
