import useReassignInterviewerMutation from "@/APIClients/mutations/useReassignInterviewer";
import useUsersByPosition from "@/APIClients/queries/useUsersByPosition";
import { Button } from "@/components/common/Button";
import { Dialogue } from "@/components/common/Dialogue";
import {
  InterviewDashboardSidePanelDocument,
  type UsersByPositionResult,
} from "@/graphql/typeUtils";
import { theme } from "@/styles/Theme";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";

type ReassignInterviewerDialogueProps = {
  open: boolean;
  applicantRecordId: string;
  position: string;
  currentInterviewerId: string;
  currentInterviewerName: string;
  assignedInterviewerIds: string[];
  acknowledgesNoResponse?: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

type InterviewerUser = NonNullable<UsersByPositionResult[number]>;

const getUserLabel = (user: InterviewerUser) =>
  `${user.firstName} ${user.lastName}`;

export const ReassignInterviewerDialogue = ({
  open,
  applicantRecordId,
  position,
  currentInterviewerId,
  currentInterviewerName,
  assignedInterviewerIds,
  acknowledgesNoResponse = false,
  onClose,
  onUpdated,
}: ReassignInterviewerDialogueProps) => {
  const usersQuery = useUsersByPosition(position);
  const {
    mutate,
    loading: isSubmitting,
    error: updateError,
  } = useReassignInterviewerMutation();
  const users =
    !usersQuery.loading && !usersQuery.error && usersQuery.data
      ? usersQuery.data
          .filter((user): user is InterviewerUser => user !== null)
          .filter(
            (user) =>
              !user.isArchived && !assignedInterviewerIds.includes(user.id),
          )
          .sort((left, right) =>
            getUserLabel(left)
              .toLowerCase()
              .localeCompare(getUserLabel(right).toLowerCase()),
          )
      : [];
  const [selectedUser, setSelectedUser] = useState<InterviewerUser | null>(
    null,
  );
  const [inputValue, setInputValue] = useState("");
  const handleUpdate = () => {
    if (!selectedUser || isSubmitting) {
      return;
    }
    if (
      !usersQuery.data?.some(
        (user) =>
          user &&
          !user.isArchived &&
          user.id === selectedUser.id &&
          !assignedInterviewerIds.includes(user.id),
      )
    ) {
      return;
    }

    void mutate({
      variables: {
        applicantRecordId,
        oldInterviewerId: currentInterviewerId,
        newInterviewerId: selectedUser.id,
      },
      refetchQueries: [InterviewDashboardSidePanelDocument],
      awaitRefetchQueries: true,
      onCompleted: (result) => {
        if (result.reassignInterviewer) onUpdated();
      },
    });
  };

  return (
    <Dialogue
      open={open}
      onClose={onClose}
      header="Edit the interviewer below"
      text={
        acknowledgesNoResponse
          ? `${currentInterviewerName} has not responded to any messages. Search a new interviewer to replace ${currentInterviewerName}.`
          : `Search a new interviewer to replace ${currentInterviewerName}.`
      }
      errorText={
        updateError
          ? "Failed to update interviewer. Please try again."
          : usersQuery.error
            ? "Failed to load interviewers. Please try again."
            : undefined
      }
      width="340px"
      className="!p-8 gap-4"
      actionsClassName="!mt-2 !h-auto"
    >
      <div className="flex w-full flex-col gap-[52px]">
        <Autocomplete
          options={users}
          value={selectedUser}
          inputValue={inputValue}
          loading={usersQuery.loading}
          ListboxProps={{
            style: {
              maxHeight: 96,
              overflowY: "auto",
              padding: 0,
            },
          }}
          onChange={(_, value) => {
            setSelectedUser(value);
            setInputValue(value ? getUserLabel(value) : "");
          }}
          onInputChange={(_, value, reason) => {
            if (reason === "clear" || reason === "input") {
              setSelectedUser(null);
            }
            setInputValue(value);
          }}
          getOptionLabel={(option) => getUserLabel(option)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText={
            usersQuery.loading
              ? "Loading interviewers..."
              : `No interviewers found for ${position} role`
          }
          slotProps={{
            paper: {
              sx: {
                "& .MuiAutocomplete-noOptions": {
                  padding: "6px 12px",
                  fontSize: "14px",
                  fontFamily: "var(--font-source)",
                },
                "& .MuiAutocomplete-option:hover": {
                  backgroundColor: `${theme.colors.S10} !important`,
                },
                "& .MuiAutocomplete-option.Mui-focused": {
                  backgroundColor: `${theme.colors.S10} !important`,
                },
                "& .MuiAutocomplete-option[aria-selected='true']": {
                  backgroundColor: `${theme.colors.S10} !important`,
                },
              },
            },
          }}
          renderOption={(props, option) => (
            <li
              {...props}
              key={option.id}
              style={{
                ...props.style,
                height: 32,
                paddingTop: 6,
                paddingBottom: 6,
              }}
              className={`${props.className ?? ""} !flex !items-center !px-3`}
            >
              <span className="font-source text-[14px] leading-5 text-neutral-900">
                {getUserLabel(option)}
              </span>
            </li>
          )}
          renderInput={(params) => (
            <div
              ref={params.InputProps.ref}
              className="flex items-center rounded-[4px] border border-neutral-200 overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]"
            >
              <SearchOutlinedIcon className="pl-1" />
              <input
                {...params.inputProps}
                placeholder="Search interviewers"
                className="w-full text-sm font-source h-8 px-2 border-0 outline-none focus:outline-none focus:ring-0"
              />
            </div>
          )}
        />
        <div className="flex w-full gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 min-w-0 !m-0 flex items-center justify-center whitespace-nowrap px-8 py-[13px]"
          >
            <span className="font-poppins text-[16px] font-medium">Cancel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleUpdate}
            disabled={!selectedUser || isSubmitting}
            className="flex-1 min-w-0 !m-0 flex items-center justify-center whitespace-nowrap px-8 py-[13px] disabled:!bg-neutral-200 disabled:border-transparent"
          >
            <span className="font-poppins text-[16px] font-medium">
              {isSubmitting ? "Updating..." : "Update"}
            </span>
          </Button>
        </div>
      </div>
    </Dialogue>
  );
};
