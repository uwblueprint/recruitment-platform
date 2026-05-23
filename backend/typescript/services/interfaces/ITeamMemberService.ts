import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";

interface ITeamMemberService {
  /**
   * Get list of all team members in db
   * @returns Array of TeamMemberDTO
   * @throws Error if team members retrieval fails
   */
  getTeamMembers(): Promise<TeamMemberDTO[]>;

  /**
   * Create a new team member
   * @param meember
   * @returns a TeamMemberDTO of the new team member created
   * @throws Error if team member creation fails
   */
  createTeamMember(teamMember: CreateTeamMemberDTO): Promise<TeamMemberDTO>;
}

export default ITeamMemberService;
