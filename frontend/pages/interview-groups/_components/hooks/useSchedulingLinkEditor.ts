import { useState } from "react";
import useUpdateInterviewGroupSchedulingLink from "@/APIClients/useUpdateInterviewGroupSchedulingLink";
import type { InterviewGroupResult } from "@/graphql/typeUtils";

export default function useSchedulingLinkEditor(group?: InterviewGroupResult) {
  const update = useUpdateInterviewGroupSchedulingLink();
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const linkInput = linkDraft ?? group?.schedulingLink ?? "";

  const submitLink = () => {
    if (!group || !linkInput || update.loading) return;
    void update.mutate({
      variables: { id: group.id, schedulingLink: linkInput },
      onCompleted: (result) => {
        if (!result.updateInterviewGroupSchedulingLink) return;
        // The mutation updates the cached group; return to its saved values.
        setLinkDraft(null);
        setIsEditing(false);
      },
    });
  };

  return {
    linkInput,
    setLinkDraft,
    isEditing,
    startEditing: () => setIsEditing(true),
    isSubmitted: !!group?.schedulingLink,
    submitLink,
    isSaving: update.loading,
    saveError: update.error,
    canSave: !!group,
  };
}
