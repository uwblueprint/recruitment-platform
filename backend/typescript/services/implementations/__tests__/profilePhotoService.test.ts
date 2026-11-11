import ProfilePhotoService from "../profilePhotoService";

const mockRequest = jest.fn();

jest.mock("google-auth-library", () => ({
  JWT: jest.fn().mockImplementation(() => ({ request: mockRequest })),
}));

const PHOTO_URL = "https://lh3.googleusercontent.com/a/photo=s100";

const directoryResponse = (
  email: string,
  url = PHOTO_URL,
  isDefault = false,
) => ({
  data: {
    people: [
      {
        emailAddresses: [{ value: email }],
        photos: [{ url, default: isDefault }],
      },
    ],
  },
});

describe("ProfilePhotoService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GOOGLE_DIRECTORY_CLIENT_EMAIL: "sa@project.iam.gserviceaccount.com",
      GOOGLE_DIRECTORY_PRIVATE_KEY: "line1\\nline2",
      GOOGLE_DIRECTORY_IMPERSONATE_EMAIL: "admin@uwblueprint.org",
    };
    mockRequest.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns the directory photo for a Blueprint email", async () => {
    mockRequest.mockResolvedValue(directoryResponse("jane@uwblueprint.org"));
    const service = new ProfilePhotoService();

    await expect(service.getPhotoUrl("Jane@UWBlueprint.org")).resolves.toBe(
      PHOTO_URL,
    );
  });

  it("treats a photo with no default flag as a custom photo", async () => {
    // Google omits `default` entirely for user-provided photos
    mockRequest.mockResolvedValue({
      data: {
        people: [
          {
            emailAddresses: [
              { value: "jane@uwblueprint.org" },
              { value: "jane@uwaterloo.ca" },
            ],
            photos: [{ url: PHOTO_URL }],
          },
        ],
      },
    });
    const service = new ProfilePhotoService();

    await expect(service.getPhotoUrl("jane@uwblueprint.org")).resolves.toBe(
      PHOTO_URL,
    );
  });

  it("returns null without calling Google for non-Blueprint emails", async () => {
    const service = new ProfilePhotoService();

    await expect(service.getPhotoUrl("jane@gmail.com")).resolves.toBeNull();
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it("ignores prefix matches on other addresses", async () => {
    mockRequest.mockResolvedValue(
      directoryResponse("jane.doe@uwblueprint.org"),
    );
    const service = new ProfilePhotoService();

    await expect(
      service.getPhotoUrl("jane@uwblueprint.org"),
    ).resolves.toBeNull();
  });

  it("ignores the generated default photo", async () => {
    mockRequest.mockResolvedValue(
      directoryResponse("jane@uwblueprint.org", PHOTO_URL, true),
    );
    const service = new ProfilePhotoService();

    await expect(
      service.getPhotoUrl("jane@uwblueprint.org"),
    ).resolves.toBeNull();
  });

  it("returns null when the directory lookup fails", async () => {
    mockRequest.mockRejectedValue(new Error("403 forbidden"));
    const service = new ProfilePhotoService();

    await expect(
      service.getPhotoUrl("jane@uwblueprint.org"),
    ).resolves.toBeNull();
  });

  it("caches results and dedupes concurrent lookups", async () => {
    mockRequest.mockResolvedValue(directoryResponse("jane@uwblueprint.org"));
    const service = new ProfilePhotoService();

    await Promise.all([
      service.getPhotoUrl("jane@uwblueprint.org"),
      service.getPhotoUrl("jane@uwblueprint.org"),
    ]);
    await service.getPhotoUrl("jane@uwblueprint.org");

    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it("returns null when credentials are not configured", async () => {
    delete process.env.GOOGLE_DIRECTORY_PRIVATE_KEY;
    const service = new ProfilePhotoService();

    await expect(
      service.getPhotoUrl("jane@uwblueprint.org"),
    ).resolves.toBeNull();
    expect(mockRequest).not.toHaveBeenCalled();
  });
});
