import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { seedDatabase } from "./seed.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-ee9ab36e/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed database endpoint (for initial setup)
app.post("/make-server-ee9ab36e/seed", async (c) => {
  try {
    const result = await seedDatabase();
    return c.json(result);
  } catch (error) {
    console.log(`Error seeding database: ${error}`);
    return c.json({ error: 'Failed to seed database' }, 500);
  }
});

// ============== AUTH ROUTES ==============

// Sign up endpoint
app.post("/make-server-ee9ab36e/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Exception during signup: ${error}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ============== PLACES ROUTES ==============

// Get all places
app.get("/make-server-ee9ab36e/places", async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    
    const placesData = await kv.getByPrefix('place:');
    let places = placesData.map(item => item.value);
    
    // Filter by category
    if (category && category !== 'all') {
      places = places.filter((p: any) => p.category === category);
    }
    
    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      places = places.filter((p: any) => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    return c.json({ places });
  } catch (error) {
    console.log(`Error fetching places: ${error}`);
    return c.json({ error: 'Failed to fetch places' }, 500);
  }
});

// Get single place
app.get("/make-server-ee9ab36e/places/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const place = await kv.get(`place:${id}`);
    
    if (!place) {
      return c.json({ error: 'Place not found' }, 404);
    }
    
    return c.json({ place });
  } catch (error) {
    console.log(`Error fetching place: ${error}`);
    return c.json({ error: 'Failed to fetch place' }, 500);
  }
});

// Create a new place
app.post("/make-server-ee9ab36e/places", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const placeData = await c.req.json();
    const placeId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const place = {
      id: placeId,
      ...placeData,
      visitCount: 0,
      rating: 0,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`place:${placeId}`, place);
    
    return c.json({ place }, 201);
  } catch (error) {
    console.log(`Error creating place: ${error}`);
    return c.json({ error: 'Failed to create place' }, 500);
  }
});

// Increment visit count
app.post("/make-server-ee9ab36e/places/:id/visit", async (c) => {
  try {
    const id = c.req.param('id');
    const place = await kv.get(`place:${id}`);
    
    if (!place) {
      return c.json({ error: 'Place not found' }, 404);
    }
    
    place.visitCount = (place.visitCount || 0) + 1;
    await kv.set(`place:${id}`, place);
    
    return c.json({ place });
  } catch (error) {
    console.log(`Error incrementing visit count: ${error}`);
    return c.json({ error: 'Failed to update visit count' }, 500);
  }
});

// ============== REVIEWS ROUTES ==============

