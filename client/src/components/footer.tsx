import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl text-primary mb-4">CoachBnB</h3>
            <p className="text-neutral-600 mb-4">
              Connecting fitness professionals with clients worldwide. Find your perfect coach or grow your fitness business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">For Clients</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/search"><a className="hover:text-primary">Find a Coach</a></Link></li>
              <li><a href="#" className="hover:text-primary">How it Works</a></li>
              <li><a href="#" className="hover:text-primary">Success Stories</a></li>
              <li><a href="#" className="hover:text-primary">Safety Guidelines</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">For Coaches</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/for-coaches"><a className="hover:text-primary">Become a Coach</a></Link></li>
              <li><a href="#" className="hover:text-primary">Coach Resources</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">Coach Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">Trust & Safety</a></li>
              <li><Link href="/terms"><a className="hover:text-primary">Terms of Service</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-600 text-sm">© 2024 CoachBnB. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy"><a className="text-neutral-600 text-sm hover:text-primary">Privacy Policy</a></Link>
            <Link href="/terms"><a className="text-neutral-600 text-sm hover:text-primary">Terms of Service</a></Link>
            <a href="#" className="text-neutral-600 text-sm hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
