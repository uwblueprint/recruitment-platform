import * as fs from "fs";
import * as path from "path";

import { FirebaseApplication } from "../../types";
import { parseFirebaseApplication } from "../applicantIngestUtils";

const baseApplication: FirebaseApplication = {
  academicOrCoop: "Academic",
  academicYear: "2A ",
  email: " jane@example.com ",
  firstChoiceRole: "Project Developer",
  firstName: "Jane",
  heardFrom: "Word of mouth",
  lastName: "Doe",
  locationPreference: "In-Person (Waterloo)",
  program: "Computer Science",
  pronouns: "",
  pronounsSpecified: "She/They",
  resumeUrl: "https://example.com/resume.pdf",
  roleSpecificQuestions: [
    {
      role: "Project Developer",
      questions: [
        { question: "Areas?", response: ["Frontend", "Backend"] },
        { question: "Problem?", response: "A hard one" },
      ],
    },
    {
      role: "Product Designer",
      questions: [{ question: "Portfolio?", response: "link" }],
    },
  ],
  secondChoiceRole: "Product Designer",
  shortAnswerQuestions: [{ question: "Cause?", response: "Education" }],
  term: "Fall 2023",
  timesApplied: "Once",
  timestamp: 1688586786267,
};

describe("parseFirebaseApplication", () => {
  it("maps applicant fields and normalizes values", () => {
    const { applicant } = parseFirebaseApplication(baseApplication);

    expect(applicant).toMatchObject({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      academic_year: "2A",
      pronouns: "She/They",
      times_applied: 2,
      term: "Fall 2023",
      short_answer_questions: [{ question: "Cause?", response: "Education" }],
    });
    expect(applicant.submitted_at).toEqual(new Date(1688586786267));
  });

  it("creates a record per choice with mapped positions and flattened answers", () => {
    const { applicantRecords } = parseFirebaseApplication(baseApplication);

    expect(applicantRecords).toHaveLength(2);
    expect(applicantRecords[0]).toMatchObject({
      position: "Developer",
      choice: 1,
      status: "APPLIED",
      role_specific_questions: [
        { question: "Areas?", response: "Frontend, Backend" },
        { question: "Problem?", response: "A hard one" },
      ],
    });
    expect(applicantRecords[1]).toMatchObject({
      position: "Designer",
      choice: 2,
    });
  });

  it("creates a single record when there is no second choice", () => {
    const { applicantRecords } = parseFirebaseApplication({
      ...baseApplication,
      secondChoiceRole: "",
    });
    expect(applicantRecords).toHaveLength(1);
  });

  it("throws when a chosen role has no role-specific questions", () => {
    expect(() =>
      parseFirebaseApplication({
        ...baseApplication,
        secondChoiceRole: "Project Lead",
      }),
    ).toThrow('"Project Lead"');
  });

  it("throws when the email is missing", () => {
    expect(() =>
      parseFirebaseApplication({ ...baseApplication, email: " " }),
    ).toThrow("no email");
  });

  it("parses every application in the sample export", () => {
    const applications: FirebaseApplication[] = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "..",
          "..",
          "seeders",
          "data",
          "applications.json",
        ),
        "utf8",
      ),
    );
    applications.forEach((application) => {
      expect(() => parseFirebaseApplication(application)).not.toThrow();
    });
  });
});
