/**
 * Metadata interfaces for test documentation — equivalent to Java @Description, @MetaData, @Outcome annotations.
 */

/**
 * Equivalent to Java @MetaData annotation.
 */
export interface TestMetaData {
  author: string;
  testCaseId: string;
  category: string;
  stories?: string[];
  bugs?: string[];
}

/**
 * Equivalent to Java @Description annotation.
 */
export interface TestDescription {
  value: string;
}

/**
 * Equivalent to Java @Outcome annotation.
 */
export interface TestOutcome {
  value: string;
}

/**
 * Equivalent to Java @ScenarioFile annotation.
 */
export interface ScenarioFileRef {
  value: string;
}

/**
 * NovusTestMeta — test metadata DTO.
 * Equivalent to Java NovusTestMeta class.
 */
export interface NovusTestMeta {
  author?: string;
  scenario?: string;
  outcome?: string;
}

/**
 * NovusTest — test result DTO.
 * Equivalent to Java NovusTest class.
 */
export interface NovusTest {
  author?: string;
  scenario?: string;
  outcome?: string;
  status?: "passed" | "failed" | "skipped";
  testCaseId?: string;
  category?: string;
  failureMessage?: string;
  potentialBug?: boolean;
  bugs?: string;
}

/**
 * Combined test info used for reporting — merges @MetaData + @Description + @Outcome.
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
  potentialBug?: boolean;
  scenarioFile?: string;
}
