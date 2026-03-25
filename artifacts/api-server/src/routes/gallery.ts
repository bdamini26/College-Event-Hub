import { Router, type IRouter } from "express";

const router: IRouter = Router();

const gallery = [
  { id: 1, title: "Annual Tech Fest 2024", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", eventName: "PSCMR Tech Fest", year: "2024" },
  { id: 2, title: "Cultural Night Celebration", imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800", eventName: "Fiesta Cultural Fest", year: "2024" },
  { id: 3, title: "Hackathon Winners", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800", eventName: "Code Sprint 2024", year: "2024" },
  { id: 4, title: "Sports Day 2024", imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800", eventName: "Annual Sports Meet", year: "2024" },
  { id: 5, title: "Industry Expert Seminar", imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800", eventName: "Industry Connect 2023", year: "2023" },
  { id: 6, title: "Robotics Workshop", imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800", eventName: "Robo Mania 2023", year: "2023" },
  { id: 7, title: "Business Plan Competition", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800", eventName: "Biz Plan 2023", year: "2023" },
  { id: 8, title: "Dance Performance", imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800", eventName: "Fiesta 2022", year: "2022" },
];

router.get("/gallery", (_req, res) => {
  res.json(gallery);
});

export default router;
