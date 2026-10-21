import { DashboardStatusChip } from "@/components/dashboard/common";
import { DashboardSidePanel } from "@/components/dashboard/side-panel/DashboardSidePanel";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Button } from "@/components/common/Button";
import type {
  Member,
  MemberEditableField,
  MemberUpdates,
  MembersDashboardFilterOptions,
} from "@/types/membersDashboard";
import useMembersDashboardFilterOptions from "@/APIClients/queries/useMembersDashboardFilterOptions";
import useMembersDashboardSidePanel from "../hooks/useMembersDashboardSidePanel";

const MEMBER_FIELDS = [
  { field: "role", label: "Role", optionsKey: "roles" },
  { field: "team", label: "Team", optionsKey: "teams" },
  { field: "status", label: "Status", optionsKey: "statuses" },
] as const satisfies readonly {
  field: MemberEditableField;
  label: string;
  optionsKey: keyof MembersDashboardFilterOptions;
}[];

type DeleteMemberButtonProps = {
  onClick: () => void;
};

const DeleteMemberButton = ({ onClick }: DeleteMemberButtonProps) => (
  <Button
    type="button"
    variant="secondary"
    size="sm"
    className="flex items-center gap-2"
    onClick={onClick}
  >
    <DeleteOutline sx={{ fontSize: 19 }} />
    Delete Member
  </Button>
);

type Props = {
  memberId?: string;
  onClose: () => void;
  onDelete: (member: Member) => void;
  // Connect the member update mutation through this callback.
  onUpdate?: (id: string, changes: MemberUpdates) => void;
};

export const MembersDashboardSidePanel = ({
  memberId,
  onClose,
  onDelete,
  onUpdate,
}: Props) => {
  const { details, isLoading, error } = useMembersDashboardSidePanel(memberId);
  const { data: options } = useMembersDashboardFilterOptions();

  return (
    <DashboardSidePanel
      open={memberId !== undefined}
      onClose={onClose}
      width={446}
      title={details?.name}
      description={details ? `Joined ${details.joined}` : undefined}
      action={
        details ? (
          <DeleteMemberButton onClick={() => onDelete(details)} />
        ) : null
      }
    >
      <>
        {isLoading ? (
          <p role="status">Loading member details…</p>
        ) : error ? (
          <p role="alert" className="text-alert-errorText">
            Failed to load member details.
          </p>
        ) : details ? (
          <>
            <div className="flex flex-wrap gap-4 border-b border-neutral-200 pb-6">
              {MEMBER_FIELDS.map(({ field, label, optionsKey }) => {
                const currentValue = details[field];
                const choices = options?.[optionsKey] ?? [];
                // Keep the current value visible while options load or omit it.
                const fieldOptions = choices.some(
                  ({ value }) => value === currentValue
                )
                  ? choices
                  : [{ value: currentValue, label: currentValue }, ...choices];
                return (
                  <label
                    key={field}
                    className="flex flex-col gap-1 text-neutral-500"
                  >
                    <span>{label}</span>
                    <DashboardStatusChip
                      outlined
                      value={details[field]}
                      options={fieldOptions.map((option) => ({
                        ...option,
                        className:
                          field === "status" && option.value === "Active"
                            ? "border-green-900 bg-green-50 text-green-900"
                            : "border-neutral-700 bg-neutral-100 text-neutral-700",
                      }))}
                      onChange={(value) =>
                        onUpdate?.(details.id, { [field]: value })
                      }
                    />
                  </label>
                );
              })}
            </div>
            <section className="pt-6" aria-labelledby="member-past-teams">
              <h3
                id="member-past-teams"
                className="mb-4 font-source text-base font-normal leading-[1.4] text-black"
              >
                Past Teams
              </h3>
              {details.pastTeams.length ? (
                <ol className="flex min-w-0 flex-col">
                  {details.pastTeams.map(({ team, role, term }, index) => (
                    <li
                      key={`${team}-${term}`}
                      className="relative flex flex-col gap-1 pb-4 pl-[34px] last:pb-0"
                    >
                      {index < details.pastTeams.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-2 top-3 h-full w-px bg-neutral-200"
                        />
                      ) : null}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1 h-[18px] w-[18px] rounded-full bg-blue"
                      />
                      <p className="font-semibold">{team}</p>
                      <p className="flex flex-wrap items-center">
                        <span>{role}</span>
                        <span aria-hidden="true" className="w-6 text-center">
                          •
                        </span>
                        <span>{term}</span>
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-neutral-500">No past teams.</p>
              )}
            </section>
          </>
        ) : null}
      </>
    </DashboardSidePanel>
  );
};
