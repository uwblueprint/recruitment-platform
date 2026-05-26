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
import { TeamMemberDTO, TeamRole } from "@/graphql/typeUtils";
import TeamMemberAPIClient from "@/APIClients/TeamMemberAPIClient";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const TeamMembersPage: NextPageWithLayout = (): React.ReactElement => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberDTO[]>([]);

  const getTeamMembers = async () => {
    const res = await TeamMemberAPIClient.getTeamMembers();
    setTeamMembers(res);
  };

  const addTeamMember = async () => {
    await TeamMemberAPIClient.createTeamMember({
      firstName: "Owen",
      lastName: "Chen",
      teamRole: TeamRole.Pl,
    });
    await getTeamMembers();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getTeamMembers();
  }, []);

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
        + Add an Owen
      </Button>
    </Container>
  );
};

TeamMembersPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>{page}</ProtectedRoute>
);

export default TeamMembersPage;
