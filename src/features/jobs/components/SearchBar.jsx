"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Search, X } from "lucide-react";
import clsx from "clsx";
import {
  MAX_KEYWORDS,
  MAX_KEYWORD_LENGTH,
  POSTED_WITHIN_OPTIONS,
  joinKeywords,
  parseKeywords,
} from "../filters.js";
import { Dropdown, DropdownOption, darkButton } from "./ui.jsx";

/**
 * Keywords are staged here and only reach the URL on "Start searching" (or
 * Enter) — that keeps one request per search instead of one per keystroke.
 * Location and date, picked from a fixed list rather than typed, apply the
 * moment they're chosen, the same as every checkbox in the sidebar; the
 * `onSearch` call for either merges onto the currently-applied filters, so it
 * never submits a keyword still sitting unconfirmed in the input.
 */
export function SearchBar({ filters, facets, onSearch }) {
  const [keywords, setKeywords] = useState(() => parseKeywords(filters.q));
  const [draft, setDraft] = useState("");
  const [location, setLocation] = useState(filters.location);
  const [locationDraft, setLocationDraft] = useState("");
  const [postedWithin, setPostedWithin] = useState(filters.postedWithin);
  const [open, setOpen] = useState(null); // "location" | "posted" | null

  // Follow the URL when it changes underneath (sidebar reset, back button).
  useEffect(() => setKeywords(parseKeywords(filters.q)), [filters.q]);
  useEffect(() => setLocation(filters.location), [filters.location]);
  useEffect(() => setPostedWithin(filters.postedWithin), [filters.postedWithin]);

  const addKeyword = (raw) => {
    const keyword = raw.replace(/,/g, " ").trim().slice(0, MAX_KEYWORD_LENGTH);
    if (!keyword) return keywords;
    const exists = keywords.some((k) => k.toLowerCase() === keyword.toLowerCase());
    const next = exists || keywords.length >= MAX_KEYWORDS ? keywords : [...keywords, keyword];
    setKeywords(next);
    setDraft("");
    return next;
  };

  const removeKeyword = (keyword) =>
    setKeywords((prev) => prev.filter((k) => k !== keyword));

  const onKeywordKey = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      if (draft.trim()) {
        event.preventDefault();
        addKeyword(draft);
      }
    } else if (event.key === "Backspace" && !draft && keywords.length) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const allKeywords = draft.trim() ? addKeyword(draft) : keywords;
    setOpen(null);
    onSearch({ q: joinKeywords(allKeywords), location, postedWithin });
  };

  const pickLocation = (value) => {
    setLocation(value);
    setLocationDraft("");
    setOpen(null);
    onSearch({ location: value });
  };

  const postedLabel =
    POSTED_WITHIN_OPTIONS.find((option) => option.value === postedWithin && option.value)?.label ?? "";

  return (
    <form
      onSubmit={submit}
      className="flex flex-col rounded-[18px] border border-line bg-white shadow-[0_0_0_3px_rgba(221,229,237,0.5)] lg:flex-row lg:items-stretch"
    >
      {/* Keywords */}
      <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 px-4 py-1.5">
        <Search size={17} className="shrink-0 text-dim" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-surface py-1.5 pr-2 pl-3 text-[14px] leading-none font-semibold text-ink"
            >
              <span className="truncate">{keyword}</span>
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                aria-label={`Remove ${keyword}`}
                className="grid size-4 place-items-center rounded-full text-dim hover:bg-white hover:text-ink"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeywordKey}
            onBlur={() => draft.trim() && addKeyword(draft)}
            maxLength={MAX_KEYWORD_LENGTH}
            aria-label="Keywords"
            placeholder={keywords.length ? "Add keyword" : "Job title, skill or company"}
            className="h-8 min-w-[120px] flex-1 bg-transparent text-[14.5px] font-medium text-ink outline-none placeholder:text-dim/70"
          />
        </div>
      </div>

      {/* Location */}
      <Dropdown
        icon={MapPin}
        label={location}
        placeholder="All locations"
        open={open === "location"}
        onOpenChange={(next) => setOpen(next ? "location" : null)}
        className="border-t border-line lg:w-[230px] lg:border-t-0 lg:border-l"
      >
        <input
          type="text"
          value={locationDraft}
          onChange={(event) => setLocationDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (locationDraft.trim()) pickLocation(locationDraft.trim().slice(0, 100));
            }
          }}
          placeholder="Type a city or country…"
          aria-label="Location"
          autoFocus
          className="mb-1 h-11 w-full rounded-[10px] bg-surface px-3.5 text-[15px] font-medium text-ink outline-none placeholder:text-dim/70"
        />
        <div role="listbox" className="max-h-[260px] overflow-y-auto">
          <DropdownOption selected={!location} onSelect={() => pickLocation("")}>
            All locations
          </DropdownOption>
          {(facets?.locations ?? [])
            .filter((loc) => loc.toLowerCase().includes(locationDraft.trim().toLowerCase()))
            .map((loc) => (
              <DropdownOption key={loc} selected={location === loc} onSelect={() => pickLocation(loc)}>
                {loc}
              </DropdownOption>
            ))}
          {locationDraft.trim() && (
            <DropdownOption selected={false} onSelect={() => pickLocation(locationDraft.trim().slice(0, 100))}>
              Search &ldquo;{locationDraft.trim()}&rdquo;
            </DropdownOption>
          )}
        </div>
      </Dropdown>

      {/* Date posted */}
      <Dropdown
        icon={CalendarDays}
        label={postedLabel}
        placeholder="Date posted"
        open={open === "posted"}
        onOpenChange={(next) => setOpen(next ? "posted" : null)}
        className="border-t border-line lg:w-[210px] lg:border-t-0 lg:border-l"
      >
        <div role="listbox">
          {POSTED_WITHIN_OPTIONS.map((option) => (
            <DropdownOption
              key={option.value}
              selected={postedWithin === option.value}
              onSelect={() => {
                setPostedWithin(option.value);
                setOpen(null);
                onSearch({ postedWithin: option.value });
              }}
            >
              {option.label}
            </DropdownOption>
          ))}
        </div>
      </Dropdown>

      <div className="border-t border-line p-1.5 lg:border-t-0 lg:pl-0">
        <button type="submit" className={clsx(darkButton, "h-11 w-full px-6 text-[14.5px] lg:h-full lg:min-h-12")}>
          Start searching
        </button>
      </div>
    </form>
  );
}
