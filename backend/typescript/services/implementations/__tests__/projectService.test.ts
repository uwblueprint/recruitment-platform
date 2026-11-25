import Project from "../../../models/project.model";
import { testSql } from "../../../testUtils/testDb";
import ProjectService from "../projectService";

const PROJECT_NAME = "Archive Service Team";

describe("projectService archiveProject", () => {
  const service = new ProjectService();

  beforeAll(async () => {
    await testSql.authenticate();
  });

  beforeEach(async () => {
    await Project.destroy({ where: { project_name: PROJECT_NAME } });
  });

  afterAll(async () => {
    await Project.destroy({ where: { project_name: PROJECT_NAME } });
    await testSql.close();
  });

  it("sets is_archived to true", async () => {
    const project = await Project.create({
      project_name: PROJECT_NAME,
      is_archived: false,
    });

    const archived = await service.archiveProject(project.id);

    expect(archived).toEqual({
      id: project.id,
      projectName: PROJECT_NAME,
      isArchived: true,
    });

    const stored = await Project.findByPk(project.id);
    expect(stored?.is_archived).toBe(true);
  });

  it("throws when the project does not exist", async () => {
    const missingId = "00000000-0000-0000-0000-000000000000";

    await expect(service.archiveProject(missingId)).rejects.toThrow(
      `Project id ${missingId} not found`,
    );
  });
});
