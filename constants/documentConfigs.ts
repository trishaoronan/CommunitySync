export interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  options?: string[]; // For dropdowns
  required?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  width?: "half" | "full";
}

export type FormFieldType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "dropdown"
  | "checkbox"
  | "textarea";

export interface DocumentConfig {
  name: string;
  description: string;
  sections: DocumentSection[];
  uploadSections: UploadSection[];
}

export interface DocumentSection {
  title: string;
  fields: FormFieldConfig[];
}

export interface UploadSection {
  type: "single" | "dual" | "multiple";
  title: string;
  description: string;
  documents?: {
    id: string;
    label: string;
  }[];
}

// ==========================================
// COMMON FIELDS (Reusable)
// ==========================================

const COMMON_APPLICANT_FIELDS: FormFieldConfig[] = [
  {
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "Enter First Name",
    required: true,
    width: "half",
  },
  {
    name: "middleName",
    type: "text",
    label: "Middle Name",
    placeholder: "Enter Middle Name",
    width: "half",
  },
  {
    name: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Enter Last Name",
    required: true,
    width: "full",
  },
  {
    name: "gender",
    type: "dropdown",
    label: "Gender",
    options: ["Male", "Female", "Other", "Prefer not to say"],
    required: true,
    width: "half",
  },
  {
    name: "civilStatus",
    type: "dropdown",
    label: "Civil Status",
    options: ["Single", "Married", "Widowed", "Legally Separated"],
    required: true,
    width: "half",
  },
  {
    name: "birthday",
    type: "date",
    label: "Birthday",
    placeholder: "MM/DD/YYYY",
    required: true,
    width: "half",
  },
  {
    name: "age",
    type: "number",
    label: "Age",
    placeholder: "Age",
    required: true,
    width: "half",
  },
  {
    name: "completeAddress",
    type: "text",
    label: "Complete Address",
    placeholder: "Enter address",
    required: true,
    width: "full",
  },
  {
    name: "contactNumber",
    type: "phone",
    label: "Contact number",
    placeholder: "09XX-XXX-XXXX",
    required: true,
    width: "half",
  },
];

// ==========================================
// DOCUMENT CONFIGURATIONS
// ==========================================

