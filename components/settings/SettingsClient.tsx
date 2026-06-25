"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Briefcase, Lock, Trash2, User } from "lucide-react";
import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/profile/fields/TagInput";
import { useToast } from "@/hooks/use-toast";
import type { JobAlert, Settings } from "@/lib/types";
import { CITIES } from "@/lib/constants/locations";

const TABS = [
  { value: "preferences", label: "Job Preferences", icon: Briefcase },
  { value: "account", label: "Account", icon: User },
  { value: "alerts", label: "Job Alerts", icon: Bell },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "privacy", label: "Privacy", icon: Lock },
];

export function SettingsClient({ settings: initial }: { settings: Settings }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const tab = searchParams.get("tab") ?? "preferences";

  const [settings, setSettings] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);

  async function persist(patch: Partial<Settings>, message = "Settings saved") {
    setSaving(true);
    setSettings((prev) => ({ ...prev, ...patch }));
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      toast({ title: message, variant: "success" });
    } catch {
      toast({ title: "Could not save", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => router.replace(`/settings?tab=${v}`, { scroll: false })}
    >
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="preferences">
        <PreferencesTab settings={settings} saving={saving} onSave={persist} />
      </TabsContent>
      <TabsContent value="account">
        <AccountTab settings={settings} saving={saving} onSave={persist} />
      </TabsContent>
      <TabsContent value="alerts">
        <AlertsTab settings={settings} setSettings={setSettings} />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsTab settings={settings} onSave={persist} />
      </TabsContent>
      <TabsContent value="privacy">
        <PrivacyTab settings={settings} onSave={persist} />
      </TabsContent>
    </Tabs>
  );
}

interface TabProps {
  settings: Settings;
  saving: boolean;
  onSave: (patch: Partial<Settings>, message?: string) => Promise<void>;
}

