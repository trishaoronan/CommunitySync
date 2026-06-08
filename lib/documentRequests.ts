import { supabase } from "@/lib/supabase";
import type { DocumentRequest } from "@/types/database";

const ATTACHMENT_BUCKET = "request-attachments";
const DEFAULT_ATTACHMENT_FOLDER = "document-requests";

type CreateDocumentRequestInput = {
  documentType: string;
  requestDetails: Record<string, any>;
  userId?: string;
};

type UploadRequestAttachmentInput = {
  fileUri: string;
  fileName?: string;
  userId?: string;
  folder?: string;
};

type UploadRequestAttachmentResult = {
  publicUrl: string | null;
  filePath: string | null;
  userId: string | null;
  error: Error | null;
};

const getAuthenticatedUserId = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      userId: null,
      error: userError ?? new Error("No authenticated user."),
    };
  }

  return { userId: userData.user.id, error: null };
};

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

const buildAttachmentPath = (
  userId: string,
  fileName: string,
  folder: string,
) => {
  const safeFileName = sanitizeFileName(fileName) || "attachment";
  return `${folder}/${userId}/${Date.now()}-${safeFileName}`;
};

export const uploadRequestAttachment = async ({
  fileUri,
  fileName,
  userId,
  folder = DEFAULT_ATTACHMENT_FOLDER,
}: UploadRequestAttachmentInput): Promise<UploadRequestAttachmentResult> => {
  if (!fileUri) {
    return {
      publicUrl: null,
      filePath: null,
      userId: null,
      error: new Error("No file selected for upload."),
    };
  }

  const resolvedUserId = userId ?? (await getAuthenticatedUserId()).userId;

  if (!resolvedUserId) {
    return {
      publicUrl: null,
      filePath: null,
      userId: null,
      error: new Error("No authenticated user."),
    };
  }

  const fallbackName = fileUri.split("/").pop() || "attachment";
  const resolvedFileName = fileName || fallbackName;
  const filePath = buildAttachmentPath(
    resolvedUserId,
    resolvedFileName,
    folder,
  );

  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: resolvedFileName || "upload.jpg",
    type: "image/jpeg",
  } as any);

  const { error: uploadError } = await supabase.storage
    .from(ATTACHMENT_BUCKET)
    .upload(filePath, formData, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      publicUrl: null,
      filePath,
      userId: resolvedUserId,
      error: uploadError,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from(ATTACHMENT_BUCKET)
    .getPublicUrl(filePath);
  const publicUrl = publicUrlData?.publicUrl ?? null;

  if (!publicUrl) {
    return {
      publicUrl: null,
      filePath,
      userId: resolvedUserId,
      error: new Error("Unable to generate public URL."),
    };
  }

  return {
    publicUrl,
    filePath,
    userId: resolvedUserId,
    error: null,
  };
};

export const createDocumentRequest = async ({
  documentType,
  requestDetails,
  userId,
}: CreateDocumentRequestInput) => {
  const resolvedUserId = userId ?? (await getAuthenticatedUserId()).userId;

  if (!resolvedUserId) {
    return {
      data: null,
      error: new Error("No authenticated user."),
    };
  }

  const { data, error } = await supabase
    .from("document_requests")
    .insert({
      user_id: resolvedUserId,
      document_type: documentType,
      request_details: requestDetails,
      request_status: "pending",
      payment_status: "unpaid",
    })
    .select("*")
    .single();

  return { data: (data ?? null) as DocumentRequest | null, error };
};

export const fetchUserDocumentRequests = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      data: null,
      error: userError ?? new Error("No authenticated user."),
    };
  }

  const { data, error } = await supabase
    .from("document_requests")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data: (data ?? []) as DocumentRequest[], error };
};

export const formatDocumentType = (value: string) => {
  const cleaned = value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned) return "Document Request";

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatDisplayDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDisplayTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatRequestStatus = (status?: string | null) => {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatPaymentStatus = (status?: string | null) => {
  if (!status) return "Unpaid";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const normalizePaymentStatus = (status?: string | null) => {
  switch (status) {
    case "paid":
      return "completed";
    case "pending":
      return "pending";
    case "unpaid":
    case "failed":
    case "refunded":
    default:
      return "unpaid";
  }
};

export const buildReferenceNumber = (id: string) =>
  `REQ-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
