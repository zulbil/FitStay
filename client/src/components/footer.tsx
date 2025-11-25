import { Link } from "wouter";
import { Dumbbell, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-t border-neutral-200" data-testid="footer">
      <div className="container-max py-24 md:py-28 px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CoachNearby
              </h3>
            </div>
            <p className="text-neutral-600 mb-8 leading-relaxed max-w-sm">
              The trusted platform connecting fitness professionals with clients worldwide. Transform your fitness journey or grow your coaching business.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* For Clients */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-5 text-lg">For Clients</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/search">
                  <span className="text-neutral-600 hover:text-primary transition-colors font-medium cursor-pointer" data-testid="link-find-coach">
                    Find a Coach
                  </span>
                </Link>
              </li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Safety Guidelines</a></li>
            </ul>
          </div>
          
          {/* For Coaches */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-5 text-lg">For Coaches</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/for-coaches">
                  <span className="text-neutral-600 hover:text-primary transition-colors font-medium cursor-pointer" data-testid="link-become-coach">
                    Become a Coach
                  </span>
                </Link>
              </li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Coach Resources</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-5 text-lg">Support</h4>
            <ul className="space-y-3.5">
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors">Trust & Safety</a></li>
              <li>
                <Link href="/terms">
                  <span className="text-neutral-600 hover:text-primary transition-colors cursor-pointer" data-testid="link-terms">
                    Terms of Service
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-neutral-300 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-600 text-sm font-medium">
            © 2025 CoachNearby. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/privacy">
              <span className="text-neutral-600 text-sm hover:text-primary font-medium transition-colors cursor-pointer" data-testid="link-privacy">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms">
              <span className="text-neutral-600 text-sm hover:text-primary font-medium transition-colors cursor-pointer">
                Terms of Service
              </span>
            </Link>
            <a href="#" className="text-neutral-600 text-sm hover:text-primary font-medium transition-colors">
              Cookie Policy
            </a>
            <Link href="/data-deletion">
              <span className="text-neutral-600 text-sm hover:text-primary font-medium transition-colors cursor-pointer" data-testid="link-data-deletion">
                Data Deletion
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
