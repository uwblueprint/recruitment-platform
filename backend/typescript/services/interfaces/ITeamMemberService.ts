import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";

interface ITeamMemberService {
  /**
   * Get team members
   * @param none
   * @returns array of the TeamMemberDTO
   * @throws error if team member retrieval fails
   */
  getTeamMembers(): Promise<TeamMemberDTO[]>;

  /**
   * creates a team member
   * @param teamMember the team member to be created
   * @returns a TeamMemberDTO with the created team member's information
   * @throws error if team member retrieval fails
   */
  createTeamMember(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}

export default ITeamMemberService;
