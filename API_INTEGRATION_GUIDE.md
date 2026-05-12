# Form Data Structure & Integration Guide

## Form Submission Data

When a user clicks "Proceed", the form data is sent to the payment screen with the following structure:

```typescript
{
  documentName: string;           // e.g., "Business Permit"
  formData: Record<string, any>;  // Dynamic fields based on document config
  modeOfRelease: string;          // "Pickup at the Barangay Hall" | "Download"
}
```

## Example: Business Permit Submission Data

```json
{
  "documentName": "Business Permit",
  "formData": {
    "firstName": "Juan",
    "middleName": "de la",
    "lastName": "Cruz",
    "gender": "Male",
    "civilStatus": "Married",
    "birthday": "05/15/1985",
    "age": "38",
    "completeAddress": "123 Main Street, Barangay San Luis",
    "contactNumber": "09171234567",
    "businessName": "Cruz's Restaurant",
    "businessType": "Food Service",
    "businessLocation": "456 Commercial Ave, Barangay San Luis"
  },
  "modeOfRelease": "Pickup at the Barangay Hall",
  "uploadedFiles": {
    "validId": {
      "name": "juan_cruz_id.jpg",
      "uri": "file:///storage/emulated/0/Documents/juan_cruz_id.jpg"
    },
    "proofOwnership": {
      "name": "lease_agreement.pdf",
      "uri": "file:///storage/emulated/0/Documents/lease_agreement.pdf"
    }
  }
}
```

## Example: Barangay Clearance Submission Data

```json
{
  "documentName": "Barangay Clearance",
  "formData": {
    "firstName": "Maria",
    "middleName": "Santos",
    "lastName": "Garcia",
    "gender": "Female",
    "civilStatus": "Single",
    "birthday": "08/22/1992",
    "age": "31",
    "completeAddress": "789 Oak Lane, Barangay San Luis",
    "contactNumber": "09281234567",
    "purpose": "Employment"
  },
  "modeOfRelease": "Download",
  "uploadedFiles": {
    "validId": {
      "name": "maria_garcia_national_id.jpg",
      "uri": "file:///storage/emulated/0/Pictures/maria_garcia_national_id.jpg"
    }
  }
}
```

## Example: Certificate of Solo Parent Submission Data

```json
{
  "documentName": "Certificate of Solo Parent",
  "formData": {
    "firstName": "Rosa",
    "middleName": "Villanueva",
    "lastName": "Reyes",
    "gender": "Female",
    "civilStatus": "Separated",
    "birthday": "03/10/1988",
    "age": "35",
    "completeAddress": "321 Pine Street, Barangay San Luis",
    "contactNumber": "09091234567",
    "numberOfChildren": "2",
    "agesOfChildren": "8, 12",
    "reasonForSoloParent": "Abandonment",
    "soloParentAgreement": true
  },
  "modeOfRelease": "Pickup at the Barangay Hall",
  "uploadedFiles": {
    "validId": {
      "name": "rosa_reyes_driver_license.jpg",
      "uri": "file:///storage/emulated/0/Documents/rosa_reyes_driver_license.jpg"
    },
    "supportingDocs": {
      "name": "birth_certificate_scan.pdf",
      "uri": "file:///storage/emulated/0/Documents/birth_certificate_scan.pdf"
    }
  }
}
```

## Field Type Mapping

When processing form data, note the field types for validation:

| Type | Format | Example | Validation |
|------|--------|---------|-----------|
| `text` | String | "Juan de la Cruz" | No restriction |
| `email` | String | "user@example.com" | Must contain @ |
| `phone` | String | "09171234567" | 10-11 digits |
| `number` | String (numeric) | "38" | Numbers only |
| `date` | String | "05/15/1985" | MM/DD/YYYY format |
| `dropdown` | String | "Male" | From options array |
| `checkbox` | Boolean | true/false | true or false |
| `textarea` | String | "Long text..." | No restriction |

## Uploaded Files Structure

Each uploaded file follows this structure:

```typescript
{
  [fileId]: {
    name: string;  // Original filename
    uri: string;   // File system URI
  }
}
```

**File IDs used:**
- `validId` - Valid Government ID
- `proofOwnership` - Proof of Ownership (Business Permit)
- `proofResidency` - Proof of Residency
- `2x2Picture` - 2x2 ID Picture (Barangay ID)
- `supportingDocs` - Supporting Documents
- etc.

## Processing Checklist for Backend

When receiving form submission:

1. **Validate Document Name**
   - Check against allowed document types
   - Verify document is in system

2. **Validate Form Data**
   - Check required fields are present and non-empty
   - Validate data types match field types
   - Validate formats (date, phone, email)

