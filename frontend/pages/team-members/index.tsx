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
import { TeamMemberDto, TeamRole } from "@/graphql/__generated__/types";
import TeamMemberAPIClient from "@/APIClients/TeamMemberAPIClient";

const TeamMembersPage = (): React.ReactElement => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberDto[]>([]);

  const getTeamMembers = async () => {
    const res = await TeamMemberAPIClient.getTeamMembers();
    setTeamMembers(res);
  };

  const addTeamMember = async () => {
    await TeamMemberAPIClient.createTeamMember({
      firstName: "Jocelyn",
      lastName: "Xu",
      teamRole: TeamRole.Developer,
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
        + Add a Jocelyn
      </Button>
    </Container>
  );
};

export default TeamMembersPage;