function PreferencesTab({ settings, saving, onSave }: TabProps) {
  const [prefs, setPrefs] = React.useState(settings.jobPreferences);
  return (
    <Card className="space-y-4 p-5">
      <div className="space-y-1.5">
        <Label>Desired roles</Label>
        <TagInput
          value={prefs.desiredRoles}
          onChange={(v) => setPrefs({ ...prefs, desiredRoles: v })}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Preferred locations</Label>
        <TagInput
          value={prefs.preferredLocations}
          onChange={(v) => setPrefs({ ...prefs, preferredLocations: v })}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Industries</Label>
        <TagInput
          value={prefs.industries}
          onChange={(v) => setPrefs({ ...prefs, industries: v })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="salary">Expected salary (₹ LPA)</Label>
          <Input
            id="salary"
            type="number"
            value={prefs.expectedSalary}
            onChange={(e) => setPrefs({ ...prefs, expectedSalary: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Work mode</Label>
          <Select value={prefs.workMode} onValueChange={(v) => setPrefs({ ...prefs, workMode: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Remote", "Hybrid", "Office"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Availability to join</Label>
          <Select
            value={prefs.availabilityToJoin}
            onValueChange={(v) => setPrefs({ ...prefs, availabilityToJoin: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Immediate", "15 days", "1 month", "2 months", "3 months"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        disabled={saving}
        onClick={() => onSave({ jobPreferences: prefs }, "Job preferences saved")}
      >
        Save preferences
      </Button>
    </Card>
  );
}

function AccountTab({ settings, saving, onSave }: TabProps) {
  const [email, setEmail] = React.useState(settings.account.email);
  return (
    <Card className="space-y-4 p-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="newpass">New password</Label>
        <Input id="newpass" type="password" placeholder="••••••••" />
        <p className="text-xs text-muted-foreground">
          Password changes are simulated in this demo and are not persisted.
        </p>
      </div>
      <Button disabled={saving} onClick={() => onSave({ account: { email } }, "Account updated")}>
        Update account
      </Button>
    </Card>
  );
}

function AlertsTab({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
  const { toast } = useToast();
  const [keyword, setKeyword] = React.useState("");
  const [location, setLocation] = React.useState<string>(CITIES[0]);
  const [frequency, setFrequency] = React.useState<"Daily" | "Weekly">("Daily");

  async function createAlert() {
    if (!keyword.trim()) {
      toast({ title: "Enter a keyword for the alert", variant: "error" });
      return;
    }
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: keyword.trim(), location, experience: "", frequency }),
    });
    if (res.ok) {
      const data = (await res.json()) as { alert: JobAlert };
      setSettings((prev) => ({ ...prev, alerts: [data.alert, ...prev.alerts] }));
      setKeyword("");
      toast({ title: "Job alert created", variant: "success" });
    }
  }

  async function removeAlert(id: string) {
    setSettings((prev) => ({ ...prev, alerts: prev.alerts.filter((a) => a.id !== id) }));
    await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    toast({ title: "Alert removed", variant: "default" });
  }

  return (
    <Card className="space-y-4 p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_140px_auto]">
        <Input
          placeholder="Keyword e.g. React Developer"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger aria-label="Location">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={frequency} onValueChange={(v) => setFrequency(v as "Daily" | "Weekly")}>
          <SelectTrigger aria-label="Frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={createAlert}>Create alert</Button>
      </div>

      <div className="divide-y divide-border">
        {settings.alerts.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No job alerts yet.</p>
        ) : (
          settings.alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{alert.keyword}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.location} · {alert.frequency}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => removeAlert(alert.id)}
                aria-label="Delete alert"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function NotificationsTab({
  settings,
  onSave,
}: {
  settings: Settings;
  onSave: (patch: Partial<Settings>, message?: string) => Promise<void>;
}) {
  const n = settings.notifications;
  const update = (key: keyof typeof n, value: boolean) =>
    onSave({ notifications: { ...n, [key]: value } }, "Notification preferences saved");

  return (
    <Card className="divide-y divide-border p-5">
      <ToggleRow
        label="Recruiter messages"
        description="Get notified when recruiters message you"
        checked={n.recruiterMessages}
        onChange={(v) => update("recruiterMessages", v)}
      />
      <ToggleRow
        label="Job recommendations"
        description="Receive personalised job recommendations"
        checked={n.jobRecommendations}
        onChange={(v) => update("jobRecommendations", v)}
      />
      <ToggleRow
        label="Application updates"
        description="Updates when your application status changes"
        checked={n.applicationUpdates}
        onChange={(v) => update("applicationUpdates", v)}
      />
      <ToggleRow
        label="Promotions"
        description="Offers and product updates from Naukri"
        checked={n.promotions}
        onChange={(v) => update("promotions", v)}
      />
    </Card>
  );
}

function PrivacyTab({
  settings,
  onSave,
}: {
  settings: Settings;
  onSave: (patch: Partial<Settings>, message?: string) => Promise<void>;
}) {
  const p = settings.privacy;
  return (
    <Card className="space-y-4 p-5">
      <div className="space-y-1.5">
        <Label>Profile visibility to recruiters</Label>
        <Select
          value={p.profileVisibility}
          onValueChange={(v) =>
            onSave(
              { privacy: { ...p, profileVisibility: v as typeof p.profileVisibility } },
              "Privacy updated",
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Visible to all recruiters">Visible to all recruiters</SelectItem>
            <SelectItem value="Limited">Limited</SelectItem>
            <SelectItem value="Not visible">Not visible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="divide-y divide-border">
        <ToggleRow
          label="Show contact details"
          description="Allow recruiters to view your phone and email"
          checked={p.showContactDetails}
          onChange={(v) => onSave({ privacy: { ...p, showContactDetails: v } }, "Privacy updated")}
        />
        <ToggleRow
          label="Show salary details"
          description="Display your current and expected salary to recruiters"
          checked={p.showSalaryDetails}
          onChange={(v) => onSave({ privacy: { ...p, showSalaryDetails: v } }, "Privacy updated")}
        />
      </div>
    </Card>
  );
}
