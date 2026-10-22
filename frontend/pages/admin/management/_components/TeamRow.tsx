import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlined from "@mui/icons-material/UnarchiveOutlined";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";
import { Button } from "@/components/common/Button";
import { Avatar } from "@mui/material";
import { CollapsibleRow } from "@/components/common/CollapsibleRow";
import type { ManagementTeam, TeamMember } from "@/types/teamsDashboard";

type TeamRowProps = {
  team: ManagementTeam;
  onAddMembers?: (team: ManagementTeam) => void;
  onArchiveTeam?: (team: ManagementTeam) => void;
  onUnarchiveTeam?: (team: ManagementTeam) => void;
};

export const TeamRow = ({
  team,
  onAddMembers,
  onArchiveTeam,
  onUnarchiveTeam,
}: TeamRowProps) => (
  <CollapsibleRow
    title={{ text: team.name }}
    subtitles={[
      {
        text: `${team.members.length} ${
          team.members.length === 1 ? "member" : "members"
        }`,
      },
    ]}
    expandedActions={
      <TeamActions
        team={team}
        onAddMembers={onAddMembers}
        onArchiveTeam={onArchiveTeam}
        onUnarchiveTeam={onUnarchiveTeam}
      />
    }
    toggleLabel={`Toggle ${team.name} members`}
  >
    <CollapsibleContent teamName={team.name} members={team.members} />
  </CollapsibleRow>
);

type CollapsibleContentProps = {
  teamName: string;
  members: TeamMember[];
};

const CollapsibleContent = ({ teamName, members }: CollapsibleContentProps) =>
  members.length === 0 ? (
    <EmptyTeamContent />
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

const TeamActions = ({
  team,
  onAddMembers,
  onArchiveTeam,
  onUnarchiveTeam,
}: TeamRowProps) => (
  <>
    {team.status === "Active" ? (
      <>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onAddMembers?.(team)}
          className="flex items-center gap-2 !px-5"
        >
          <PersonAddAltOutlined fontSize="small" />
          Add Team Member
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onArchiveTeam?.(team)}
          className="flex items-center gap-2 !px-5"
        >
          <ArchiveOutlined fontSize="small" />
          Archive Team
        </Button>
      </>
    ) : (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onUnarchiveTeam?.(team)}
        className="flex items-center gap-2 !px-5"
      >
        <UnarchiveOutlined fontSize="small" />
        Unarchive Team
      </Button>
    )}
  </>
);

const EmptyTeamContent = () => (
  <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-10">
    <p className="text-center font-poppins text-xl text-neutral-800">
      No members added yet
    </p>
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
