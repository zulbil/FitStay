import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Users, DollarSign, TrendingUp } from "lucide-react";

export default function ForCoaches() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-red-600 py-20 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Grow Your Fitness Business
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of fitness professionals who are building successful careers through CoachNearby. 
            Connect with motivated clients and increase your income.
          </p>
          <Button 
            className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl text-lg"
            onClick={() => window.location.href = "/become-a-coach"}
          >
            Start Your Coach Profile
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-800 mb-6">Why Choose CoachNearby?</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We provide everything you need to build and scale your fitness coaching business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Find New Clients</h3>
                <p className="text-neutral-600">
                  Connect with motivated clients in your area who are actively looking for fitness guidance. 
                  Our platform matches you with clients who fit your specialties.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Increase Your Income</h3>
                <p className="text-neutral-600">
                  Set your own rates and schedule. Our coaches report earning 20% more on average 
                  compared to traditional gym employment or freelancing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Grow Your Business</h3>
                <p className="text-neutral-600">
                  Access professional marketing tools, client management features, and business insights 
                  to help you scale your coaching practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">
                Everything You Need to Succeed
              </h2>
              <ul className="space-y-4">
                {[
                  "Professional profile showcase with photo galleries",
                  "Client inquiry and booking management system", 
                  "Secure payment processing and invoicing",
                  "Review and rating system to build credibility",
                  "Mobile-friendly dashboard for on-the-go management",
                  "24/7 customer support and coach resources",
                  "Marketing tools to promote your services",
                  "Detailed analytics and business insights"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:order-first">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" 
                alt="Coach dashboard preview"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-800 mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-neutral-600">Choose the plan that works best for your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 p-8">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">Free Directory</h3>
                  <div className="text-4xl font-bold text-neutral-800 mb-4">$0<span className="text-lg text-neutral-600">/month</span></div>
                  <p className="text-neutral-600">Perfect for getting started</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Basic profile listing",
                    "Up to 3 photos",
                    "Client inquiries",
                    "5% transaction fee",
                    "Basic support"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary mr-3" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full py-3"
                  onClick={() => window.location.href = "/become-a-coach"}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">Pro Profile</h3>
                  <div className="text-4xl font-bold text-neutral-800 mb-4">$29<span className="text-lg text-neutral-600">/month</span></div>
                  <p className="text-neutral-600">For serious coaches</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Enhanced profile with unlimited photos",
                    "Priority placement in search results",
                    "Advanced analytics and insights",
                    "2% transaction fee",
                    "Calendar integration",
                    "Priority customer support",
                    "Marketing tools and templates"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary mr-3" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full py-3 bg-primary hover:bg-red-600"
                  onClick={() => window.location.href = "/become-a-coach"}
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-800 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Fitness Career?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful coaches who have built thriving businesses on CoachNearby. 
            Start your free profile today and begin connecting with your ideal clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-primary hover:bg-red-600 font-semibold px-8 py-4 rounded-xl text-lg"
              onClick={() => window.location.href = "/become-a-coach"}
            >
              Create Your Profile
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-800 font-semibold px-8 py-4 rounded-xl text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
