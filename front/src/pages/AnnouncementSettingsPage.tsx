import { useEffect, useState } from "react";
import { Megaphone, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { announcementSettings } from "@/api/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_ANNOUNCEMENTS = [
  "Summer Sale - Extra 25% off on Orders above ₹5000",
  "Complimentary Free Doorstep Delivery Across India on Orders Above ₹5000",
  "Summer Sale - Extra 15% off on Orders above ₹1500 + 5% off on Prepaid Orders",
];

export default function AnnouncementSettingsPage() {
  const [messagesText, setMessagesText] = useState(
    DEFAULT_ANNOUNCEMENTS.join("\n")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementSettings.get();
        const messages = response.data?.data?.messages;
        if (Array.isArray(messages) && messages.length > 0) {
          setMessagesText(messages.join("\n"));
        }
      } catch (error) {
        console.error("Failed to load announcement settings:", error);
        toast.error("Could not load saved announcements. Showing default messages.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleRestoreDefaults = () => {
    setMessagesText(DEFAULT_ANNOUNCEMENTS.join("\n"));
  };

  const handleSave = async () => {
    const messages = messagesText
      .split("\n")
      .map((message) => message.trim())
      .filter(Boolean);

    if (messages.length === 0) {
      toast.error("Add at least one announcement message.");
      return;
    }

    if (messages.length > 10 || messages.some((message) => message.length > 180)) {
      toast.error("Use up to 10 messages, with no more than 180 characters each.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await announcementSettings.update(messages);
      if (response.data?.success) {
        setMessagesText(response.data.data.messages.join("\n"));
        toast.success("Announcement bar messages saved.");
      } else {
        toast.error(response.data?.message || "Could not save announcement messages.");
      }
    } catch (error: any) {
      console.error("Failed to save announcement settings:", error);
      toast.error(
        error.response?.data?.message || "Could not save announcement messages."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1F2937]">
            Announcement Bar
          </h1>
          <p className="mt-1.5 text-sm text-[#9CA3AF]">
            Edit the rotating promotional messages shown at the top of the storefront.
          </p>
        </div>
        <div className="h-px bg-[#E5E7EB]" />
      </div>

      <Card className="rounded-xl border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader className="px-6 pb-3 pt-6">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#1F2937]">
            <Megaphone className="h-5 w-5 text-[#4CAF50]" />
            Rotating messages
          </CardTitle>
          <p className="text-sm text-[#6B7280]">
            Enter one message per line. The storefront rotates through them automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <Textarea
            value={messagesText}
            onChange={(event) => setMessagesText(event.target.value)}
            disabled={isLoading || isSaving}
            rows={7}
            maxLength={1810}
            aria-label="Announcement bar messages"
            placeholder="Enter one announcement per line"
          />
          <p className="text-xs text-[#9CA3AF]">
            Up to 10 messages; each message can contain up to 180 characters.
            If the API is unavailable, the storefront continues to show default messages.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleRestoreDefaults}
              disabled={isLoading || isSaving}
              className="border-[#E5E7EB]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore defaults
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="bg-[#0A3B3F] text-white hover:bg-[#0d4d52]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save messages"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
