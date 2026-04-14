import { Enter } from "../../src/ui/actions/enter";
import { Select } from "../../src/ui/actions/select";
import { ContactPage } from "../pages/contact.page";
import type { Performable } from "../../src/core/interfaces";

const FRAME = ContactPage.FORM_IFRAME;
const { LetsTalk } = ContactPage;

/**
 * ContactPageImpl — contact page action implementations.
 * Equivalent to Java ContactPageImpl class.
 * Form fields are inside an iframe, so we use inFrame().
 */
export function fillFirstName(value: string): Performable {
  return Enter.text(value).on(LetsTalk.FIRST_NAME).inFrame(FRAME);
}

export function fillLastName(value: string): Performable {
  return Enter.text(value).on(LetsTalk.LAST_NAME).inFrame(FRAME);
}

export function fillCompanyName(value: string): Performable {
  return Enter.text(value).on(LetsTalk.COMPANY_NAME).inFrame(FRAME);
}

export function fillBizEmail(value: string): Performable {
  return Enter.text(value).on(LetsTalk.BIZ_EMAIL).inFrame(FRAME);
}

export function fillBizPhoneNumber(value: string): Performable {
  return Enter.text(value).on(LetsTalk.BIZ_PHONE).inFrame(FRAME);
}

export function fillJobTitle(value: string): Performable {
  return Enter.text(value).on(LetsTalk.JOB_TITLE).inFrame(FRAME);
}

export function fillClientMessage(value: string): Performable {
  return Enter.text(value).on(LetsTalk.MESSAGE).inFrame(FRAME);
}

export function selectState(value: string): Performable {
  return Select.option(value).on(LetsTalk.LOCATION_DPDWN).inFrame(FRAME);
}
