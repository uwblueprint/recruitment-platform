import { snakeCase } from "lodash";

import UserModel from "../../../models/user.model";
import UserService, { splitDisplayName } from "../userService";

import { UserDTO } from "../../../types";

import { testSql } from "../../../testUtils/testDb";

const testUsers = [
  {
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: "Admin",
    position: "Developer",
    isArchived: false,
  },
  {
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: "User",
    isArchived: true,
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("splitDisplayName", () => {
  it.each([
    [
      "John Doe",
      "fallback@example.com",
      { firstName: "John", lastName: "Doe" },
    ],
    ["John", "fallback@example.com", { firstName: "John", lastName: "" }],
    [
      "  John   Ronald   Reuel  ",
      "fallback@example.com",
      { firstName: "John", lastName: "Ronald Reuel" },
    ],
    [
      undefined,
      "fallback@example.com",
      { firstName: "fallback", lastName: "" },
    ],
    ["   ", "fallback@example.com", { firstName: "fallback", lastName: "" }],
  ])(
    "splits %p with fallback email %p",
    (displayName, fallbackEmail, expected) => {
      expect(splitDisplayName(displayName, fallbackEmail)).toEqual(expected);
    },
  );
});

describe("pg userService", () => {
  let userService: UserService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    userService = new UserService();
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("getUsers", async () => {
    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string | boolean | null> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value ?? null;
      });
      return userSnakeCase;
    });

    await UserModel.bulkCreate(users);

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
      expect(user.position).toEqual(testUsers[i].position);
      expect(user.isArchived).toEqual(testUsers[i].isArchived);
    });
  });
});
