import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye, Users, UserCheck, MessageSquare, Star } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CoachApplication {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  headline: string;
  bio: string;
  experience: string;
  certifications: string[];
  pricePerHour: number;
  virtualOnly: boolean;
  specialties: string[];
  location: string;
  address: string;
  profilePhoto: string;
  additionalPhotos: string[];
  instagramUrl?: string;
  websiteUrl?: string;
  adminNotes?: string;
  createdAt: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface Coach {
  id: string;
  slug: string;
  headline: string;
  bio: string;
  city: string;
  country: string;
  specialties: string[];
  pricePerHour: number;
  virtualOnly: boolean;
  ratingAvg: number;
  ratingCount: number;
  photos: string[];
  createdAt: string;
}

interface Inquiry {
  id: string;
  coachId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  coach: {
    slug: string;
    headline: string;
  };
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<CoachApplication | null>(null);

  // Fetch applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    enabled: !!user,
  });

  // Fetch coaches
  const { data: coachesData, isLoading: coachesLoading } = useQuery({
    queryKey: ["/api/admin/coaches"],
    enabled: !!user,
  });

  // Fetch inquiries
  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/admin/inquiries"],
    enabled: !!user,
  });

  // Application approval mutation
  const approveApplicationMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      await apiRequest(`/api/admin/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ 
          status: approved ? "approved" : "rejected",
          adminNotes: approved ? "Application approved - coach profile created" : "Application rejected"
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coaches"] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      setSelectedApplication(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/api/login"} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingApplications = applications.filter((app: CoachApplication) => app.status === "pending");
  const coaches = coachesData?.coaches || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage coaches, applications, and platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coaches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coaches.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coaches.length > 0 
                ? (coaches.reduce((sum: number, coach: Coach) => sum + coach.ratingAvg, 0) / coaches.length).toFixed(1)
                : "0.0"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">
            Coach Applications
            {pendingApplications.length > 0 && (
              <Badge className="ml-2 bg-orange-100 text-orange-800">{pendingApplications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="coaches">Coaches ({coaches.length})</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries ({inquiries.length})</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          {applicationsLoading ? (
            <div>Loading applications...</div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No applications found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application: CoachApplication) => (
                <Card key={application.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.headline}</CardTitle>
                        <CardDescription>
                          Applied {new Date(application.createdAt).toLocaleDateString()} • 
                          ${application.pricePerHour}/hour • {application.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          application.status === "pending" ? "secondary" :
                          application.status === "approved" ? "default" : "destructive"
                        }>
                          {application.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {application.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bio</p>
                        <p className="text-sm line-clamp-2">{application.bio}</p>
                      </div>
                      {application.status === "pending" && (
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => approveApplicationMutation.mutate({ id: application.id, approved: true })}
                            disabled={approveApplicationMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => approveApplicationMutation.mutate({ id: application.id, approved: false })}
                            disabled={approveApplicationMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Coaches Tab */}
        <TabsContent value="coaches" className="space-y-6">
          {coachesLoading ? (
            <div>Loading coaches...</div>
          ) : coaches.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No coaches found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach: Coach) => (
                <Card key={coach.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {coach.photos[0] && (
                        <img
                          src={coach.photos[0]}
                          alt={coach.headline}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-base">{coach.headline}</CardTitle>
                        <CardDescription>{coach.city}, {coach.country}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">${coach.pricePerHour}/hour</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Rating:</span>
                        <span className="font-medium">
                          {coach.ratingAvg.toFixed(1)} ({coach.ratingCount} reviews)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Sessions:</span>
                        <span className="font-medium">
                          {coach.virtualOnly ? "Virtual Only" : "In-Person & Virtual"}
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1">
                          {coach.specialties.slice(0, 3).map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {coach.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{coach.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-6">
          {inquiriesLoading ? (
            <div>Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No inquiries found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry: Inquiry) => (
                <Card key={inquiry.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{inquiry.name}</CardTitle>
                        <CardDescription>
                          {inquiry.email} • To: {inquiry.coach.headline} • 
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{inquiry.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Application Detail Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedApplication.headline}</DialogTitle>
                <DialogDescription>
                  Application submitted {new Date(selectedApplication.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Photos */}
                {selectedApplication.profilePhoto && (
                  <div>
                    <h4 className="font-medium mb-2">Profile Photo</h4>
                    <img
                      src={selectedApplication.profilePhoto}
                      alt="Profile"
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                  </div>
                )}
                
                {/* Bio */}
                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm">{selectedApplication.bio}</p>
                </div>
                
                {/* Experience */}
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <p className="text-sm">{selectedApplication.experience}</p>
                </div>
                
                {/* Certifications */}
                {selectedApplication.certifications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Specialties */}
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                
                {/* Pricing & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Pricing</h4>
                    <p className="text-sm">${selectedApplication.pricePerHour}/hour</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedApplication.virtualOnly ? "Virtual sessions only" : "In-person & virtual"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-sm">{selectedApplication.location}</p>
                    {selectedApplication.address && (
                      <p className="text-xs text-muted-foreground">{selectedApplication.address}</p>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                {selectedApplication.status === "pending" && (
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button
                      onClick={() => approveApplicationMutation.mutate({ id: selectedApplication.id, approved: true })}
                      disabled={approveApplicationMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => approveApplicationMutation.mutate({ id: selectedApplication.id, approved: false })}
                      disabled={approveApplicationMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}