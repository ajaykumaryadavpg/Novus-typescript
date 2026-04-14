import { Enter } from "../../src/ui/actions/enter";
import { Select } from "../../src/ui/actions/select";
import { Perform } from "../../src/ui/actions/perform";
import { ContactPage } from "../pages/contact.page";
import type { Performable } from "../../src/core/interfaces";

const FRAME = ContactPage.FORM_IFRAME;
const { LetsTalk } = ContactPage;

/**
 * ContactPageImpl — contact page action implementations.
 * Equivalent to Java ContactPageImpl class.
 * Each function returns a Performable wrapped in Perform.actions().log() — matching Java exactly.
 */
export function fillFirstName(fName: string): Performable {
  return Perform.actions(
    Enter.text(fName).on(LetsTalk.FIRST_NAME).inFrame(FRAME)
  ).log("fillFirstName", "fills the first name of the client");
}

export function fillLastName(lName: string): Performable {
  return Perform.actions(
    Enter.text(lName).on(LetsTalk.LAST_NAME).inFrame(FRAME)
  ).log("fillLastName", "fills the last name of the client");
}

export function fillCompanyName(cName: string): Performable {
  return Perform.actions(
    Enter.text(cName).on(LetsTalk.COMPANY_NAME).inFrame(FRAME)
  ).log("fillCompanyName", "fills the company name of the client");
}

export function fillBizEmail(bizEmail: string): Performable {
  return Perform.actions(
    Enter.text(bizEmail).on(LetsTalk.BIZ_EMAIL).inFrame(FRAME)
  ).log("fillBizEmail", "fills the biz email of the client");
}

export function fillBizPhoneNumber(phNumber: string): Performable {
  return Perform.actions(
    Enter.text(phNumber).on(LetsTalk.BIZ_PHONE).inFrame(FRAME)
  ).log("fillBizPhoneNumber", "fills the biz phone number of the client");
}

export function fillJobTitle(jobTitle: string): Performable {
  return Perform.actions(
    Enter.text(jobTitle).on(LetsTalk.JOB_TITLE).inFrame(FRAME)
  ).log("fillJobTitle", "fills the job title of the client");
}

export function fillClientMessage(message: string): Performable {
  return Perform.actions(
    Enter.text(message).on(LetsTalk.MESSAGE).inFrame(FRAME)
  ).log("fillClientMessage", "fills the client's message");
}

export function selectState(state: string): Performable {
  return Perform.actions(
    Select.option(state).on(LetsTalk.LOCATION_DPDWN).inFrame(FRAME)
  ).log("selectState", "fills the client's state");
}
