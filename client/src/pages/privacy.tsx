export default function Privacy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-neutral-600">Last updated: January 11, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Information We Collect</h2>
            <p className="text-neutral-600 mb-4">
              When you use CoachBnB, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Profile information from your social media accounts (name, email, profile picture)</li>
              <li>Location data to help you find nearby fitness coaches</li>
              <li>Communication between you and coaches through our platform</li>
              <li>Usage data to improve our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">How We Use Your Information</h2>
            <p className="text-neutral-600 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Provide and improve our fitness coaching marketplace</li>
              <li>Connect you with qualified fitness coaches in your area</li>
              <li>Facilitate communication between clients and coaches</li>
              <li>Send important updates about our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Data Sharing</h2>
            <p className="text-neutral-600 mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Fitness coaches when you initiate contact through our platform</li>
              <li>Service providers who help us operate our platform</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Social Media Login</h2>
            <p className="text-neutral-600 mb-4">
              When you sign in using Google or Facebook, we only access basic profile information 
              (name, email, profile picture) to create your account. We do not post to your social 
              media accounts or access your contacts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Data Security</h2>
            <p className="text-neutral-600 mb-4">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Your Rights</h2>
            <p className="text-neutral-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Contact Us</h2>
            <p className="text-neutral-600">
              If you have questions about this privacy policy, please contact us at privacy@coachbnb.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}