import type { Person } from "@/lib/store";

export function PersonCard({ person, index }: { person: Person; index?: number }) {
  return (
    <div className="group bg-card border border-border p-1 transition-all duration-500 hover:border-led/40 hover:shadow-[0_8px_30px_rgba(0,200,255,0.06)]">
      <div className="bg-panel relative overflow-hidden mb-3 outline outline-1 outline-border -outline-offset-1">
        <img
          src={person.photo}
          loading="lazy"
          alt={person.name}
          className="w-full aspect-[3/4] object-cover grayscale-0 md:grayscale md:contrast-110 md:group-hover:grayscale-0 md:group-hover:contrast-100 transition-all duration-700 md:group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="px-2 pb-3">
        <h4 className="text-base font-semibold tracking-tight group-hover:text-led transition-colors">
          {person.name}
        </h4>
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground mt-1">
          {person.role}
        </p>
        {person.description && (
          <p className="text-sm text-muted-foreground/80 mt-3 leading-relaxed line-clamp-3">
            {person.description}
          </p>
        )}
      </div>
    </div>
  );
}