3. **Validate Uploaded Files**
   - At least one file uploaded
   - File size within limits (suggest: < 10MB)
   - File type is image or PDF

4. **Validate Mode of Release**
   - Must be "Pickup at the Barangay Hall" or "Download"

5. **Process Payment**
   - Create transaction record
   - Generate reference number
   - Send confirmation email

6. **Store Data**
   - Save form data to database
   - Link uploaded files to submission
   - Create processing record

## Payment Integration

After form validation, payment flow:

```
Document Form
     ↓
Form Validation ✓
     ↓
Payment Screen (receives formData)
     ↓
Payment Processing
     ↓
Success/Failure Screen
     ↓
Database Storage
     ↓
Email Notification
```

**Data passed to Payment:**
```typescript
{
  documentName: string;
  formData: string;  // JSON stringified
  modeOfRelease: string;
}
```

## Database Schema Suggestion

```sql
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY,
  document_name VARCHAR(255) NOT NULL,
  applicant_first_name VARCHAR(100),
  applicant_last_name VARCHAR(100),
  contact_number VARCHAR(20),
  form_data JSONB NOT NULL,
  mode_of_release VARCHAR(50),
  status VARCHAR(50), -- 'pending', 'processing', 'completed', 'rejected'
  reference_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (reference_number) REFERENCES transactions(reference_number)
);

CREATE TABLE form_submissions_files (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL,
  file_key VARCHAR(100), -- 'validId', 'proofOwnership', etc.
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  file_size BIGINT,
  uploaded_at TIMESTAMP,
  
  FOREIGN KEY (submission_id) REFERENCES form_submissions(id)
);
```

## API Endpoint Suggestion

**POST** `/api/documents/submit`

**Request Body:**
```typescript
{
  documentName: string;
  formData: Record<string, any>;
  modeOfRelease: string;
  uploadedFiles?: {
    [fileId]: {
      name: string;
      uri: string;
      base64?: string;  // Optional: if sending base64 encoded
    }
  }
}
```

**Success Response (200):**
```typescript
{
  success: true;
  referenceNumber: string;
  message: string;
  data: {
    submissionId: string;
    status: 'pending';
    estimatedProcessingTime: string;
  }
}
```

**Error Response (400/500):**
```typescript
{
  success: false;
  error: string;
  details: string[];
}
```

## File Upload Best Practices

1. **Size Limits**
   - Single file: < 10MB
   - Total upload: < 50MB

2. **Allowed Formats**
   - Images: jpg, jpeg, png, gif
   - Documents: pdf

3. **Naming Convention**
   - Store with: `submissions/{submissionId}/{fileKey}_{timestamp}.{ext}`
   - Example: `submissions/abc123/validId_1684756234.jpg`

4. **Security**
   - Scan files for malware
   - Validate file headers (magic numbers)
   - Restrict direct access to uploaded files

## Example Backend Processing (Node.js/Express)

```typescript
// POST /api/documents/submit
app.post('/api/documents/submit', async (req, res) => {
  const { documentName, formData, modeOfRelease } = req.body;
  
  // 1. Validate document name
  const validDocuments = getAllDocumentNames();
  if (!validDocuments.includes(documentName)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid document type'
    });
  }
  
  // 2. Validate required fields
  const config = getDocumentConfig(documentName);
  const errors = validateFormData(formData, config);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  // 3. Process uploaded files
  const uploadedFiles = await processUploadedFiles(req.files);
  
  // 4. Create submission record
  const referenceNumber = generateReferenceNumber();
  const submission = await createSubmission({
    documentName,
    formData,
    modeOfRelease,
    referenceNumber,
    uploadedFiles
  });
  
  // 5. Send confirmation email
  await sendConfirmationEmail(formData.email, referenceNumber);
  
  // 6. Return success
  res.json({
    success: true,
    referenceNumber,
    message: 'Document submitted successfully',
    data: {
      submissionId: submission.id,
      status: 'pending',
      estimatedProcessingTime: '3-5 business days'
    }
  });
});
```

## Reference Number Format

Suggested format: `DOC{CODE}{DATE}{SEQUENCE}`

Example: `DOCBP20240512001`
- `DOC` - Document prefix
- `BP` - Business Permit code
- `20240512` - YYYYMMDD
- `001` - Sequential number

## Testing Checklist

- [ ] Submit form with all required fields
- [ ] Submit with empty optional fields
- [ ] Submit with invalid email format
- [ ] Submit with invalid phone format
- [ ] Submit without uploaded files
- [ ] Submit with oversized files
- [ ] Verify data is stored correctly
- [ ] Verify emails are sent
- [ ] Verify reference numbers are unique
- [ ] Test with each document type
