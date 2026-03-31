import { supabase } from "@/lib/supabase";

export const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
};