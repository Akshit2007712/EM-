import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Settings,
  Users,
  Briefcase,
  CalendarDays,
  Image as ImageIcon,
  LogOut,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";
import {
  isAdmin,
  logoutAdmin,
  saveContent,
  uploadImage,
  resetContent,
  uid,
  type Person,
  type EventItem,
  type GalleryImage,
  type Team,
  type SiteContent,
} from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { useContent } from "@/hooks/use-content";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · The Empirical Society" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Tab = "site" | "people" | "teams" | "events" | "gallery";
type SaveStatus = "idle" | "saving" | "saved" | "error";

function AdminDashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useContent();
  const [tab, setTab] = useState<Tab>("site");
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/admin/login" });
  }, [navigate]);

  // Debounced persist: UI updates instantly; Supabase write fires 1.5 s after
  // the user stops making changes (prevents calling the DB on every keystroke).
  const persist = (next: SiteContent) => {
    setDraft(next);
    setContent(next);
    setSaveStatus("saving");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const result = await saveContent(next);
      if (result.ok) {
        setSaveStatus("saved");
        setSaveError("");
        setTimeout(() => setSaveStatus("idle"), 2200);
      } else {
        setSaveStatus("error");
        setSaveError(result.error ?? "Unknown error");
      }
    }, 1500);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "site", label: "Site Content", icon: <Settings className="size-4" /> },
    { id: "people", label: "People", icon: <Users className="size-4" /> },
    { id: "teams", label: "Teams", icon: <Briefcase className="size-4" /> },
    { id: "events", label: "Events", icon: <CalendarDays className="size-4" /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon className="size-4" /> },
  ];

  return (
    <div className="theme-light min-h-dvh bg-background text-foreground flex font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-panel min-h-dvh p-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-8 px-2">
          <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          <span className="text-xs font-bold tracking-[0.22em] uppercase">Admin Panel</span>
        </div>

        <div className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-foreground/80 hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8 space-y-3 border-t border-border">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full text-xs font-semibold px-4 py-2.5 border border-border rounded-lg hover:bg-accent hover:text-foreground transition-all"
          >
            <ExternalLink className="size-3.5" />
            View Site
          </Link>
          <button
            onClick={() => {
              if (confirm("Reset all content to defaults? This cannot be undone.")) {
                resetContent();
              }
            }}
            className="flex items-center justify-center gap-2 w-full text-xs font-semibold px-4 py-2.5 border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
          >
            <RotateCcw className="size-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => {
              logoutAdmin();
              navigate({ to: "/admin/login" });
            }}
            className="flex items-center justify-center gap-2 w-full text-xs font-semibold px-4 py-2.5 bg-foreground text-background rounded-lg hover:opacity-90 shadow-sm transition-opacity"
          >
            <LogOut className="size-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 bg-background/50">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-10 py-5 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold tracking-tight capitalize flex items-center gap-3">
            {tabs.find((t) => t.id === tab)?.icon}
            {tabs.find((t) => t.id === tab)?.label}
          </h1>
          {/* Save status badge */}
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium animate-pulse">
                <span className="size-1.5 rounded-full bg-primary inline-block" />
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="size-4" />
                Saved!
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-medium text-xs max-w-xs truncate" title={saveError}>
                ⚠ {saveError}
              </span>
            )}
          </div>
        </header>
        <div className="p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tab === "site" && <SiteTab draft={draft} persist={persist} />}
          {tab === "people" && <PeopleTab draft={draft} persist={persist} />}
          {tab === "teams" && <TeamsTab draft={draft} persist={persist} />}
          {tab === "events" && <EventsTab draft={draft} persist={persist} />}
          {tab === "gallery" && <GalleryTab draft={draft} persist={persist} />}
        </div>
      </main>
    </div>
  );
}

/* ---------- Reusable inputs ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded-lg shadow-sm placeholder:text-muted-foreground/50";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border shadow-sm rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function ImageUpload({
  onChange,
  label = "Upload Image",
}: {
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image before upload
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200; // Higher quality now — no localStorage limit
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) { setUploading(false); return; }

            if (supabase) {
              // Upload to Supabase Storage → permanent public URL
              const url = await uploadImage(blob);
              if (url) {
                onChange(url);
              } else {
                setUploadError("Upload failed. Check your Supabase bucket settings.");
              }
            } else {
              // Supabase not configured — fall back to base64 (localStorage)
              const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
              onChange(dataUrl);
            }
            setUploading(false);
          },
          "image/jpeg",
          0.88
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label
        className={`relative flex items-center justify-center gap-2 w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm ${
          uploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <UploadCloud className={`size-4 ${uploading ? "animate-bounce" : ""}`} />
        {uploading ? "Uploading to cloud…" : label}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}

/* ---------- Site Tab ---------- */

