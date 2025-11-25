import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Fitness Blog - Tips, Workouts & Nutrition Advice",
  description: "Expert fitness tips, workout guides, nutrition advice, and health insights from certified fitness professionals. Start your fitness journey with CoachBnB.",
  keywords: [
    "fitness blog",
    "workout tips",
    "nutrition advice",
    "personal training",
    "health and wellness",
    "exercise guides",
  ],
};

const blogPosts = [
  {
    id: 1,
    slug: "best-workout-routine-for-beginners",
    title: "The Best Workout Routine for Beginners",
    excerpt: "Starting your fitness journey? Here's a comprehensive guide to building your first workout routine that's effective and sustainable.",
    author: "Sarah Chen",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Workouts",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop",
  },
  {
    id: 2,
    slug: "nutrition-tips-for-muscle-building",
    title: "10 Nutrition Tips for Building Muscle",
    excerpt: "Discover the key nutritional strategies that will help you build lean muscle mass and optimize your workout results.",
    author: "Marcus Steel",
    date: "2025-01-12",
    readTime: "6 min read",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop",
  },
  {
    id: 3,
    slug: "benefits-of-hiit-training",
    title: "The Science Behind HIIT Training",
    excerpt: "High-Intensity Interval Training has revolutionized fitness. Learn why HIIT is so effective and how to incorporate it into your routine.",
    author: "Alex Rivera",
    date: "2025-01-10",
    readTime: "7 min read",
    category: "Training",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop",
  },
  {
    id: 4,
    slug: "yoga-for-stress-relief",
    title: "How Yoga Transforms Mental and Physical Health",
    excerpt: "Beyond flexibility, yoga offers profound benefits for stress reduction, mental clarity, and overall wellbeing.",
    author: "Elena Harmony",
    date: "2025-01-08",
    readTime: "5 min read",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
  },
  {
    id: 5,
    slug: "how-to-find-the-right-personal-trainer",
    title: "How to Find the Perfect Personal Trainer for You",
    excerpt: "Choosing the right personal trainer can make or break your fitness journey. Here's what to look for and questions to ask.",
    author: "Jordan Hayes",
    date: "2025-01-05",
    readTime: "6 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop",
  },
  {
    id: 6,
    slug: "home-workout-essentials",
    title: "Building an Effective Home Gym on Any Budget",
    excerpt: "You don't need an expensive gym membership to get fit. Learn how to create an effective workout space at home.",
    author: "Derek Washington",
    date: "2025-01-02",
    readTime: "9 min read",
    category: "Equipment",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop",
  },
];

const categories = ["All", "Workouts", "Nutrition", "Training", "Wellness", "Guides", "Equipment"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-gray-50 py-16">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Fitness Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert tips, workout guides, and nutrition advice from certified fitness professionals
          </p>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "gradient-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Fitness Tips in Your Inbox
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for weekly workout tips, nutrition advice, and exclusive content from our expert coaches.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
