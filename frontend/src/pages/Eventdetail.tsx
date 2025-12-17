import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { format } from 'date-fns';
import { 
  Calendar, Clock, MapPin, Users, ArrowLeft, 
  Edit, Trash2, Share2, CheckCircle 
} from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { events, rsvpEvent, cancelRsvp, deleteEvent } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen gradient-hero">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">Event not found</h1>
          <Link to="/">
            <Button variant="outline" className="mt-4">Back to events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAttending = user ? event.attendees.includes(user.id) : false;
  const isFull = event.attendees.length >= event.capacity;
  const isCreator = user?.id === event.createdBy;
  const spotsLeft = event.capacity - event.attendees.length;

  const handleRsvp = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to RSVP to events.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isAttending) {
      cancelRsvp(event.id, user.id);
      toast({
        title: "RSVP Cancelled",
        description: "You've been removed from this event.",
      });
    } else {
      const success = rsvpEvent(event.id, user.id);
      if (success) {
        toast({
          title: "RSVP Confirmed!",
          description: "You're now registered for this event.",
        });
      } else {
        toast({
          title: "Event Full",
          description: "Sorry, this event has reached its capacity.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      toast({
        title: "Event deleted",
        description: "Your event has been removed.",
      });
      navigate('/');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>

          <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden animate-scale-in">
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              
              {/* Status */}
              <div className="absolute top-4 right-4 flex gap-2">
                {isFull ? (
                  <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-sm font-medium">
                    Sold Out
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                    {spotsLeft} spots left
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="absolute bottom-4 left-4 text-primary-foreground">
                <p className="text-3xl font-bold font-display">{format(new Date(event.date), 'd')}</p>
                <p className="text-lg uppercase tracking-wider">{format(new Date(event.date), 'MMMM yyyy')}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <h1 className="text-3xl font-display font-bold text-foreground">{event.title}</h1>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  {isCreator && (
                    <>
                      <Link to={`/edit-event/${event.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground line-clamp-1">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium text-foreground">{event.attendees.length} / {event.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Registration progress</span>
                  <span>{Math.round((event.attendees.length / event.capacity) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-warm rounded-full transition-all duration-500"
                    style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-display font-semibold text-foreground mb-3">About this event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>

              {/* Action Buttons */}
              {!isCreator && (
                <div className="flex gap-4">
                  {isAttending ? (
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="flex-1"
                      onClick={handleRsvp}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      You're Attending – Cancel RSVP
                    </Button>
                  ) : (
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="flex-1"
                      onClick={handleRsvp}
                      disabled={isFull}
                    >
                      {isFull ? "Event Full" : "RSVP Now"}
                    </Button>
                  )}
                </div>
              )}

              {isCreator && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    ✨ You created this event
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
