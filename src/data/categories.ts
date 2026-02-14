export interface Category {
  id: string;
  title: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "necklaces",
    title: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Timeless elegance for the neckline, featuring lustrous pearls hand-selected for their radiant orient and perfect roundness.",
  },
  {
    id: "earrings",
    title: "Earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Sophisticated studs and drops that frame the face with a subtle, yet captivating pearlescent glow.",
  },
  {
    id: "rings",
    title: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    description: "Statement pieces designed to adorn the hand, showcasing exceptional pearls in modern, architectural settings.",
  },
  {
    id: "bracelets",
    title: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    description: "Delicate strands and bangles that add a touch of refined luxury to the wrist, perfect for layering or wearing solo.",
  },
];
