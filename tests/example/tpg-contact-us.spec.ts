import { test, withTestMeta } from "../../src/ui/novus-gui-test-base";
import { Launch } from "../../src/ui/actions/launch";
import { Navigate } from "../macros/navigate";
import {
  fillFirstName,
  fillLastName,
  fillCompanyName,
  fillBizEmail,
  fillBizPhoneNumber,
  fillJobTitle,
  fillClientMessage,
} from "../impls/contact-page.impl";
import { urlService } from "../services/url.service";
import { on } from "../../src/core/utils/code-fillers";

/**
 * TpgContactUsTests — GUI test example.
 * Equivalent to Java TpgContactUsTests class.
 */
test.describe("3Pillar Global Contact Us Tests", () => {
  test("Client writing to us", async ({ actor }) => {
    withTestMeta({
      author: "Novus Team",
      scenario:
        "A prospective client fills out the contact form to inquire about services",
      outcome:
        "The contact form is filled out with all required information",
      testCaseId: "TC-001",
      category: "smoke",
    });

    await actor.attemptsTo(
      Launch.app(on(urlService.getAppUrl())),
      Navigate.to().contactPage(),
      fillFirstName("Test"),
      fillLastName("User"),
      fillCompanyName("Test Company"),
      fillBizEmail("test@testcompany.com"),
      fillBizPhoneNumber("1234567890"),
      fillJobTitle("QA Engineer"),
      fillClientMessage("Hello, I would like to learn more about your services.")
    );
  });
});
