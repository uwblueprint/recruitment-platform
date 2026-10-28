import DepartmentService from "../../services/implementations/departmentService";
import IDepartmentService from "../../services/interfaces/IDepartmentService";
import { DepartmentDTO } from "../../types";

const departmentService: IDepartmentService = new DepartmentService();

const departmentResolvers = {
  Query: {
    departments: async (): Promise<DepartmentDTO[]> => {
      return departmentService.getDepartments();
    },
  },
};

export default departmentResolvers;
