import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Calendar, Clock, MapPin, Users, Image, ArrowLeft, FileText, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { events, updateEvent } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();

  const event = events.find(e => e.id === id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    imageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        time: event.time,
        location: event.location,
        capacity: event.capacity.toString(),
        imageUrl: event.imageUrl,
      });
    }
  }, [event]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

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

  if (event.createdBy !== user?.id) {
    navigate('/');
    toast({
      title: "Access denied",
      description: "You can only edit events you created.",
      variant: "destructive",
    });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateEvent(event.id, {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        imageUrl: formData.imageUrl,
      });

      toast({
        title: "Event updated!",
        description: "Your changes have been saved.",
      });
      navigate(`/event/${event.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link to={`/event/${event.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to event
          </Link>

          <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-8 animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Edit className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Edit Event</h1>
                <p className="text-muted-foreground">Update your event details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      placeholder="Max attendees"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>

              {formData.imageUrl && (
                <div className="rounded-xl overflow-hidden h-48 bg-muted">
                  <img
                    src={formData.imageUrl}
                    alt="Event preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
