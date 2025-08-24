
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "./AdminLayout";

// Define the type for store hours fields
type StoreHoursFormValues = {
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
  sundayOpen: string;
  sundayClose: string;
};

// Store hours schema
const storeHoursSchema = z.object({
  mondayOpen: z.string().min(1, { message: "Opening time is required" }),
  mondayClose: z.string().min(1, { message: "Closing time is required" }),
  tuesdayOpen: z.string().min(1, { message: "Opening time is required" }),
  tuesdayClose: z.string().min(1, { message: "Closing time is required" }),
  wednesdayOpen: z.string().min(1, { message: "Opening time is required" }),
  wednesdayClose: z.string().min(1, { message: "Closing time is required" }),
  thursdayOpen: z.string().min(1, { message: "Opening time is required" }),
  thursdayClose: z.string().min(1, { message: "Closing time is required" }),
  fridayOpen: z.string().min(1, { message: "Opening time is required" }),
  fridayClose: z.string().min(1, { message: "Closing time is required" }),
  saturdayOpen: z.string().min(1, { message: "Opening time is required" }),
  saturdayClose: z.string().min(1, { message: "Closing time is required" }),
  sundayOpen: z.string().min(1, { message: "Opening time is required" }),
  sundayClose: z.string().min(1, { message: "Closing time is required" }),
});

// Account settings schema
const accountSettingsSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  currentPassword: z.string().min(1, { message: "Current password is required for verification" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  confirmPassword: z.string().optional()
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const AdminSettingsPage = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store hours form
  const storeHoursForm = useForm<StoreHoursFormValues>({
    resolver: zodResolver(storeHoursSchema),
    defaultValues: {
      mondayOpen: "09:00",
      mondayClose: "18:00",
      tuesdayOpen: "09:00",
      tuesdayClose: "18:00",
      wednesdayOpen: "09:00",
      wednesdayClose: "18:00",
      thursdayOpen: "09:00",
      thursdayClose: "18:00",
      fridayOpen: "09:00",
      fridayClose: "18:00",
      saturdayOpen: "10:00",
      saturdayClose: "16:00",
      sundayOpen: "10:00",
      sundayClose: "14:00",
    },
  });

  // Account settings form
  const accountForm = useForm({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle store hours form submission
  const onSubmitStoreHours = (data: StoreHoursFormValues) => {
    setIsSubmitting(true);
    
    // Simulating API call to save store hours
    setTimeout(() => {
      console.log("Store hours data:", data);
      toast({
        title: "Store hours updated",
        description: "Your store hours have been saved successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  // Handle account settings form submission
  const onSubmitAccountSettings = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // First update profile if name changed
      if (data.name !== user?.name) {
        await updateUserProfile(data.name);
      }
      
      // Then update password if provided
      if (data.newPassword) {
        await updateUserPassword(data.currentPassword, data.newPassword);
      }
      
      toast({
        title: "Account updated",
        description: "Your account settings have been saved successfully.",
      });
      
      // Reset password fields
      accountForm.reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error updating account",
        description: (error as Error).message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render day row for store hours
  const renderDayRow = (day: Day) => {
    const openField = `${day.toLowerCase()}Open` as keyof StoreHoursFormValues;
    const closeField = `${day.toLowerCase()}Close` as keyof StoreHoursFormValues;
    
    return (
      <div className="grid grid-cols-3 gap-4 items-center py-2">
        <div className="font-medium">{day}</div>
        <FormField
          control={storeHoursForm.control}
          name={openField}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={storeHoursForm.control}
          name={closeField}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store settings and account preferences
          </p>
        </div>

        <Tabs defaultValue="store" className="space-y-4">
          <TabsList>
            <TabsTrigger value="store">Store Settings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="store" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Store Hours
                </CardTitle>
                <CardDescription>
                  Set your store opening and closing hours for each day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...storeHoursForm}>
                  <form id="store-hours-form" onSubmit={storeHoursForm.handleSubmit(onSubmitStoreHours)}>
                    <div className="grid grid-cols-3 gap-4 items-center mb-2">
                      <div className="font-semibold">Day</div>
                      <div className="font-semibold">Opening</div>
                      <div className="font-semibold">Closing</div>
                    </div>
                    <Separator className="mb-4" />
                    {renderDayRow("Monday")}
                    {renderDayRow("Tuesday")}
                    {renderDayRow("Wednesday")}
                    {renderDayRow("Thursday")}
                    {renderDayRow("Friday")}
                    {renderDayRow("Saturday")}
                    {renderDayRow("Sunday")}
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="store-hours-form" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Store Hours"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your account information and change your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...accountForm}>
                  <form id="account-form" onSubmit={accountForm.handleSubmit(onSubmitAccountSettings)} className="space-y-4">
                    <FormField
                      control={accountForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-4" />
                    <div>
                      <h3 className="font-medium mb-2">Change Password</h3>
                    </div>
                    
                    <FormField
                      control={accountForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="account-form" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Update Account"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
