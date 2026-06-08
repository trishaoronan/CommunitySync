import { supabase } from "@/lib/supabase";
import type { DocumentRequest } from "@/types/database";
import { useCallback, useEffect, useState } from "react";

export const useDocumentRequests = () => {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error("Requests Fetch Error — no session:", sessionError);
      setError("Unable to load requests. Please try again.");
      setRequests([]);
      setIsLoading(false);
      return;
    }

    const { data, error: requestError } = await supabase
      .from("document_requests")
      .select("*")
      .eq("user_id", sessionData.session.user.id)
      .order("created_at", { ascending: false });

    if (requestError) {
      console.error("Requests Fetch Error:", requestError);
      setError("Unable to load requests. Please try again.");
      setRequests([]);
    } else {
      setRequests(data ?? []);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  return { requests, isLoading, error, reload: loadRequests };
};
