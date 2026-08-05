import ReviewPageAPIClient from "@/APIClients/ReviewPageAPIClient";
import { Button } from "@/components/common/Button";
import { Dialogue } from "@/components/common/Dialogue";
import type { UsersByPositionResult } from "@/graphql/typeUtils";
import { theme } from "@/styles/Theme";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";

type ReassignReviewerDialogueProps = {
  open: boolean;
  applicantRecordId: string;
  position: string;
  conflict?: boolean;
  currentReviewerId: string;
  currentReviewerName: string;
  onClose: () => void;
  onUpdated: () => void;
};

type ReviewerUser = NonNullable<UsersByPositionResult[number]>;

const getUserLabel = (user: ReviewerUser) =>
  `${user.firstName} ${user.lastName}`;

export const ReassignReviewerDialogue = ({
  open,
  applicantRecordId,
  position,
  conflict = false,
  currentReviewerId,
  currentReviewerName,
  onClose,
  onUpdated,
}: ReassignReviewerDialogueProps) => {
  const [users, setUsers] = useState<ReviewerUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ReviewerUser | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      if (!isMounted) {
        return;
      }

      setIsLoadingUsers(true);
      setErrorText(null);

      try {
        const result = await ReviewPageAPIClient.getUsersByPosition(position);

        if (!isMounted) {
          return;
        }

        const eligibleUsers = result
          .filter((user): user is ReviewerUser => user !== null)
          .filter((user) => !user.isArchived && user.id !== currentReviewerId)
          .sort((left, right) =>
            getUserLabel(left)
              .toLowerCase()
              .localeCompare(getUserLabel(right).toLowerCase()),
          );

        setUsers(eligibleUsers);
      } catch {
        if (isMounted) {
          setErrorText("Failed to load reviewers. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingUsers(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, [currentReviewerId, position]);

  const handleUpdate = async () => {
    if (!selectedUser || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorText(null);

    try {
      await ReviewPageAPIClient.reassignReviewer(
        applicantRecordId,
        currentReviewerId,
        selectedUser.id,
      );
      onUpdated();
    } catch {
      setErrorText("Failed to update reviewer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialogue
      open={open}
      onClose={onClose}
      header="Edit the reviewer below"
      text={
        conflict
          ? `A conflict has been reported. Reassign ${currentReviewerName}.`
          : `Search a new reviewer below to replace ${currentReviewerName}.`
      }
      errorText={errorText ?? undefined}
      width="340px"
      className="!p-8 gap-4"
      content={
        <Autocomplete
          options={users}
          value={selectedUser}
          inputValue={inputValue}
          loading={isLoadingUsers}
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
            isLoadingUsers ? "Loading reviewers..." : "No reviewers found"
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
                placeholder="Search reviewers"
                className="w-full text-sm font-source h-8 px-2 border-0 outline-none focus:outline-none focus:ring-0"
              />
            </div>
          )}
        />
      }
    >
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
          onClick={() => {
            void handleUpdate();
          }}
          disabled={!selectedUser || isSubmitting}
          className="flex-1 min-w-0 !m-0 flex items-center justify-center whitespace-nowrap px-8 py-[13px] disabled:!bg-neutral-200 disabled:border-transparent"
        >
          <span className="font-poppins text-[16px] font-medium">
            {isSubmitting ? "Updating..." : "Update"}
          </span>
        </Button>
      </div>
    </Dialogue>
  );
};
