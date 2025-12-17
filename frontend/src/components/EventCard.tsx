import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
}

export function EventCard({ event, showActions = true }: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { rsvpEvent, cancelRsvp } = useEvents();
  const { toast } = useToast();

  const isAttending = user ? event.attendees.includes(user.id) : false;
  const isFull = event.attendees.length >= event.capacity;
  const spotsLeft = event.capacity - event.attendees.length;
  const isCreator = user?.id === event.createdBy;

  const handleRsvp = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to RSVP to events.",
        variant: "destructive",
      });
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

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border border-border/50">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isFull ? (
            <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
              Sold Out
            </span>
          ) : spotsLeft <= 5 ? (
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium animate-pulse-soft">
              {spotsLeft} spots left
            </span>
          ) : null}
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-4 left-4 text-primary-foreground">
          <p className="text-2xl font-bold font-display">{format(new Date(event.date), 'd')}</p>
          <p className="text-sm uppercase tracking-wider">{format(new Date(event.date), 'MMM')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link to={`/event/${event.id}`}>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{event.attendees.length} / {event.capacity} attending</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full gradient-warm rounded-full transition-all duration-500"
            style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
          />
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Link to={`/event/${event.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            {!isCreator && (
              <Button
                variant={isAttending ? "secondary" : "hero"}
                onClick={handleRsvp}
                disabled={isFull && !isAttending}
                className="flex-1"
              >
                {isAttending ? "Cancel RSVP" : isFull ? "Full" : "RSVP Now"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
