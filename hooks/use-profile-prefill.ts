import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";
import { useEffect, useState } from "react";

type PrefillValues = Record<string, string>;

type ProfileSnapshot = Pick<
  Profile,
  | "first_name"
  | "middle_name"
  | "last_name"
  | "address"
  | "birthday"
  | "civil_status"
>;

const buildFullName = (profile: ProfileSnapshot) =>
  [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(" ");

const formatDateForInput = (value: string | null | undefined) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${month}/${day}/${year}`;
};

export const useProfilePrefill = (baseValues: PrefillValues) => {
  const [initialValues, setInitialValues] = useState<PrefillValues>({
    ...baseValues,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (!isMounted) return;

      if (userError || !userData.user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "first_name, middle_name, last_name, address, birthday, civil_status",
        )
        .eq("id", userData.user.id)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        setIsLoading(false);
        return;
      }

      const profile = data as ProfileSnapshot;
      const nextValues: PrefillValues = { ...baseValues };

      if ("fullName" in nextValues) {
        nextValues.fullName = buildFullName(profile);
      }
      if ("completeAddress" in nextValues) {
        nextValues.completeAddress = profile.address ?? "";
      }
      if ("dateOfBirth" in nextValues) {
        nextValues.dateOfBirth = formatDateForInput(profile.birthday);
      }
      if ("birthday" in nextValues) {
        nextValues.birthday = formatDateForInput(profile.birthday);
      }
      if ("civilStatus" in nextValues) {
        nextValues.civilStatus = profile.civil_status ?? "";
      }

      setInitialValues(nextValues);
      setIsLoading(false);
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [baseValues]);

  return { initialValues, isLoading };
};
