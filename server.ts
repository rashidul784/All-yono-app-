import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { AppItem, CategoryItem } from "./src/types.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock Data
const MOCK_CATEGORIES: CategoryItem[] = [
  { id: "c1", name: "Rummy Apps", slug: "rummy", icon: "Club", count: 42 },
  { id: "c2", name: "Teen Patti Apps", slug: "teen-patti", icon: "Spade", count: 35 },
  { id: "c3", name: "Slots Apps", slug: "slots", icon: "Cherry", count: 120 },
  { id: "c4", name: "Casino Apps", slug: "casino", icon: "Dices", count: 85 },
  { id: "c5", name: "New Launches", slug: "new", icon: "Rocket", count: 12 },
];

const MOCK_APPS: AppItem[] = [
  {
    id: "app1",
    name: "Rummy Circle Pro",
    category: "Rummy Apps",
    rating: 4.8,
    reviewsCount: 12400,
    bonus: "₹2000 Welcome Bonus",
    logo: "https://images.unsplash.com/photo-1615801962325-1e35d10d19de?w=128&h=128&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80",
      "https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=800&q=80"
    ],
    description: "Experience the thrill of real rummy with Rummy Circle Pro. Play with millions of active users and win big.",
    features: ["Instant Withdrawals", "24/7 Support", "Anti-Fraud System"],
    downloadUrl: "#",
    isTrending: true
  },
  {
    id: "app2",
    name: "Teen Patti Gold Plus",
    category: "Teen Patti Apps",
    rating: 4.6,
    reviewsCount: 8900,
    bonus: "10 LAKH Free Chips",
    logo: "https://images.unsplash.com/photo-1622328148866-285fd28d00df?w=128&h=128&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1506544777-64cfbea6618e?w=800&q=80"
    ],
    description: "The classic Teen Patti experience upgraded for modern smartphones. Daily bonuses and exciting tournaments.",
    features: ["Private Rooms", "Lucky Draw", "No Ads"],
    downloadUrl: "#",
    isTrending: true
  },
  {
    id: "app3",
    name: "Jackpot Slots Casino",
    category: "Slots Apps",
    rating: 4.9,
    reviewsCount: 45000,
    bonus: "500 Free Spins",
    logo: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=128&h=128&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800&q=80",
      "https://images.unsplash.com/photo-1473625247510-8ecee1e4eb83?w=800&q=80"
    ],
    description: "Spin to win in the most luxurious slots app of the year. Features Vegas-style machines and massive progressive jackpots.",
    features: ["Progressive Jackpots", "Daily Quests", "VIP Club"],
    downloadUrl: "#",
    isTrending: false,
    isNew: true
  },
  {
    id: "app4",
    name: "Grand Casino Royale",
    category: "Casino Apps",
    rating: 4.5,
    reviewsCount: 15600,
    bonus: "100% Deposit Match",
    logo: "https://images.unsplash.com/photo-1570120150917-74291880ec18?w=128&h=128&fit=crop",
    screenshots: [],
    description: "Your all-in-one casino experience featuring Blackjack, Roulette, Baccarat, and Poker.",
    features: ["Live Dealers", "Multiplayer Tables", "Crypto Support"],
    downloadUrl: "#"
  }
];

// API Routes
app.get("/api/categories", (req, res) => {
  res.json(MOCK_CATEGORIES);
});

app.get("/api/apps", (req, res) => {
  const { search, category, trending, new: isNew, limit } = req.query;
  let results = [...MOCK_APPS];

  if (category) results = results.filter(a => a.category.toLowerCase().includes(String(category).toLowerCase()));
  if (search) results = results.filter(a => a.name.toLowerCase().includes(String(search).toLowerCase()));
  if (trending === 'true') results = results.filter(a => a.isTrending);
  if (isNew === 'true') results = results.filter(a => a.isNew);
  
  if (limit) results = results.slice(0, Number(limit));

  res.json(results);
});

app.get("/api/apps/:id", (req, res) => {
  const appItem = MOCK_APPS.find(a => a.id === req.params.id);
  if (appItem) {
    res.json(appItem);
  } else {
    res.status(404).json({ error: "App not found" });
  }
});

// Vite & Static Asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
