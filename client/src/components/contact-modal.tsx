import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Coach } from "@shared/schema";

interface ContactModalProps {
  coach: Coach;
  children: React.ReactNode;
}

export default function ContactModal({ coach, children }: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const inquiryMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string; coachId: string }) => {
      return apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${coach.headline}. They will respond within 24 hours.`,
      });
      setOpen(false);
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Error", 
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    inquiryMutation.mutate({
      name,
      email,
      message,
      coachId: coach.id,
    });
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.location.href = "/login";
      return;
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleTriggerClick}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact {coach.headline}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Tell ${coach.headline.split(' ')[0]} about your fitness goals...`}
              rows={4}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            disabled={inquiryMutation.isPending}
          >
            {inquiryMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
          
          <p className="text-xs text-neutral-500 text-center mt-4">
            You won't be charged yet. {coach.headline.split(' ')[0]} will respond within 24 hours.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
