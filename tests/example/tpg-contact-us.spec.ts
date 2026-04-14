import { test, withTestMeta, step } from "../../src/ui/novus-gui-test-base";
import { Launch } from "../../src/ui/actions/launch";
import { Verify } from "../../src/ui/verification/verify";
import { Navigate } from "../macros/navigate";
import {
  fillFirstName,
  fillLastName,
  fillCompanyName,
  fillBizEmail,
  fillBizPhoneNumber,
  fillJobTitle,
  fillClientMessage,
  selectState,
} from "../impls/contact-page.impl";
import { urlService } from "../services/url.service";
import { on } from "../../src/core/utils/code-fillers";
import { HomePage } from "../pages/home.page";

/**
 * TpgContactUsTests — GUI test example.
 * Equivalent to Java TpgContactUsTests class.
 */
test.describe("3Pillar Global Contact Us Tests", () => {
  test("testClientWritingToUs", async ({ actor }) => {
    withTestMeta({
      author: "Sidhant Satapathy",
      scenario: "Test Lets Talk functionality on the Contact Page",
      outcome: "Verify that the clients can write to us with all the details successfully",
      testCaseId: "1",
      category: "TPG_CONTACT_US",
      stories: ["JIRA-1234", "JIRA-1245"],
    });

    step("Client launches 3pillar website");
    await actor.attemptsTo(Launch.app(on(urlService.getAppUrl())));

    // hard assertion — equivalent to Java: client.wantsTo(Verify.uiElement(CONTACT_LINK).describedAs("...").isVisible())
    await actor.wantsTo(
      Verify.uiElement(HomePage.CONTACT_LINK).describedAs("contact link is displayed").isVisible()
    );

    step('Client goes to the "Contact" page on the 3pillar website');
    await actor.attemptsTo(
      Navigate.to().contactPage(),
      fillFirstName("Test"),
      fillLastName("User"),
      fillCompanyName("Test Company"),
      fillBizEmail("client@abc.com"),
      fillBizPhoneNumber("1234567890"),
      fillJobTitle("job title"),
      selectState("Alabama"),
      fillClientMessage(
        "Hi I am testing the Lets Talk Section, Hope you got my email"
      )
    );
  });
});
