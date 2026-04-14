import { faker } from "@faker-js/faker";

/**
 * CredentialsGenerator — generates random credentials.
 * Equivalent to Java CredentialsGenerator using JavaFaker.
 */
export class CredentialsGenerator {
  static generateUsername(): string {
    return faker.internet.username();
  }

  static generatePassword(): string {
    return faker.internet.password();
  }

  static generateEmail(): string {
    return faker.internet.email();
  }

  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  static generateFirstName(): string {
    return faker.person.firstName();
  }

  static generateLastName(): string {
    return faker.person.lastName();
  }

  static generateCompanyName(): string {
    return faker.company.name();
  }

  static generateJobTitle(): string {
    return faker.person.jobTitle();
  }
}
