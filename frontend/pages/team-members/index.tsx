import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { TeamRole } from "@/graphql/typeUtils";
import useTeamMembers from "@/APIClients/queries/useTeamMembers";
import useCreateTeamMember from "@/APIClients/mutations/useCreateTeamMember";

const TeamMembersPage = (): React.ReactElement => {
  const {
    data: teamMembers = [],
    loading,
    error,
  } = useTeamMembers();

  const {
    mutate: createTeamMember,
    loading: creating,
    error: createError,
  } = useCreateTeamMember();

  const addTeamMember = async () => {
    await createTeamMember({
      variables: {
        teamMember: {
          firstName: "Maggie",
          lastName: "Chen",
          teamRole: TeamRole.Pl,
        },
      },
    });
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team Members
      </Typography>

      {loading && <Typography>Loading team members...</Typography>}
      {error && (
        <Typography color="error">
          Failed to load team members: {error.message}
        </Typography>
      )}
      {createError && (
        <Typography color="error">
          Failed to create team member: {createError.message}
        </Typography>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Team Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.firstName}</TableCell>
              <TableCell>{member.lastName}</TableCell>
              <TableCell>{member.teamRole}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="outlined"
        color="primary"
        onClick={addTeamMember}
        disabled={loading || creating}
        sx={{ marginTop: 2 }}
      >
        {creating ? "Adding..." : "+ Add a Maggie"}
      </Button>
    </Container>
  );
};

export default TeamMembersPage;