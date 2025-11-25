import Link from "next/link";
import { Dumbbell, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CoachNearby</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connect with certified fitness professionals in your area. 
              Transform your fitness journey today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* For Clients */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Clients</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Find a Coach
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Coaches */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Coaches</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/become-a-coach" className="text-gray-400 hover:text-white transition-colors">
                  Become a Coach
                </Link>
              </li>
              <li>
                <Link href="/coach-resources" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/coach-success" className="text-gray-400 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/coach-faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CoachNearby. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
