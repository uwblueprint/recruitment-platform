import { useState } from "react";
import LibraryAddOutlined from "@mui/icons-material/LibraryAddOutlined";
import useTeamsDashboard from "@/APIClients/queries/useTeamsDashboard";
import { Button } from "@/components/common/Button";
import { TeamRow } from "./TeamRow";
import type { SelectedFilters } from "@/components/dashboard/filters";
import { ManagementDashboardToolbar } from "./ManagementDashboardToolbar";
import type { ManagementTeam, TeamStatus } from "@/types/teamsDashboard";

export const TeamsDashboard = ({
  status,
  onNewProject,
  onAddMembers,
}: {
  status: TeamStatus;
  onNewProject?: () => void;
  onAddMembers?: (team: ManagementTeam) => void;
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedFilters>({});
  const {
    data: teams,
    filterOptions,
    loading,
    error,
    refetch,
  } = useTeamsDashboard(status, {
    search,
    teams: selected.team,
  });
  const categories = [{ key: "team", label: "Team", options: filterOptions }];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <ManagementDashboardToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search teams or members",
        }}
        filters={{
          categories,
          selected,
          onChange: (key, values) =>
            setSelected((previous) => ({ ...previous, [key]: values })),
          onRemove: (key, value) =>
            setSelected((previous) => ({
              ...previous,
              [key]: (previous[key] ?? []).filter((item) => item !== value),
            })),
        }}
        action={
          status === "Active" ? (
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={onNewProject}
              className="flex items-center gap-2 !px-5"
            >
              <LibraryAddOutlined fontSize="small" />
              New project
            </Button>
          ) : undefined
        }
      />
      {error ? (
        <div role="alert" className="text-sm text-alert-errorText">
          Failed to load teams.
          <button
            type="button"
            className="ml-3 underline"
            onClick={() => {
              void refetch().catch(() => {});
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div
          className="min-h-0 flex-1 space-y-3 overflow-y-auto"
          aria-busy={loading}
        >
          {loading ? (
            <p role="status">Loading teams…</p>
          ) : teams.length === 0 ? (
            <p className="py-8 text-center font-source text-sm text-neutral-500">
              No {status === "Active" ? "active teams" : "archived teams"}{" "}
              found.
            </p>
          ) : (
            teams.map((team) => (
              <TeamRow key={team.id} team={team} onAddMembers={onAddMembers} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
