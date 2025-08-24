import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/api";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const AdminSettingsPage = () => {
  const [storeHours, setStoreHours] = useState({
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "18:00" },
    saturday: { open: "10:00", close: "16:00" },
    sunday: { open: "10:00", close: "14:00" }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading: isDataLoading, refetch } = useQuery({
    queryKey: ["storeHours"],
    queryFn: () => userApi.getStoreHours(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setStoreHours(data.storeHours);
    }
  }, [data]);

  const handleSaveStoreHours = async () => {
    setIsSaving(true);
    try {
      await userApi.updateStoreHours(storeHours);
      toast({
        title: "Store hours updated",
        description: "Store hours have been updated successfully",
      });
      refetch();
    } catch (error) {
      console.error("Failed to update store hours:", error);
      toast({
        variant: "destructive",
        title: "Failed to update store hours",
        description: "Please try again later",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeChange = (day: string, type: string, value: string) => {
    setStoreHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [type]: value
      }
    }));
  };

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    };
    return days[day] || day;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">
          Settings
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Hours Card */}
          <Card>
            <CardHeader>
              <CardTitle>Store Hours</CardTitle>
              <CardDescription>Set your store opening and closing times for each day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-6 w-6 animate-spin text-amber-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(storeHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <Label htmlFor={`${day}-open`} className="w-24 font-medium">
                        {getDayName(day)}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`${day}-open`}
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                          className="w-24 text-center"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          id={`${day}-close`}
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                          className="w-24 text-center"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveStoreHours}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold-dark hover:to-gold-light text-primary-foreground"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Store Hours"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Other Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Other Settings</CardTitle>
              <CardDescription>Manage other store settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p>More settings options will be available in future updates.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;