export type RequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "released"
  | "completed";
export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface Profile {
  id: string;
  full_name: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  gender: string;
  birthday: string;
  civil_status: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentRequest {
  id: string;
  user_id: string;
  document_type: string;
  request_details: Record<string, any>;
  request_status: RequestStatus;
  payment_status: PaymentStatus;
  released_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestAttachment {
  id: string;
  request_id: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  label: string | null;
  attachment_type: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}
