import { supabaseStorage } from '../../supabase/supabaseStorage'

const { BUCKET_NAME } = process.env

export const upload = async (file: File, folderName: string) => {
  const filePath = `${folderName}/${crypto.randomUUID()}-${file.name}`

  // 1. Upload file
  const { error: uploadError } = await supabaseStorage.storage
    .from(BUCKET_NAME!)
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  // 2. Get public URL
  const { data } = supabaseStorage.storage
    .from(`${BUCKET_NAME}`)
    .getPublicUrl(filePath)

  return data.publicUrl
}