export const documentConfigs: { [key: string]: DocumentConfig } = {
  "Business Permit": {
    name: "Business Permit",
    description:
      "Request a permit for operating a business within the barangay.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Business Information",
        fields: [
          {
            name: "businessName",
            type: "text",
            label: "Business Name",
            placeholder: "Enter Business Name",
            required: true,
            width: "full",
          },
          {
            name: "businessType",
            type: "text",
            label: "Business Type",
            placeholder: "Enter Business Type",
            required: true,
            width: "half",
          },
          {
            name: "businessLocation",
            type: "text",
            label: "Business Location",
            placeholder: "Enter Location",
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "dual",
        title: "Document Upload",
        description:
          "Please upload a valid ID and proof of ownership (e.g., Lease Agreement)",
        documents: [
          { id: "validId", label: "Valid ID" },
          { id: "proofOwnership", label: "Proof of Ownership" },
        ],
      },
    ],
  },

  "Barangay Clearance": {
    name: "Barangay Clearance",
    description:
      "Request a general clearance certificate for various process such as employment, travel, or permits.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Purpose",
        fields: [
          {
            name: "purpose",
            type: "dropdown",
            label: "Specific Purpose for the Clearance",
            options: [
              "Employment",
              "Travel",
              "Permits",
              "Business",
              "Education",
              "Financial Assistance",
              "Medical Assistance",
              "Other",
            ],
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a valid ID.",
      },
    ],
  },

  "Certificate of Residency": {
    name: "Certificate of Residency",
    description:
      "Request a certification confirming your residency in the barangay for a specified period.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Residency Information",
        fields: [
          {
            name: "dateStartedResiding",
            type: "date",
            label: "Date Started Residing",
            placeholder: "MM/DD/YYYY",
            required: true,
            width: "half",
          },
          {
            name: "householdHeadName",
            type: "text",
            label: "Household Head Name",
            placeholder: "Enter Name",
            width: "half",
          },
          {
            name: "purpose",
            type: "dropdown",
            label: "Purpose",
            options: [
              "Identification",
              "Financial Assistance",
              "Educational",
              "Medical",
              "Government Requirements",
              "Other",
            ],
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
      },
    ],
  },

  "Certificate of Indigency": {
    name: "Certificate of Indigency",
    description:
      "Request certification confirming your low-income status for purposes such as financial aid or medical assistance.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Purpose and Financial details",
        fields: [
          {
            name: "purpose",
            type: "dropdown",
            label: "Select a purpose",
            options: [
              "Medical Assistance",
              "Financial Assistance",
              "Scholarship",
              "Government Aid",
              "Other",
            ],
            required: true,
            width: "full",
          },
          {
            name: "numberOfDependents",
            type: "number",
            label: "Number of Dependents",
            placeholder: "e.g., 3",
            width: "full",
          },
          {
            name: "indigencyAgreement",
            type: "checkbox",
            label:
              "I hereby attest and declare under oath that I am in a state of indigency, with no stable source of income, and my household's financial situation qualifies for assistance.",
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
      },
    ],
  },

  "Certificate of Good Moral Character": {
    name: "Certificate of Good Moral Character",
    description:
      "Request a certification attesting to your good moral character for purposes such as employment or immigration.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Purpose",
        fields: [
          {
            name: "purpose",
            type: "dropdown",
            label: "Select a purpose",
            options: [
              "Employment",
              "Travel",
              "Immigration",
              "Education",
              "Government Requirements",
              "Other",
            ],
            required: true,
            width: "full",
          },
          {
            name: "moralCharacterAgreement",
            type: "checkbox",
            label:
              "I hereby declare that I have maintained good moral character and have no criminal record or community issues.",
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
      },
    ],
  },

  "Certificate of Solo Parent": {
    name: "Certificate of Solo Parent",
    description:
      "Request a certification for solo parent status for benefits and assistance.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Solo Parent Details",
        fields: [
          {
            name: "numberOfChildren",
            type: "number",
            label: "Number of Children",
            placeholder: "e.g., 3",
            required: true,
            width: "half",
          },
          {
            name: "agesOfChildren",
            type: "text",
            label: "Ages of Children",
            placeholder: "e.g., 5, 8, 10",
            required: true,
            width: "half",
          },
          {
            name: "reasonForSoloParent",
            type: "dropdown",
            label: "Reason for Solo Parent Status",
            options: [
              "Death of Spouse",
              "Divorce",
              "Separation",
              "Abandonment",
              "Other",
            ],
            required: true,
            width: "full",
          },
          {
            name: "soloParentAgreement",
            type: "checkbox",
            label:
              "I hereby attest that I am a solo parent and the information provided is true and accurate to the best of my knowledge.",
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "dual",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
        documents: [
          { id: "validId", label: "Valid ID" },
          { id: "supportingDocs", label: "Supporting Documents" },
        ],
      },
    ],
  },

  "Certificate of No Derogatory Record": {
    name: "Certificate of No Derogatory Record",
    description:
      "Certification that the applicant has no adverse records, criminal cases, or unsettled disputes filed in the Barangay.",
    sections: [
      {
        title: "Applicant's Details",
        fields: [
          ...COMMON_APPLICANT_FIELDS.filter((f) => f.name !== "contactNumber"),
          {
            name: "placeOfBirth",
            type: "text",
            label: "Place of Birth",
            placeholder: "City/Province",
            width: "half",
          },
          {
            name: "contactNumber",
            type: "phone",
            label: "Contact number",
            placeholder: "09XX-XXX-XXXX",
            required: true,
            width: "half",
          },
        ],
      },
      {
        title: "Purpose",
        fields: [
          {
            name: "purpose",
            type: "dropdown",
            label: "Select a purpose",
            options: [
              "Employment",
              "Travel",
              "Immigration",
              "Education",
              "Government Requirements",
              "Business",
              "Other",
            ],
            required: true,
            width: "full",
          },
          {
            name: "noDerogRecordAgreement",
            type: "checkbox",
            label:
              "I hereby declare that I have NO PENDING CASE, COMPLAINT, OR DEROGATORY RECORD filed against me in this Barangay or before the Lupong Tagapamayapa.",
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
      },
    ],
  },

  "Blotter/Incident Report": {
    name: "Blotter/Incident Report",
    description: "Report an incident, complaint, or dispute that occurred.",
    sections: [
      {
        title: "Complainant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Incident Details",
        fields: [
          {
            name: "incidentType",
            type: "dropdown",
            label: "Type of Incident",
            options: [
              "Theft",
              "Assault",
              "Property Damage",
              "Dispute",
              "Noise Complaint",
              "Trespassing",
              "Other",
            ],
            required: true,
            width: "half",
          },
          {
            name: "incidentDate",
            type: "date",
            label: "Date of Incident",
            placeholder: "MM/DD/YYYY",
            required: true,
            width: "half",
          },
          {
            name: "incidentLocation",
            type: "text",
            label: "Exact Location of Incident",
            placeholder: "Enter Location",
            required: true,
            width: "full",
          },
          {
            name: "incidentDescription",
            type: "textarea",
            label: "Detailed Narrative",
            placeholder: "Describe what happened...",
            required: true,
            width: "full",
          },
        ],
      },
      {
        title: "Respondent Details",
        fields: [
          {
            name: "respondentNames",
            type: "text",
            label: "Name(s) of Respondent(s)",
            placeholder: "Enter names",
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Evidence Upload",
        description: "Please upload at least 1-3 photos, videos, or documents.",
      },
    ],
  },

  "Barangay ID": {
    name: "Barangay ID",
    description:
      "Please fill out the form accurately to process your official Barangay Identification Card.",
    sections: [
      {
        title: "Applicant's Details",
        fields: [
          ...COMMON_APPLICANT_FIELDS.filter((f) => f.name !== "contactNumber"),
          {
            name: "emailAddress",
            type: "email",
            label: "Email Address",
            placeholder: "your@email.com",
            width: "half",
          },
          {
            name: "contactNumber",
            type: "phone",
            label: "Contact number",
            placeholder: "09XX-XXX-XXXX",
            required: true,
            width: "half",
          },
          {
            name: "placeOfBirth",
            type: "text",
            label: "Place of Birth (City/Province)",
            placeholder: "Enter place",
            width: "half",
          },
          {
            name: "citizenship",
            type: "text",
            label: "Citizenship",
            placeholder: "Enter citizenship",
            width: "half",
          },
          {
            name: "yearsInBarangay",
            type: "text",
            label: "How long have you lived in this Barangay?",
            placeholder: "e.g., 5 years",
            width: "full",
          },
        ],
      },
      {
        title: "Emergency Contact Information",
        fields: [
          {
            name: "emergencyContactPerson",
            type: "text",
            label: "Emergency Contact Person",
            placeholder: "Enter name",
            width: "half",
          },
          {
            name: "emergencyContactNumber",
            type: "phone",
            label: "Contact Person's Number",
            placeholder: "09XX-XXX-XXXX",
            width: "half",
          },
          {
            name: "relationship",
            type: "dropdown",
            label: "Relationship",
            options: [
              "Spouse",
              "Child",
              "Parent",
              "Sibling",
              "Relative",
              "Friend",
              "Other",
            ],
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "dual",
        title: "Document Upload",
        description:
          "Please upload a valid ID and proof of ownership (e.g., Lease Agreement)",
        documents: [
          { id: "validId", label: "Valid ID" },
          { id: "2x2Picture", label: "2x2 ID Picture" },
        ],
      },
    ],
  },

  "Certificate of Low Income": {
    name: "Certificate of Low Income",
    description:
      "Request a certificate verifying your low-income status for social programs or financial assistance.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Income & Household Details",
        fields: [
          {
            name: "occupationSource",
            type: "text",
            label: "Occupation/Source of income",
            placeholder: "Enter occupation",
            required: true,
            width: "full",
          },
          {
            name: "monthlyIncome",
            type: "number",
            label: "Estimated month income",
            placeholder: "Enter amount",
            width: "half",
          },
          {
            name: "householdMembers",
            type: "number",
            label: "Total Household members",
            placeholder: "Enter number",
            width: "half",
          },
          {
            name: "purpose",
            type: "dropdown",
            label: "Purpose of Certificate",
            options: [
              "Social Programs",
              "Financial Assistance",
              "Scholarship",
              "Medical Assistance",
              "Government Benefits",
              "Other",
            ],
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "dual",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
        documents: [
          { id: "validId", label: "Valid ID" },
          { id: "proofResidency", label: "Proof of Residency" },
        ],
      },
    ],
  },

  "Certificate of Non-Employment": {
    name: "Certificate of Non-Employment",
    description:
      "Request a certification proving that the applicant is not gainfully employed within the Barangay.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Purpose and Financial details",
        fields: [
          {
            name: "purpose",
            type: "dropdown",
            label: "Select a purpose",
            options: [
              "Financial Assistance",
              "Scholarship",
              "Government Aid",
              "Social Programs",
              "Business License",
              "Other",
            ],
            required: true,
            width: "full",
          },
          {
            name: "unemploymentAgreement",
            type: "checkbox",
            label:
              "I hereby attest and declare under oath that I am CURRENTLY UNEMPLOYED and have no stable source of income or gainful employment at the time of this application.",
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
      },
    ],
  },

  "Burial Assistance Application": {
    name: "Burial Assistance Application",
    description:
      "Financial assistance for funeral and burial expenses for indigent constituents.",
    sections: [
      {
        title: "Applicant's Details",
        fields: [
          ...COMMON_APPLICANT_FIELDS.filter((f) => f.name !== "contactNumber"),
          {
            name: "contactNumber",
            type: "phone",
            label: "Contact number",
            placeholder: "09XX-XXX-XXXX",
            required: true,
            width: "half",
          },
          {
            name: "relationshipToDeceased",
            type: "dropdown",
            label: "Relationship to Deceased",
            options: [
              "Spouse",
              "Child",
              "Parent",
              "Sibling",
              "Relative",
              "Other",
            ],
            required: true,
            width: "half",
          },
          {
            name: "estimatedMonthlyIncome",
            type: "number",
            label: "Claimant Monthly Income (Estimate)",
            placeholder: "Enter amount",
            width: "half",
          },
        ],
      },
      {
        title: "Deceased Person's Details",
        fields: [
          {
            name: "deceasedLastName",
            type: "text",
            label: "Last Name",
            placeholder: "Enter Last Name",
            required: true,
            width: "half",
          },
          {
            name: "deceasedFirstName",
            type: "text",
            label: "First Name",
            placeholder: "Enter First Name",
            required: true,
            width: "half",
          },
          {
            name: "deceasedMiddleName",
            type: "text",
            label: "Middle Name",
            placeholder: "Enter Middle Name",
            width: "full",
          },
          {
            name: "causeOfDeath",
            type: "dropdown",
            label: "Stated Cause of Death",
            options: ["Natural Causes", "Accident", "Illness", "Other"],
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description:
          "Please upload a valid ID of claimant, Death Certificate, proof of Kinship (Birth Certificate or Marriage Certificate) and Certificate of Indigency.",
      },
    ],
  },

  "Other Barangay Documents": {
    name: "Other Barangay Documents",
    description:
      "Submit other types of requests or endorsements to your barangay. Please fill out the form completely.",
    sections: [
      {
        title: "Applicant's Details",
        fields: COMMON_APPLICANT_FIELDS,
      },
      {
        title: "Request details",
        fields: [
          {
            name: "documentType",
            type: "dropdown",
            label: "Please Specify the Document",
            options: [
              "Endorsement",
              "Referral",
              "Certification",
              "Letter of Recommendation",
              "Other Document",
            ],
            required: true,
            width: "full",
          },
          {
            name: "purposeOfRequest",
            type: "textarea",
            label: "Purpose of request",
            placeholder: "State the reason or purpose of your request",
            required: true,
            width: "full",
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: "single",
        title: "Document Upload",
        description: "Please upload a one valid government ID.",
      },
    ],
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const getDocumentConfig = (
  documentName: string,
): DocumentConfig | null => {
  return documentConfigs[documentName] || null;
};

export const getAllDocumentNames = (): string[] => {
  return Object.keys(documentConfigs);
};

export const getDocumentDescription = (documentName: string): string => {
  const config = getDocumentConfig(documentName);
  return config?.description || "Request a document from the barangay.";
};
