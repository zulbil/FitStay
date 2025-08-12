import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function DataDeletion() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, reason }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Request Submitted",
          description: "Your data deletion request has been submitted successfully.",
        });
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit data deletion request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 rounded-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Request Submitted</h1>
            <p className="text-lg text-neutral-600 mb-6">
              Your data deletion request has been submitted successfully. We will process your request within 30 days and send a confirmation email once completed.
            </p>
            <p className="text-sm text-neutral-500">
              Reference ID: DD-{Date.now().toString().slice(-8)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Data Deletion Request</h1>
          <p className="text-lg text-neutral-600">
            Request deletion of your personal data from CoachBnB
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">What will be deleted?</h2>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Your account profile information</li>
              <li>Messages and communications</li>
              <li>Reviews and ratings you've submitted</li>
              <li>Search history and preferences</li>
              <li>Any uploaded photos or documents</li>
            </ul>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This action cannot be undone. Once your data is deleted, 
              you will need to create a new account to use CoachBnB services again.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email associated with your account"
                className="w-full"
              />
              <p className="text-xs text-neutral-500 mt-1">
                This should match the email address used to create your account
              </p>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-neutral-700 mb-2">
                Reason for Deletion (Optional)
              </label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please let us know why you're requesting data deletion"
                rows={4}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Submit Data Deletion Request
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-800 mb-2">Need Help?</h3>
            <p className="text-neutral-600 text-sm">
              If you have questions about data deletion or need assistance, 
              please contact our support team at privacy@coachbnb.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}