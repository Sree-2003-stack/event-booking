const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event' });
  }
});

// Create event (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, category, image } = req.body;
    
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      image,
      createdBy: req.userId,
      attendees: []
    });

    await event.populate('createdBy', 'name email');
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Update event (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check ownership
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const { title, description, date, location, category, image } = req.body;
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, category, image },
      { new: true }
    ).populate('createdBy', 'name email').populate('attendees', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
});

// Delete event (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check ownership
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// RSVP to event (protected)
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already attending
    if (event.attendees.includes(req.userId)) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    event.attendees.push(req.userId);
    await event.save();
    
    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error registering for event' });
  }
});

// Cancel RSVP (protected)
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.userId
    );
    await event.save();
    
    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error canceling registration' });
  }
});

// Get user's events (created by user)
router.get('/user/created', auth, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.userId })
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user events' });
  }
});

// Get events user is attending
router.get('/user/attending', auth, async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.userId })
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching attending events' });
  }
});

module.exports = router;
