import type { Member, MembersDashboardFilters } from "@/types/membersDashboard";

// Fictional demo members. Replace this fixture with the real query below.
export const MOCK_MEMBERS: Member[] = [
  {
    id: "mock-member-1",
    name: "Alex Chen",
    role: "Developer",
    team: "Community Connect",
    joined: "Sep 2026",
    status: "Active",
  },
  {
    id: "mock-member-2",
    name: "Jordan Patel",
    role: "Designer",
    team: "Community Connect",
    joined: "May 2026",
    status: "Active",
  },
  {
    id: "mock-member-3",
    name: "Taylor Nguyen",
    role: "Project Lead",
    team: "Food Access",
    joined: "Jan 2026",
    status: "Active",
  },
  {
    id: "mock-member-4",
    name: "Sam Rivera",
    role: "Developer",
    team: "Food Access",
    joined: "Sep 2026",
    status: "Active",
  },
  {
    id: "mock-member-5",
    name: "Morgan Lee",
    role: "Designer",
    team: "Volunteer Hub",
    joined: "May 2026",
    status: "Archived",
  },
  {
    id: "mock-member-6",
    name: "Casey Wong",
    role: "Project Lead",
    team: "Volunteer Hub",
    joined: "Jan 2026",
    status: "Active",
  },
  {
    id: "mock-member-7",
    name: "Jamie Singh",
    role: "Developer",
    team: "Community Connect",
    joined: "Sep 2026",
    status: "Active",
  },
  {
    id: "mock-member-8",
    name: "Riley Thompson",
    role: "Designer",
    team: "Community Connect",
    joined: "May 2026",
    status: "Active",
  },
  {
    id: "mock-member-9",
    name: "Avery Kim",
    role: "Project Lead",
    team: "Food Access",
    joined: "Jan 2026",
    status: "Active",
  },
  {
    id: "mock-member-10",
    name: "Quinn Davis",
    role: "Developer",
    team: "Food Access",
    joined: "Sep 2026",
    status: "Archived",
  },
  {
    id: "mock-member-11",
    name: "Cameron Ali",
    role: "Designer",
    team: "Volunteer Hub",
    joined: "May 2026",
    status: "Active",
  },
  {
    id: "mock-member-12",
    name: "Drew Martin",
    role: "Project Lead",
    team: "Volunteer Hub",
    joined: "Jan 2026",
    status: "Active",
  },
];

export const filterMockMembers = (filters?: MembersDashboardFilters) => {
  const search = filters?.search?.trim().toLowerCase() ?? "";
  return MOCK_MEMBERS.filter(
    (member) =>
      [member.name, member.role, member.team].some((value) =>
        value.toLowerCase().includes(search)
      ) &&
      (!filters?.roles?.length || filters.roles.includes(member.role)) &&
      (!filters?.teams?.length || filters.teams.includes(member.team)) &&
      (!filters?.statuses?.length || filters.statuses.includes(member.status))
  );
};
export const refetchMockMembers = async () => undefined;