// Get reviews for a place
app.get("/make-server-ee9ab36e/places/:id/reviews", async (c) => {
  try {
    const placeId = c.req.param('id');
    const reviewsData = await kv.getByPrefix(`review:${placeId}:`);
    const reviews = reviewsData.map(item => item.value);
    
    return c.json({ reviews });
  } catch (error) {
    console.log(`Error fetching reviews: ${error}`);
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

// Create a review
app.post("/make-server-ee9ab36e/reviews", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { placeId, rating, comment } = await c.req.json();
    
    if (!placeId || !rating) {
      return c.json({ error: 'Place ID and rating are required' }, 400);
    }

    // Get the place to update its average rating
    const place = await kv.get(`place:${placeId}`);
    if (!place) {
      return c.json({ error: 'Place not found' }, 404);
    }

    const reviewId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const review = {
      id: reviewId,
      placeId,
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`review:${placeId}:${reviewId}`, review);
    
    // Update place rating
    const reviews = await kv.getByPrefix(`review:${placeId}:`);
    const avgRating = reviews.reduce((sum, r) => sum + r.value.rating, 0) / reviews.length;
    place.rating = Math.round(avgRating * 10) / 10;
    await kv.set(`place:${placeId}`, place);
    
    return c.json({ review }, 201);
  } catch (error) {
    console.log(`Error creating review: ${error}`);
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

// Mark review as helpful
app.post("/make-server-ee9ab36e/reviews/:id/helpful", async (c) => {
  try {
    const reviewId = c.req.param('id');
    const reviewsData = await kv.getByPrefix('review:');
    const reviewItem = reviewsData.find(item => item.value.id === reviewId);
    
    if (!reviewItem) {
      return c.json({ error: 'Review not found' }, 404);
    }
    
    const review = reviewItem.value;
    review.helpful = (review.helpful || 0) + 1;
    await kv.set(`review:${review.placeId}:${reviewId}`, review);
    
    return c.json({ review });
  } catch (error) {
    console.log(`Error marking review as helpful: ${error}`);
    return c.json({ error: 'Failed to update review' }, 500);
  }
});

// ============== FRIENDS ROUTES ==============

// Get user's friends
app.get("/make-server-ee9ab36e/friends", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const friendsData = await kv.getByPrefix(`friend:${user.id}:`);
    const friends = friendsData.map(item => item.value);
    
    return c.json({ friends });
  } catch (error) {
    console.log(`Error fetching friends: ${error}`);
    return c.json({ error: 'Failed to fetch friends' }, 500);
  }
});

// Add a friend
app.post("/make-server-ee9ab36e/friends", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { friendEmail } = await c.req.json();
    
    if (!friendEmail) {
      return c.json({ error: 'Friend email is required' }, 400);
    }

    // Find friend by email
    const { data: friendUser, error } = await supabase.auth.admin.listUsers();
    const friend = friendUser?.users.find(u => u.email === friendEmail);
    
    if (!friend) {
      return c.json({ error: 'User not found' }, 404);
    }

    const friendData = {
      id: friend.id,
      name: friend.user_metadata?.name || friend.email,
      email: friend.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.user_metadata?.name || friend.email)}&background=random`,
      addedAt: new Date().toISOString()
    };
    
    await kv.set(`friend:${user.id}:${friend.id}`, friendData);
    
    return c.json({ friend: friendData }, 201);
  } catch (error) {
    console.log(`Error adding friend: ${error}`);
    return c.json({ error: 'Failed to add friend' }, 500);
  }
});

// Update user location
app.post("/make-server-ee9ab36e/location", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { lat, lng, status } = await c.req.json();
    
    const location = {
      userId: user.id,
      lat,
      lng,
      status,
      lastUpdated: new Date().toISOString()
    };
    
    await kv.set(`location:${user.id}`, location);
    
    return c.json({ location });
  } catch (error) {
    console.log(`Error updating location: ${error}`);
    return c.json({ error: 'Failed to update location' }, 500);
  }
});

// Get friend locations
app.get("/make-server-ee9ab36e/friends/locations", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const friendsData = await kv.getByPrefix(`friend:${user.id}:`);
    const friendIds = friendsData.map(item => item.value.id);
    
    const locations = await Promise.all(
      friendIds.map(async (friendId) => {
        const location = await kv.get(`location:${friendId}`);
        const friendData = friendsData.find(f => f.value.id === friendId)?.value;
        
        if (location && friendData) {
          return {
            ...friendData,
            ...location,
            lastSeen: getRelativeTime(new Date(location.lastUpdated))
          };
        }
        return null;
      })
    );
    
    return c.json({ locations: locations.filter(l => l !== null) });
  } catch (error) {
    console.log(`Error fetching friend locations: ${error}`);
    return c.json({ error: 'Failed to fetch friend locations' }, 500);
  }
});

// ============== RESERVATIONS ROUTES ==============

// Get user's reservations
app.get("/make-server-ee9ab36e/reservations", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reservationsData = await kv.getByPrefix(`reservation:${user.id}:`);
    const reservations = reservationsData.map(item => item.value);
    
    return c.json({ reservations });
  } catch (error) {
    console.log(`Error fetching reservations: ${error}`);
    return c.json({ error: 'Failed to fetch reservations' }, 500);
  }
});

// Create a reservation
app.post("/make-server-ee9ab36e/reservations", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reservationData = await c.req.json();
    const reservationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const reservation = {
      id: reservationId,
      userId: user.id,
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`reservation:${user.id}:${reservationId}`, reservation);
    
    return c.json({ reservation }, 201);
  } catch (error) {
    console.log(`Error creating reservation: ${error}`);
    return c.json({ error: 'Failed to create reservation' }, 500);
  }
});

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

Deno.serve(app.fetch);