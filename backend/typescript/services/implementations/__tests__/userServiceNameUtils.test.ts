import { splitDisplayName } from "../userService";

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
    "returns %p split with fallback %p",
    (displayName, fallbackEmail, expectedName) => {
      expect(splitDisplayName(displayName, fallbackEmail)).toEqual(
        expectedName,
      );
    },
  );
});
