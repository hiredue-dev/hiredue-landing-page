"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { hasActiveFilters } from "../filters.js";
import { EXPERIENCE_LEVELS, groupSources, platformLabel, roleLabel } from "../format.js";
import { CheckRow, secondaryButton } from "./ui.jsx";

const POPULAR_LOCATIONS = 8;
const ROLES_COLLAPSED = 8;

/** Every change here applies at once; the search bar is the only staged input. */
export function FilterSidebar({ filters, facets, onChange, onReset }) {
  const [showAllRoles, setShowAllRoles] = useState(false);
  const toggle = (key, value) =>
    onChange({
      [key]: filters[key].includes(value)
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });

  const sources = groupSources(facets?.platforms);
  const roles = facets?.roles ?? [];
  // Keep a selected role visible even when it isn't in the top list.
  const selectedExtra = filters.roles
    .filter((role) => !roles.some((r) => r.name === role))
    .map((name) => ({ name, count: null }));
  const allRoles = [...selectedExtra, ...roles];
  const shownRoles = showAllRoles ? allRoles : allRoles.slice(0, ROLES_COLLAPSED);

  const locations = (facets?.locations ?? []).slice(0, POPULAR_LOCATIONS);
  // A location typed into the search bar isn't in the list; show it so the choice is visible.
  const locationOptions =
    filters.location && !locations.includes(filters.location)
      ? [filters.location, ...locations]
      : locations;

  return (
    <div className="flex flex-col gap-7">
      <Section title="Experience">
        {EXPERIENCE_LEVELS.map((level) => (
          <CheckRow
            key={level.value}
            label={
              <>
                {level.label} <span className="text-dim">· {level.range}</span>
              </>
            }
            count={facets?.experienceLevels?.find((e) => e.name === level.value)?.count}
            checked={filters.experience.includes(level.value)}
            onChange={() => toggle("experience", level.value)}
          />
        ))}
      </Section>

      {allRoles.length > 0 && (
        <Section title="Role">
          {shownRoles.map((role) => (
            <CheckRow
              key={role.name}
              label={roleLabel(role.name)}
              count={role.count}
              checked={filters.roles.includes(role.name)}
              onChange={() => toggle("roles", role.name)}
            />
          ))}
          {allRoles.length > ROLES_COLLAPSED && (
            <button
              type="button"
              onClick={() => setShowAllRoles((value) => !value)}
              className="self-start py-1.5 text-[14px] font-semibold text-brand hover:underline"
            >
              {showAllRoles ? "Show fewer" : `Show all ${allRoles.length} roles`}
            </button>
          )}
        </Section>
      )}

      {filters.source !== "posts" && sources.length > 0 && (
        <Section title="Job source">
          {sources.map((platform) => (
            <CheckRow
              key={platform.name}
              label={platformLabel(platform.name)}
              count={platform.count}
              checked={filters.platforms.includes(platform.name)}
              onChange={() => toggle("platforms", platform.name)}
            />
          ))}
        </Section>
      )}

      {filters.source !== "posts" && (
      <Section title="How to apply">
        <CheckRow
          label="Easy Apply only"
          checked={filters.easyApply}
          onChange={() => onChange({ easyApply: !filters.easyApply })}
        />
      </Section>
      )}

      {locationOptions.length > 0 && (
        <Section title="Popular locations">
          <CheckRow
            type="radio"
            name="job-location"
            label="All locations"
            checked={!filters.location}
            onChange={() => onChange({ location: "" })}
          />
          {locationOptions.map((location) => (
            <CheckRow
              key={location}
              type="radio"
              name="job-location"
              label={location}
              checked={filters.location === location}
              onChange={() => onChange({ location })}
            />
          ))}
        </Section>
      )}

      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters(filters)}
        className={clsx(secondaryButton, "h-12 w-full disabled:cursor-not-allowed disabled:opacity-50")}
      >
        Reset filters
      </button>
    </div>
  );
}

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-between gap-3 py-1 text-left"
      >
        <h2 className="font-display text-[18px] leading-[1.2] font-semibold text-ink">{title}</h2>
        <ChevronDown
          size={18}
          aria-hidden
          className={clsx("text-dim transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && <div className="flex flex-col">{children}</div>}
    </section>
  );
}
