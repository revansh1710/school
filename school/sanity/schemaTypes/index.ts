import { type SchemaTypeDefinition } from 'sanity'
import about from './about';
import academics from './academics'
import gallery from './gallery'
import contact from './contact'
import admission from './admissionPage/admissionPage'
import { admissionsHero } from "./admissionPage/hero";
import { admissionsOverview } from "./admissionPage/overview";
import { eligibilityItem } from "./admissionPage/eligibility";
import { processStep } from "./admissionPage/processStep";
import { documentItem } from "./admissionPage/documentItem";
import { admissionsCTA } from "./admissionPage/admissionCTA";
import admissionEnquiry from './admissionPage/admissionEnquiry'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [about, academics, gallery, contact, admission, admissionsHero,
admissionsOverview,
    eligibilityItem,
    processStep,
    documentItem,
    admissionsCTA,admissionEnquiry],
}
