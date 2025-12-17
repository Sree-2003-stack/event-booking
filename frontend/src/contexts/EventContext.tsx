import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from '@/types/event';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'attendees'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  rsvpEvent: (eventId: string, userId: string) => boolean;
  cancelRsvp: (eventId: string, userId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Meetup 2025',
    description: 'Join us for an evening of networking and tech talks. Learn about the latest trends in AI, web development, and cloud computing from industry experts.',
    date: new Date('2025-12-28'),
    time: '18:00',
    location: 'Innovation Hub, 123 Tech Street',
    capacity: 50,
    attendees: ['user1', 'user2'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    createdBy: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Design Workshop',
    description: 'A hands-on workshop covering UI/UX fundamentals, design systems, and prototyping. Perfect for beginners and intermediate designers.',
    date: new Date('2025-12-30'),
    time: '10:00',
    location: 'Creative Space, 456 Art Avenue',
    capacity: 25,
    attendees: [],
    imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?w=800',
    createdBy: '2',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts. Share ideas, find co-founders, and explore collaboration opportunities.',
    date: new Date('2026-01-05'),
    time: '19:00',
    location: 'Rooftop Lounge, Business Center',
    capacity: 100,
    attendees: ['user1'],
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    createdBy: '1',
    createdAt: new Date(),
  },
];

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved).map((e: Event) => ({
      ...e,
      date: new Date(e.date),
      createdAt: new Date(e.createdAt),
    })) : sampleEvents;
  });

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'attendees'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      attendees: [],
      createdAt: new Date(),
    };
    saveEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    saveEvents(events.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(event => event.id !== id));
  };

  const rsvpEvent = (eventId: string, userId: string): boolean => {
    const event = events.find(e => e.id === eventId);
    if (!event) return false;
    
    // Check capacity
    if (event.attendees.length >= event.capacity) {
      return false;
    }
    
    // Check if already attending
    if (event.attendees.includes(userId)) {
      return false;
    }
    
    saveEvents(events.map(e => 
      e.id === eventId 
        ? { ...e, attendees: [...e.attendees, userId] }
        : e
    ));
    return true;
  };

  const cancelRsvp = (eventId: string, userId: string) => {
    saveEvents(events.map(e => 
      e.id === eventId 
        ? { ...e, attendees: e.attendees.filter(id => id !== userId) }
        : e
    ));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, rsvpEvent, cancelRsvp }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
