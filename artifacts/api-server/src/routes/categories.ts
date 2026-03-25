import { Router, type IRouter } from "express";

const router: IRouter = Router();

const categories = [
  { id: 1, name: "Technical", description: "Coding contests, hackathons, robotics and technical challenges", icon: "💻", color: "#3b82f6" },
  { id: 2, name: "Cultural", description: "Music, dance, drama, art and cultural performances", icon: "🎭", color: "#8b5cf6" },
  { id: 3, name: "Sports", description: "Indoor and outdoor sports tournaments and competitions", icon: "⚽", color: "#22c55e" },
  { id: 4, name: "Management", description: "Business competitions, case studies and management events", icon: "📊", color: "#f59e0b" },
  { id: 5, name: "Workshop", description: "Hands-on learning sessions and skill development workshops", icon: "🔧", color: "#ef4444" },
  { id: 6, name: "Seminar", description: "Guest lectures, industry talks and academic seminars", icon: "🎓", color: "#06b6d4" },
];

router.get("/categories", (_req, res) => {
  res.json(categories);
});

export default router;