function SiteTab({ draft, persist }: { draft: SiteContent; persist: (c: SiteContent) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Main Content</h2>
        <Card>
          <div className="space-y-5">
            <Field label="Hero tagline">
              <input
                className={inputCls}
                value={draft.heroTagline}
                onChange={(e) => persist({ ...draft, heroTagline: e.target.value })}
              />
            </Field>
            <Field label="Hero subtitle">
              <textarea
                className={`${inputCls} min-h-[90px] resize-y`}
                value={draft.heroSubtitle}
                onChange={(e) => persist({ ...draft, heroSubtitle: e.target.value })}
              />
            </Field>
            <Field label="About paragraph">
              <textarea
                className={`${inputCls} min-h-[120px] resize-y`}
                value={draft.about}
                onChange={(e) => persist({ ...draft, about: e.target.value })}
              />
            </Field>
            <Field label="Mission statement">
              <textarea
                className={`${inputCls} min-h-[100px] resize-y`}
                value={draft.mission}
                onChange={(e) => persist({ ...draft, mission: e.target.value })}
              />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Social Links & Contact</h2>
        <Card>
          <div className="space-y-5">
            <Field label="Instagram URL">
              <input
                type="url"
                placeholder="https://instagram.com/..."
                className={inputCls}
                value={draft.socialLinks?.instagram || ""}
                onChange={(e) =>
                  persist({
                    ...draft,
                    socialLinks: { ...draft.socialLinks, instagram: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Twitter / X URL">
              <input
                type="url"
                placeholder="https://twitter.com/..."
                className={inputCls}
                value={draft.socialLinks?.twitter || ""}
                onChange={(e) =>
                  persist({
                    ...draft,
                    socialLinks: { ...draft.socialLinks, twitter: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                type="url"
                placeholder="https://linkedin.com/..."
                className={inputCls}
                value={draft.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  persist({
                    ...draft,
                    socialLinks: { ...draft.socialLinks, linkedin: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Contact Email">
              <input
                type="email"
                placeholder="mailto:hello@example.com"
                className={inputCls}
                value={draft.socialLinks?.email || ""}
                onChange={(e) =>
                  persist({
                    ...draft,
                    socialLinks: { ...draft.socialLinks, email: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- People Tab ---------- */

function PersonEditor({
  person,
  onChange,
  onDelete,
}: {
  person: Person;
  onChange: (p: Person) => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <div className="flex gap-4">
        <div className="w-24 shrink-0 aspect-[3/4] bg-panel border border-border overflow-hidden rounded-md">
          {person.photo && (
            <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Name">
            <input
              className={inputCls}
              value={person.name}
              onChange={(e) => onChange({ ...person, name: e.target.value })}
            />
          </Field>
          <Field label="Role">
            <input
              className={inputCls}
              value={person.role}
              onChange={(e) => onChange({ ...person, role: e.target.value })}
            />
          </Field>
          <Field label="Photo URL / Upload">
            <div className="space-y-2">
              <input
                className={inputCls}
                value={person.photo}
                placeholder="https://..."
                onChange={(e) => onChange({ ...person, photo: e.target.value })}
              />
              <ImageUpload
                onChange={(b64) => onChange({ ...person, photo: b64 })}
                label="Upload Photo"
              />
            </div>
          </Field>
          <Field label="Description">
            <input
              className={inputCls}
              value={person.description ?? ""}
              onChange={(e) => onChange({ ...person, description: e.target.value })}
            />
          </Field>
        </div>
        <button
          onClick={onDelete}
          className="self-start text-xs px-2 py-1 border border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Delete
        </button>
      </div>
    </Card>
  );
}

function PeopleGroup({
  title,
  list,
  onChange,
}: {
  title: string;
  list: Person[];
  onChange: (next: Person[]) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-[0.2em] uppercase">{title}</h2>
        <button
          onClick={() =>
            onChange([
              ...list,
              {
                id: uid(),
                name: "New person",
                role: "Role",
                photo:
                  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop&q=80",
                description: "",
              },
            ])
          }
          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          + Add
        </button>
      </div>
      <div className="space-y-3">
        {list.map((p, i) => (
          <PersonEditor
            key={p.id}
            person={p}
            onChange={(np) => {
              const copy = [...list];
              copy[i] = np;
              onChange(copy);
            }}
            onDelete={() => onChange(list.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    </section>
  );
}

function PeopleTab({ draft, persist }: { draft: SiteContent; persist: (c: SiteContent) => void }) {
  return (
    <div className="space-y-10">
      <PeopleGroup
        title="Mentors"
        list={draft.mentors}
        onChange={(mentors) => persist({ ...draft, mentors })}
      />
      <PeopleGroup
        title="Faculty Coordinators"
        list={draft.faculty}
        onChange={(faculty) => persist({ ...draft, faculty })}
      />
      <PeopleGroup
        title="Heads"
        list={draft.leads}
        onChange={(leads) => persist({ ...draft, leads })}
      />
    </div>
  );
}

/* ---------- Teams Tab ---------- */

function TeamsTab({ draft, persist }: { draft: SiteContent; persist: (c: SiteContent) => void }) {
  const setTeams = (teams: Team[]) => persist({ ...draft, teams });
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() =>
            setTeams([
              ...draft.teams,
              {
                id: uid(),
                name: "New Team",
                leads: [
                  {
                    id: uid(),
                    name: "Team Lead",
                    role: "Lead",
                    photo:
                      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop&q=80",
                  },
                ],
                members: [],
              },
            ])
          }
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 shadow-sm transition-all"
        >
          <Plus className="size-3.5" />
          Add Team
        </button>
      </div>
      {draft.teams.map((team, ti) => (
        <Card key={team.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <Field label="Team name">
              <input
                className={`${inputCls} min-w-[260px]`}
                value={team.name}
                onChange={(e) => {
                  const copy = [...draft.teams];
                  copy[ti] = { ...team, name: e.target.value };
                  setTeams(copy);
                }}
              />
            </Field>
            <button
              onClick={() => setTeams(draft.teams.filter((_, j) => j !== ti))}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
              title="Delete team"
            >
              <Trash2 className="size-3.5" />
              Delete team
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Heads
              </h3>
              <button
                onClick={() => {
                  const copy = [...draft.teams];
                  const leads = [...(team.leads || (team.lead ? [team.lead] : []))];
                  leads.push({
                    id: uid(),
                    name: "New Lead",
                    role: "Lead",
                    photo:
                      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop&q=80",
                  });
                  copy[ti] = { ...team, leads };
                  setTeams(copy);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-primary/20 text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors shadow-sm"
              >
                <Plus className="size-3.5" />
                Add lead
              </button>
            </div>
            <div className="space-y-3">
              {(team.leads || (team.lead ? [team.lead] : [])).map((l, li) => (
                <PersonEditor
                  key={l.id}
                  person={l}
                  onChange={(np) => {
                    const copy = [...draft.teams];
                    const leads = [...(team.leads || (team.lead ? [team.lead] : []))];
                    leads[li] = np;
                    copy[ti] = { ...team, leads };
                    setTeams(copy);
                  }}
                  onDelete={() => {
                    const copy = [...draft.teams];
                    const leads = [...(team.leads || (team.lead ? [team.lead] : []))];
                    leads.splice(li, 1);
                    copy[ti] = { ...team, leads };
                    setTeams(copy);
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Members
              </h3>
              <button
                onClick={() => {
                  const copy = [...draft.teams];
                  copy[ti] = {
                    ...team,
                    members: [
                      ...(team.members || []),
                      {
                        id: uid(),
                        name: "New member",
                        role: "Member",
                        photo:
                          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop&q=80",
                      },
                    ],
                  };
                  setTeams(copy);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-primary/20 text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors shadow-sm"
              >
                <Plus className="size-3.5" />
                Add member
              </button>
            </div>
            <div className="space-y-3">
              {(team.members || []).map((m, mi) => (
                <PersonEditor
                  key={m.id}
                  person={m}
                  onChange={(np) => {
                    const copy = [...draft.teams];
                    const members = [...(team.members || [])];
                    members[mi] = np;
                    copy[ti] = { ...team, members };
                    setTeams(copy);
                  }}
                  onDelete={() => {
                    const copy = [...draft.teams];
                    copy[ti] = {
                      ...team,
                      members: (team.members || []).filter((_, j) => j !== mi),
                    };
                    setTeams(copy);
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Events Tab ---------- */

function EventsTab({ draft, persist }: { draft: SiteContent; persist: (c: SiteContent) => void }) {
  const setEvents = (events: EventItem[]) => persist({ ...draft, events });
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() =>
            setEvents([
              {
                id: uid(),
                title: "New Event",
                date: new Date().toISOString().slice(0, 10),
                shortDescription: "Short description",
                description: "Full description",
                venue: "Venue",
                cover:
                  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop&q=80",
                photos: [],
              },
              ...draft.events,
            ])
          }
          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          + Add Event
        </button>
      </div>
      {draft.events.map((ev, i) => (
        <Card key={ev.id} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Title">
              <input
                className={inputCls}
                value={ev.title}
                onChange={(e) => {
                  const copy = [...draft.events];
                  copy[i] = { ...ev, title: e.target.value };
                  setEvents(copy);
                }}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                className={inputCls}
                value={ev.date}
                onChange={(e) => {
                  const copy = [...draft.events];
                  copy[i] = { ...ev, date: e.target.value };
                  setEvents(copy);
                }}
              />
            </Field>
            <Field label="Venue">
              <input
                className={inputCls}
                value={ev.venue}
                onChange={(e) => {
                  const copy = [...draft.events];
                  copy[i] = { ...ev, venue: e.target.value };
                  setEvents(copy);
                }}
              />
            </Field>
          </div>
          <Field label="Cover image URL / Upload">
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={ev.cover}
                placeholder="https://..."
                onChange={(e) => {
                  const copy = [...draft.events];
                  copy[i] = { ...ev, cover: e.target.value };
                  setEvents(copy);
                }}
              />
              <div className="shrink-0 w-32">
                <ImageUpload
                  label="Upload"
                  onChange={(b64) => {
                    const copy = [...draft.events];
                    copy[i] = { ...ev, cover: b64 };
                    setEvents(copy);
                  }}
                />
              </div>
            </div>
          </Field>
          <Field label="Short description (card)">
            <input
              className={inputCls}
              value={ev.shortDescription}
              onChange={(e) => {
                const copy = [...draft.events];
                copy[i] = { ...ev, shortDescription: e.target.value };
                setEvents(copy);
              }}
            />
          </Field>
          <Field label="Full description (modal)">
            <textarea
              className={`${inputCls} min-h-[100px]`}
              value={ev.description}
              onChange={(e) => {
                const copy = [...draft.events];
                copy[i] = { ...ev, description: e.target.value };
                setEvents(copy);
              }}
            />
          </Field>
          <Field label="Additional photos (one URL per line)">
            <textarea
              className={`${inputCls} min-h-[80px] font-mono text-xs`}
              value={ev.photos.join("\n")}
              onChange={(e) => {
                const copy = [...draft.events];
                copy[i] = {
                  ...ev,
                  photos: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                };
                setEvents(copy);
              }}
            />
          </Field>
          <div className="flex justify-end">
            <button
              onClick={() => setEvents(draft.events.filter((_, j) => j !== i))}
              className="text-xs px-3 py-1.5 border border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Delete event
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Gallery Tab ---------- */

function GalleryTab({ draft, persist }: { draft: SiteContent; persist: (c: SiteContent) => void }) {
  const [url, setUrl] = useState("");
  const setGallery = (gallery: GalleryImage[]) => persist({ ...draft, gallery });

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.gallery.length) return;
    const copy = [...draft.gallery];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setGallery(copy);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 w-full">
            <input
              className={inputCls}
              placeholder="Image URL (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={() => {
                if (!url.trim()) return;
                setGallery([{ id: uid(), url: url.trim() }, ...draft.gallery]);
                setUrl("");
              }}
              className="text-xs px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 whitespace-nowrap shadow-sm"
            >
              + Add URL
            </button>
          </div>
          <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            OR
          </div>
          <div className="w-full md:w-48">
            <ImageUpload
              label="Upload from PC"
              onChange={(b64) => {
                setGallery([{ id: uid(), url: b64 }, ...draft.gallery]);
              }}
            />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {draft.gallery.map((g, i) => (
          <div key={g.id} className="bg-card border border-border rounded-md overflow-hidden">
            <div className="aspect-square bg-panel">
              <img src={g.url} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-2 flex items-center justify-between gap-1">
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  className="text-xs px-2 py-1 border border-border rounded hover:bg-accent"
                  title="Move left"
                >
                  ←
                </button>
                <button
                  onClick={() => move(i, 1)}
                  className="text-xs px-2 py-1 border border-border rounded hover:bg-accent"
                  title="Move right"
                >
                  →
                </button>
              </div>
              <button
                onClick={() => setGallery(draft.gallery.filter((_, j) => j !== i))}
                className="text-xs px-2 py-1 border border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
