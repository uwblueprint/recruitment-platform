import { Op } from "sequelize";
import { sequelize } from "../../models";
import InterviewGroup from "../../models/interviewGroup.model";
import {
  CreateInterviewGroupDTO,
  InterviewGroupDTO,
  UpdateInterviewGroupDTO,
} from "../../types";
import { toInterviewGroupDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IInterviewGroupService from "../interfaces/IInterviewGroupService";

const Logger = logger(__filename);

class InterviewGroupService implements IInterviewGroupService {
  /* eslint-disable class-methods-use-this */
  async getInterviewGroupById(id: string): Promise<InterviewGroupDTO> {
    try {
      const interviewGroup = await InterviewGroup.findByPk(id);
      if (!interviewGroup) {
        throw new Error(`No interview group found for id: ${id}`);
      }
      return toInterviewGroupDTO(interviewGroup);
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch interview group. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createInterviewGroup(
    interviewGroup: CreateInterviewGroupDTO,
  ): Promise<InterviewGroupDTO> {
    try {
      const newInterviewGroup = await InterviewGroup.create({
        scheduling_link: interviewGroup.schedulingLink,
        status: interviewGroup.status,
      });
      return toInterviewGroupDTO(newInterviewGroup);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create interview group. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateInterviewGroup(
    id: string,
    interviewGroup: UpdateInterviewGroupDTO,
  ): Promise<InterviewGroupDTO> {
    try {
      const existing = await InterviewGroup.findByPk(id);
      if (!existing) {
        throw new Error(`No interview group found for id: ${id}`);
      }

      const updatedGroup = await existing.update({
        scheduling_link: interviewGroup.schedulingLink,
        status: interviewGroup.status,
      });
      return toInterviewGroupDTO(updatedGroup);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update interview group. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteInterviewGroupById(id: string): Promise<InterviewGroupDTO> {
    try {
      const interviewGroup = await InterviewGroup.findByPk(id);
      if (!interviewGroup) {
        throw new Error(`No interview group found for id: ${id}`);
      }
      await interviewGroup.destroy();
      return toInterviewGroupDTO(interviewGroup);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete interview group. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async bulkCreateInterviewGroups(
    groups: CreateInterviewGroupDTO[],
  ): Promise<InterviewGroupDTO[]> {
    const t = await sequelize.transaction();
    try {
      const createdGroups = await InterviewGroup.bulkCreate(
        groups.map((group) => ({
          scheduling_link: group.schedulingLink,
          status: group.status,
        })),
        {
          transaction: t,
        },
      );

      await t.commit();
      return createdGroups.map((group) => toInterviewGroupDTO(group));
    } catch (error: unknown) {
      Logger.error(
        `Failed to bulk create interview groups. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      await t.rollback();
      throw error;
    }
  }

  async bulkDeleteInterviewGroupsByIds(
    ids: string[],
  ): Promise<InterviewGroupDTO[]> {
    if (ids.length === 0) {
      return [];
    }

    const t = await sequelize.transaction();
    try {
      const foundGroups = await InterviewGroup.findAll({
        transaction: t,
        where: { id: { [Op.in]: ids } },
      });
      if (foundGroups.length !== ids.length) {
        throw new Error(
          "Not all interview groups were found, bulk delete failed",
        );
      }

      // Delete all interview groups
      await InterviewGroup.destroy({
        where: { id: { [Op.in]: foundGroups.map((group) => group.id) } },
        transaction: t,
      });

      await t.commit();
      return foundGroups.map((group) => toInterviewGroupDTO(group));
    } catch (error: unknown) {
      Logger.error(
        `Failed to bulk delete interview groups. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      await t.rollback();
      throw error;
    }
  }
}

export default InterviewGroupService;
