export default function Terms() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Terms of Service</h1>
          <p className="text-lg text-neutral-600">Last updated: January 11, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Acceptance of Terms</h2>
            <p className="text-neutral-600 mb-4">
              By accessing and using CoachBnB, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Use License</h2>
            <p className="text-neutral-600 mb-4">
              Permission is granted to temporarily use CoachBnB for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">User Responsibilities</h2>
            <p className="text-neutral-600 mb-4">
              As a user of CoachBnB, you agree to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Provide accurate and current information</li>
              <li>Maintain the security of your account</li>
              <li>Respect other users and coaches</li>
              <li>Use the platform for its intended purpose</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Coach Services</h2>
            <p className="text-neutral-600 mb-4">
              CoachBnB serves as a platform to connect clients with fitness coaches. We do not:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Provide fitness coaching services directly</li>
              <li>Guarantee the quality of coaching services</li>
              <li>Take responsibility for coach-client interactions</li>
              <li>Handle payments between coaches and clients</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Disclaimer</h2>
            <p className="text-neutral-600 mb-4">
              The materials on CoachBnB are provided on an 'as is' basis. CoachBnB makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular 
              purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Limitations</h2>
            <p className="text-neutral-600 mb-4">
              In no event shall CoachBnB or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising 
              out of the use or inability to use the materials on CoachBnB, even if CoachBnB or a 
              CoachBnB authorized representative has been notified orally or in writing of the possibility 
              of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Revisions</h2>
            <p className="text-neutral-600 mb-4">
              The materials appearing on CoachBnB could include technical, typographical, or photographic 
              errors. CoachBnB does not warrant that any of the materials on its website are accurate, 
              complete, or current. CoachBnB may make changes to the materials contained on its website 
              at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Contact Information</h2>
            <p className="text-neutral-600">
              If you have any questions about these Terms of Service, please contact us at terms@coachbnb.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}