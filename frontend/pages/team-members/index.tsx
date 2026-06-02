import React, { useEffect, useState } from "react";
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
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { TeamMemberDTO, TeamRole } from "@/graphql/typeUtils";
import TeamMemberAPIClient from "@/APIClients/TeamMemberAPIClient";

const TeamMembersPage = (): React.ReactElement => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);
  const authenticatedUser = useAuthenticatedUser();

  const getTeamMembers = async () => {
    const res = await TeamMemberAPIClient.getTeamMembers();
    setTeamMembers(res);
  };

  const addTeamMember = async () => {
    await TeamMemberAPIClient.createTeamMember({
      firstName: "Maggie",
      lastName: "Chen",
      teamRole: TeamRole.Pl,
    });
    await getTeamMembers();
  };

  useEffect(() => {
    if (authenticatedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      getTeamMembers();
    }
  }, [authenticatedUser]);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team Members
      </Typography>
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
        sx={{ marginTop: 2 }}
      >
        + Add a Maggie
      </Button>
    </Container>
  );
};

export default TeamMembersPage;
