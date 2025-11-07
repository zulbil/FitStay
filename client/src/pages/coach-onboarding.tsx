import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { X, Upload, MapPin, Instagram, Globe, Check } from "lucide-react";
import type { CoachApplication } from "@shared/schema";

const AVAILABLE_SPECIALTIES = [
  "Personal Training", "Weight Loss", "Strength Training", "Cardio",
  "HIIT", "Yoga", "Pilates", "Crossfit", "Bodybuilding", "Powerlifting",
  "Sports Training", "Rehabilitation", "Nutrition Coaching", "Group Classes",
  "Online Training", "Senior Fitness", "Youth Fitness", "Prenatal Fitness"
];

export default function CoachOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [virtualOnly, setVirtualOnly] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  // Check existing application
  const { data: existingApplication, isLoading: applicationLoading } = useQuery<CoachApplication>({
    queryKey: ["/api/coach-applications/me"],
    enabled: isAuthenticated,
  });

  // Submit application mutation
  const applicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/coach-applications", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying to become a coach. We'll review your application and get back to you within 3-5 business days.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !applicationLoading) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, applicationLoading]);

  if (applicationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (existingApplication) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in becoming a CoachBnB coach. Your application is currently 
                <Badge className="mx-1" variant={
                  existingApplication.status === "pending" ? "secondary" :
                  existingApplication.status === "approved" ? "default" : "destructive"
                }>
                  {existingApplication.status}
                </Badge>
              </p>
              {existingApplication.status === "pending" && (
                <p className="text-sm text-gray-500 mb-6">
                  We'll review your application and get back to you within 3-5 business days.
                </p>
              )}
              <Button onClick={() => window.location.href = "/"}>
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter(c => c !== cert));
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!headline || !bio || !experience || !pricePerHour || selectedSpecialties.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    applicationMutation.mutate({
      headline: headline.trim(),
      bio: bio.trim(),
      experience: experience.trim(),
      certifications,
      pricePerHour: parseInt(pricePerHour),
      virtualOnly,
      specialties: selectedSpecialties,
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      address: address.trim(),
      fullAddress: fullAddress.trim(),
      location: location.trim(), // For backward compatibility
      instagramUrl: instagramUrl.trim(),
      websiteUrl: websiteUrl.trim(),
      profilePhoto: profilePhoto.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a CoachBnB Coach</h1>
          <p className="text-xl text-gray-600">Join our community of certified fitness professionals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="headline">Professional Headline *</Label>
                <Input
                  id="headline"
                  placeholder="e.g. Certified Personal Trainer & Nutrition Coach"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">{headline.length}/100 characters</p>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell potential clients about your background, philosophy, and approach to fitness..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500 mt-1">{bio.length}/1000 characters</p>
              </div>

              <div>
                <Label htmlFor="experience">Experience & Background *</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your professional experience, years in the industry, notable achievements..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{experience.length}/500 characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="certification">Add Certification</Label>
                <div className="flex gap-2">
                  <Input
                    id="certification"
                    placeholder="e.g. NASM-CPT, ACE Personal Trainer"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button type="button" onClick={addCertification}>Add</Button>
                </div>
              </div>

              {certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_SPECIALTIES.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => toggleSpecialty(specialty)}
                    />
                    <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  </div>
                ))}
              </div>
              {selectedSpecialties.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialties.map((specialty) => (
                      <Badge key={specialty} variant="default">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing & Services */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="price">Rate per Hour ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="75"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  min="25"
                  max="300"
                />
                <p className="text-sm text-gray-500 mt-1">Typical rates range from $50-150 per hour</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="virtual-only"
                  checked={virtualOnly}
                  onCheckedChange={(checked) => setVirtualOnly(checked as boolean)}
                />
                <Label htmlFor="virtual-only">I only offer virtual/online sessions</Label>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          {!virtualOnly && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city-state">Primary Location *</Label>
                  <AddressAutocomplete
                    value={fullAddress}
                    onChange={(value, addressData) => {
                      setFullAddress(value);
                      if (addressData) {
                        setCity(addressData.city);
                        setState(addressData.stateCode);
                        setZipCode(addressData.zipCode);
                        setLocation(`${addressData.city}, ${addressData.stateCode}`);
                      }
                    }}
                    onAddressSelected={(addressData) => {
                      setCity(addressData.city);
                      setState(addressData.stateCode);
                      setZipCode(addressData.zipCode);
                      setLocation(`${addressData.city}, ${addressData.stateCode}`);
                      setFullAddress(`${addressData.city}, ${addressData.stateCode} ${addressData.zipCode}`);
                    }}
                    placeholder="Enter city, state, or ZIP code..."
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">Start typing to search for your city and state</p>
                </div>

                <div>
                  <Label htmlFor="address">Street Address (optional)</Label>
                  <Input
                    id="address"
                    placeholder="Street address for in-person sessions"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">This helps clients find you for in-person training</p>
                </div>

                {city && state && (
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">
                      <strong>Selected Location:</strong> {city}, {state} {zipCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Online Presence (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/yourhandle"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website URL
                </Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => window.location.href = "/"}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={applicationMutation.isPending}
              className="px-8"
            >
              {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}