import { Avatar } from "@mui/material";
import { CollapsibleRow } from "@/components/common/CollapsibleRow";
import type { ManagementTeam, TeamMember } from "@/types/teamsDashboard";

type TeamRowProps = { team: ManagementTeam };

export const TeamRow = ({ team }: TeamRowProps) => (
  <CollapsibleRow
    title={{ text: team.name }}
    subtitles={[
      {
        text: `${team.members.length} ${
          team.members.length === 1 ? "member" : "members"
        }`,
      },
    ]}
    toggleLabel={`Toggle ${team.name} members`}
  >
    <CollapsibleContent teamName={team.name} members={team.members} />
  </CollapsibleRow>
);

type CollapsibleContentProps = {
  teamName: string;
  members: TeamMember[];
};

const CollapsibleContent = ({ teamName, members }: CollapsibleContentProps) => (
  <div className="overflow-x-auto">
    <table
      aria-label={`${teamName} members`}
      className="w-full min-w-[720px] table-fixed border-collapse text-left font-source text-sm text-neutral-800"
    >
      <colgroup>
        <col className="w-[26%]" />
        <col className="w-[26%]" />
        <col className="w-[26%]" />
        <col className="w-[22%]" />
      </colgroup>
      <thead className="bg-sky-200">
        <tr>
          {["Name", "Role", "Joined", "Terms on the project"].map((heading) => (
            <th key={heading} scope="col" className="h-14 px-6 font-semibold">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <TeamMemberRow key={member.id} member={member} />
        ))}
      </tbody>
    </table>
  </div>
);

const TeamMemberRow = ({ member }: { member: TeamMember }) => (
  <tr className="h-14 odd:bg-neutral-50 even:bg-white">
    <td className="px-6 py-2">
      <span className="flex items-center gap-3">
        <Avatar
          src={member.avatarUrl}
          alt={member.name}
          sx={{ width: 40, height: 40, fontSize: 14 }}
        >
          {member.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </Avatar>
        <span className="underline underline-offset-4">{member.name}</span>
      </span>
    </td>
    <td className="px-6 py-2">{member.role}</td>
    <td className="px-6 py-2">{member.joined}</td>
    <td className="px-6 py-2">{member.termsOnProject}</td>
  </tr>
);
