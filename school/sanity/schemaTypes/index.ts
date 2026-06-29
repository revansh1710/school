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

import careerPage from './careerPage/careerPage'
import { careerHero } from "./careerPage/hero";
import { careerOverview } from "./careerPage/overview";
import { careerEligibilityItem } from "./careerPage/eligibility";
import { careerProcessStep } from "./careerPage/processStep";
import { careerDocumentItem } from "./careerPage/documentItem";
import { careerCTA } from "./careerPage/careerCTA";
import careerEnquiry from './careerPage/careerEnquiry'
import { jobPosting } from './careerPage/jobPosting'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    about, 
    academics, 
    gallery, 
    contact, 
    admission, 
    admissionsHero,
    admissionsOverview,
    eligibilityItem,
    processStep,
    documentItem,
    admissionsCTA,
    admissionEnquiry,
    careerPage,
    careerHero,
    careerOverview,
    careerEligibilityItem,
    careerProcessStep,
    careerDocumentItem,
    careerCTA,
    careerEnquiry,
    jobPosting
  ],
}
