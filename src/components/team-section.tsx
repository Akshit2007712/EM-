import { useState } from "react";
import { useContent } from "@/hooks/use-content";
import { SectionHeading } from "./section-heading";
import { PersonCard } from "./person-card";
import type { Team } from "@/lib/store";

function TeamBlock({ team }: { team: Team }) {
  const [showMembers, setShowMembers] = useState(false);
  const members = team.members || [];
  const hasMembers = members.length > 0;

  return (
    <div className="border-t border-border pt-8 mt-8 first:border-t-0 first:pt-0 first:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-5 reveal">
        <h3 className="text-xl md:text-3xl font-semibold tracking-tight">{team.name}</h3>
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          {members.length + 1} members
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 flex flex-col gap-4">
          {(team.leads || (team.lead ? [team.lead] : [])).map((l, i) => (
            <PersonCard key={l.id} person={l} index={i} />
          ))}
        </div>

        {hasMembers && (
          <div className="md:col-span-3 flex flex-col items-start gap-4">
            {showMembers ? (
              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {members.map((m, i) => (
                  <PersonCard key={m.id} person={m} index={i + 1} />
                ))}
              </div>
            ) : null}

            <button
              onClick={() => setShowMembers(!showMembers)}
              className="text-xs font-semibold tracking-[0.1em] uppercase px-5 py-2.5 border border-border bg-card hover:bg-accent text-foreground transition-all rounded-lg shadow-sm"
            >
              {showMembers ? "Hide team members ↑" : `View ${members.length} team members ↓`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const [content] = useContent();

  return (
    <section id="team" className="border-t border-border section-anchor">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="mb-8 md:mb-10">
          <div className="space-y-4 md:space-y-6">
            <SectionHeading number="03" label="The Directorate" />
            <h2 className="text-3xl md:text-6xl font-semibold tracking-tight max-w-[18ch] text-balance reveal">
              Mentors, leads, and the teams behind every initiative.
            </h2>
          </div>
        </div>

        {/* Faculty Coordinators */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-6 reveal">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Faculty Coordinators
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {content.faculty.map((p, i) => (
              <PersonCard key={p.id} person={p} index={i} />
            ))}
          </div>
        </div>

        {/* Mentors */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-6 reveal">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Mentors</h3>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {content.mentors.length} guides
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {content.mentors.map((p, i) => (
              <PersonCard key={p.id} person={p} index={i} />
            ))}
          </div>
        </div>

        {/* Heads */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6 reveal">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Heads</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {content.leads.map((p, i) => (
              <PersonCard key={p.id} person={p} index={i} />
            ))}
          </div>
        </div>

        {/* Teams */}
        <div className="border-t border-border pt-10">
          <div className="mb-8 reveal">
            <SectionHeading number="04" label="The Teams" />
            <h3 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight max-w-[24ch] text-balance">
              Six teams. One society. Everything we ship.
            </h3>
          </div>
          {content.teams.map((t) => (
            <TeamBlock key={t.id} team={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
