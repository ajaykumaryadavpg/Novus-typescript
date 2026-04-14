/**
 * Metadata interfaces for test documentation — equivalent to Java @Description, @MetaData, @Outcome annotations.
 */

export interface TestMetaData {
  author?: string;
  testCaseId?: string;
  stories?: string[];
  bugs?: string[];
  category?: string;
}

export interface TestDescription {
  scenario: string;
}

export interface TestOutcome {
  outcome: string;
}

export interface ScenarioFileRef {
  file: string;
}

/**
 * Combined test info used for reporting.
 */
export interface NovusTestInfo {
  author?: string;
  scenario?: string;
  outcome?: string;
  testCaseId?: string;
  category?: string;
  stories?: string[];
  bugs?: string[];
  status?: "passed" | "failed" | "skipped";
  failureMessage?: string;
}
