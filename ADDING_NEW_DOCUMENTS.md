/**
 * QUICK START: Adding a New Document Form
 * 
 * Follow these simple steps to add a new document type to CommunitySync
 */

// ============================================
// STEP 1: Add Configuration to documentConfigs.ts
// ============================================

// In constants/documentConfigs.ts, add to the documentConfigs object:

export const documentConfigs: { [key: string]: DocumentConfig } = {
  // ... existing documents ...

  'Your New Document': {
    name: 'Your New Document',
    description: 'Description of what this document is for...',
    sections: [
      {
        title: "Applicant's Details",
        fields: [
          // Use common fields or create custom ones:
          ...COMMON_APPLICANT_FIELDS,
        ],
      },
      {
        title: 'Custom Section', // Your unique section
        fields: [
          {
            name: 'fieldName1',
            type: 'text',
            label: 'Custom Field',
            placeholder: 'Enter value',
            required: true,
            width: 'full',
          },
          {
            name: 'dropdownField',
            type: 'dropdown',
            label: 'Select Option',
            options: ['Option A', 'Option B', 'Option C'],
            required: true,
            width: 'half',
          },
          {
            name: 'numberField',
            type: 'number',
            label: 'Enter Number',
            placeholder: 'e.g., 100',
            width: 'half',
          },
        ],
      },
    ],
    uploadSections: [
      {
        type: 'single', // or 'dual' for multiple uploads
        title: 'Document Upload',
        description: 'Please upload a valid ID.',
      },
    ],
  },

  // ... more documents ...
};

// ============================================
// FIELD TYPES REFERENCE
// ============================================

/**
 * FIELD TYPE: 'text'
 * Use for: Names, addresses, emails, general text
 */
{
  name: 'firstName',
  type: 'text',
  label: 'First Name',
  placeholder: 'Enter First Name',
  required: true,
  width: 'half',
}

/**
 * FIELD TYPE: 'email'
 * Use for: Email addresses
 */
{
  name: 'email',
  type: 'email',
  label: 'Email Address',
  placeholder: 'your@email.com',
  width: 'full',
}

/**
 * FIELD TYPE: 'phone'
 * Use for: Phone numbers (numeric keyboard)
 */
{
  name: 'contactNumber',
  type: 'phone',
  label: 'Contact Number',
  placeholder: '09XX-XXX-XXXX',
  required: true,
  width: 'half',
}

/**
 * FIELD TYPE: 'number'
 * Use for: Age, quantities, amounts
 */
{
  name: 'age',
  type: 'number',
  label: 'Age',
  placeholder: '25',
  required: true,
  width: 'half',
}

/**
 * FIELD TYPE: 'date'
 * Use for: Birthdays, dates, anniversaries
 */
{
  name: 'birthday',
  type: 'date',
  label: 'Birthday',
  placeholder: 'MM/DD/YYYY',
  required: true,
  width: 'half',
}

/**
 * FIELD TYPE: 'dropdown'
 * Use for: Selections from predefined options
 */
{
  name: 'purpose',
  type: 'dropdown',
  label: 'Select Purpose',
  options: ['Option 1', 'Option 2', 'Option 3'],
  required: true,
  width: 'full',
}

/**
 * FIELD TYPE: 'checkbox'
 * Use for: Agreements, declarations
 */
{
  name: 'agreement',
  type: 'checkbox',
  label: 'I hereby declare that all information provided is true and accurate.',
  width: 'full',
}

/**
 * FIELD TYPE: 'textarea'
 * Use for: Long text, narratives, descriptions
 */
{
  name: 'incidentDescription',
  type: 'textarea',
  label: 'Describe What Happened',
  placeholder: 'Enter detailed description...',
  required: true,
  width: 'full',
}

// ============================================
// LAYOUT REFERENCE
// ============================================

/**
 * WIDTH OPTIONS:
 * - 'half': Takes up half the width (2 fields per row)
 * - 'full': Takes up full width (1 field per row)
 */

// Example layout:
[
  {
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    width: 'half', // Will be on left side
  },
  {
    name: 'middleName',
    type: 'text',
    label: 'Middle Name',
    width: 'half', // Will be on right side (same row)
  },
  {
    name: 'lastNam',
    type: 'text',
    label: 'Last Name',
    width: 'full', // Will take full width (new row)
  },
]

// ============================================
// COMMON FIELD PATTERNS
// ============================================

// Pattern 1: Name fields (First, Middle, Last)
const nameFields = [
  {
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter First Name',
    required: true,
    width: 'half',
  },
  {
    name: 'middleName',
    type: 'text',
    label: 'Middle Name',
    placeholder: 'Enter Middle Name',
    width: 'half',
  },
  {
    name: 'lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter Last Name',
    required: true,
    width: 'full',
  },
];

// Pattern 2: Demographics (Gender, Civil Status)
const demographicsFields = [
  {
    name: 'gender',
    type: 'dropdown',
    label: 'Gender',
    options: ['Male', 'Female', 'Other'],
    required: true,
    width: 'half',
  },
  {
    name: 'civilStatus',
    type: 'dropdown',
    label: 'Civil Status',
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true,
    width: 'half',
  },
];

// Pattern 3: Declaration Agreement
const declarationField = [
  {
    name: 'declaration',
    type: 'checkbox',
    label: 'I hereby declare that all information provided is true and accurate.',
    width: 'full',
  },
];

// ============================================
// UPLOAD SECTION TYPES
// ============================================

/**
 * TYPE: 'single'
 * For documents requiring one upload
 */
uploadSections: [
  {
    type: 'single',
    title: 'Document Upload',
    description: 'Please upload a valid ID.',
  }
]

/**
 * TYPE: 'dual'
 * For documents requiring multiple uploads
 */
uploadSections: [
  {
    type: 'dual',
    title: 'Document Upload',
    description: 'Please upload a valid ID and supporting documents.',
    documents: [
      { id: 'validId', label: 'Valid ID' },
      { id: 'supporting', label: 'Supporting Documents' },
    ],
  }
]

// ============================================
// COMPLETE EXAMPLE
// ============================================

/**
 * Example: Adding "Library Card Application"
 */
'Library Card Application': {
  name: 'Library Card Application',
  description: 'Apply for a library membership card to access library services.',
  sections: [
    {
      title: "Applicant's Details",
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter First Name',
          required: true,
          width: 'half',
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter Last Name',
          required: true,
          width: 'half',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your@email.com',
          required: true,
          width: 'full',
        },
        {
          name: 'contactNumber',
          type: 'phone',
          label: 'Contact Number',
          placeholder: '09XX-XXX-XXXX',
          required: true,
          width: 'half',
        },
      ],
    },
    {
      title: 'Library Preferences',
      fields: [
        {
          name: 'preferredGenre',
          type: 'dropdown',
          label: 'Preferred Genre',
          options: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Other'],
          width: 'full',
        },
        {
          name: 'visitFrequency',
          type: 'dropdown',
          label: 'Expected Visit Frequency',
          options: ['Weekly', 'Bi-weekly', 'Monthly', 'As Needed'],
          width: 'full',
        },
      ],
    },
  ],
  uploadSections: [
    {
      type: 'single',
      title: 'Document Upload',
      description: 'Please upload a valid ID for verification.',
    },
  ],
}

// ============================================
// THAT'S IT!
// ============================================
// The form will automatically be available in the app.
// Just pass the document name to the document-form screen and it will render!
