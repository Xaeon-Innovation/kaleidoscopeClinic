import { team as defaultTeam } from "@/lib/about-data";
import type { TeamDoc } from "./types";

export type TeamMemberDisplay = {
  id?: string;
  photo: string;
  badge: string;
  name: string;
  role: string;
  subtitle?: string;
  credentials: string[];
  bio: string;
  specialties: string[];
};

function parseList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function teamDocToDisplay(
  doc: TeamDoc & { id?: string }
): TeamMemberDisplay {
  return {
    id: doc.id,
    photo: doc.headshotUrl || "/images/dr-sherif-elsharkawy.png",
    badge: doc.badge || doc.titles,
    name: doc.name,
    role: doc.titles,
    subtitle: doc.subtitle,
    credentials: parseList(doc.credentials),
    bio: doc.bioShort,
    specialties: doc.specialties ?? [],
  };
}

export function defaultTeamDisplay(): TeamMemberDisplay[] {
  return defaultTeam.map((member) => ({
    photo: member.photo,
    badge: member.badge,
    name: member.name,
    role: member.role,
    subtitle: member.subtitle,
    credentials: [...member.credentials],
    bio: member.bio,
    specialties: [...member.specialties],
  }));
}

export function defaultTeamDocs(): TeamDoc[] {
  return defaultTeam.map((member, index) => ({
    name: member.name,
    badge: member.badge,
    titles: member.role,
    subtitle: member.subtitle,
    bioShort: member.bio,
    credentials: member.credentials.join(", "),
    specialties: [...member.specialties],
    headshotUrl: member.photo,
    ordering: (index + 1) * 10,
  }));
}
