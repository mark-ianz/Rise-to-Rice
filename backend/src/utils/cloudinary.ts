import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and returns the secure URL.
 * @param filePath Path to the local file
 * @returns Promise<string> The secure HTTPS URL of the uploaded image
 */
export async function uploadToCloudinary(filePath: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: process.env.CLOUDINARY_FOLDER || "rise-to-rice",
  });
  return result.secure_url;
}

/**
 * Deletes a file from Cloudinary given its secure URL.
 * @param url The secure Cloudinary URL
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) {
    console.warn(`Could not extract publicId from URL: ${url}`);
    return;
  }
  
  console.log(`Deleting image from Cloudinary with publicId: ${publicId}`);
  const result = await cloudinary.uploader.destroy(publicId);
  console.log(`Cloudinary deletion result for ${publicId}:`, result);
}

/**
 * Robust helper to extract the public_id from a Cloudinary URL.
 * Example URL:
 * https://res.cloudinary.com/dvn0iyh3v/image/upload/v1715904832/rise-to-rice/image-name.jpg
 * Extracts: "rise-to-rice/image-name"
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    // parts[1] is e.g. "v1715904832/rise-to-rice/image-name.jpg" or "rise-to-rice/image-name.jpg"
    const pathParts = parts[1].split("/");
    
    // If there is a version tag (starts with 'v' and followed by numbers), skip it
    if (pathParts[0].startsWith("v") && /^\d+$/.test(pathParts[0].substring(1))) {
      pathParts.shift();
    }
    
    const fileWithPath = pathParts.join("/"); // "rise-to-rice/image-name.jpg"
    
    // Remove the extension (e.g. .jpg, .png, etc.)
    const dotIndex = fileWithPath.lastIndexOf(".");
    if (dotIndex !== -1) {
      return fileWithPath.substring(0, dotIndex);
    }
    return fileWithPath;
  } catch (error) {
    console.error("Failed to parse public_id from Cloudinary URL:", error);
    return null;
  }
}
