export const admissionConfig={
    pre_primary:["birthCertificate"],
    primary:["birthCertificate","previousMarksheet"],
    middle:["birthCertificate","previousMarksheet"],
    secondary:["birthCertificate","transferCertificate", "previousMarksheet"]
}

export type GradeCategory = keyof typeof admissionConfig

export function mapGradeToCategory(grade?: string | null): GradeCategory {
    if (!grade) return "primary"

    const g = grade.toLowerCase().trim()

    const prePrimaryGrades = ["nursery", "lkg", "ukg", "pre", "pre-primary"]

    if (prePrimaryGrades.some(p => g.includes(p))) {
        return "pre_primary"
    }

    const match = g.match(/\d+/)
    const num = match ? parseInt(match[0]) : null

    if (num === null) return "primary"

    if (num <= 5) return "primary"
    if (num <= 8) return "middle"
    return "secondary"
}

export function isGradeCategory(category?: string | null): category is GradeCategory {
    return !!category && category in admissionConfig
}

export function getRequiredDocumentsForEnquiry(enquiry: {
    grade?: string | null
    gradeCategory?: string | null
    requiredDocuments?: string[] | null
}) {
    const category = isGradeCategory(enquiry.gradeCategory)
        ? enquiry.gradeCategory
        : mapGradeToCategory(enquiry.grade)

    return admissionConfig[category] || enquiry.requiredDocuments || []
}
