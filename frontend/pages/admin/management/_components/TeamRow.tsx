import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";
import { Button } from "@/components/common/Button";
import { Avatar } from "@mui/material";
import { CollapsibleRow } from "@/components/common/CollapsibleRow";
import type { ManagementTeam, TeamMember } from "@/types/teamsDashboard";

type TeamRowProps = {
  team: ManagementTeam;
  onAddMembers?: (team: ManagementTeam) => void;
};

export const TeamRow = ({ team, onAddMembers }: TeamRowProps) => (
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
    <CollapsibleContent
      teamName={team.name}
      members={team.members}
      onAddMembers={onAddMembers ? () => onAddMembers(team) : undefined}
    />
  </CollapsibleRow>
);

type CollapsibleContentProps = {
  teamName: string;
  members: TeamMember[];
  onAddMembers?: () => void;
};

const CollapsibleContent = ({
  teamName,
  members,
  onAddMembers,
}: CollapsibleContentProps) =>
  members.length === 0 ? (
    <EmptyTeamContent onAddMembers={onAddMembers} />
  ) : (
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
            {["Name", "Role", "Joined", "Terms on the project"].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="h-14 px-6 font-semibold"
                >
                  {heading}
                </th>
              )
            )}
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

const EmptyTeamContent = ({ onAddMembers }: { onAddMembers?: () => void }) => (
  <div className="flex min-h-[160px] flex-col items-center justify-center gap-6 px-6 py-10">
    <p className="text-center font-poppins text-xl text-neutral-800">
      No members added yet
    </p>
    <Button
      type="button"
      variant="secondary"
      size="md"
      onClick={onAddMembers}
      className="flex items-center gap-2 !px-5"
    >
      <PersonAddAltOutlined fontSize="small" />
      Add Members
    </Button>
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
