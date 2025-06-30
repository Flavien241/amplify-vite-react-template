import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData, getUrl } from "aws-amplify/storage";

function ProfilePhoto() {
  const { user } = useAuthenticator();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.username) return;

    setIsUploading(true);

    try {
      // Upload vers S3 avec un nom de fichier unique
      const fileName = `profile-pictures/${user.username}/${Date.now()}-${
        file.name
      }`;
      console.log("📤 Upload vers S3...", fileName);

      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      console.log("✅ Upload S3 réussi:", result.key);

      // Récupérer l'URL signée pour affichage
      const signedUrl = await getUrl({
        key: result.key,
        options: {
          expiresIn: 3600, // URL valide pendant 1 heure
        },
      });

      setPhotoUrl(signedUrl.url.toString());
      console.log("✅ Photo uploadée sur S3 avec succès");
    } catch (error) {
      console.error("❌ Erreur upload S3:", error);
      alert(
        `Erreur lors de l'upload: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="profile-photo">
      <h3>📸 Photo de profil</h3>
      <input
        type="file"
        onChange={handleFile}
        accept="image/*"
        disabled={isUploading}
      />
      {isUploading && <p className="upload-status">📤 Upload en cours...</p>}
      {photoUrl && (
        <div>
          <img src={photoUrl} alt="Photo de profil" className="profile-image" />
          <p className="upload-success">
            ✅ Photo uploadée sur AWS S3 avec succès !
          </p>
        </div>
      )}
      <div className="storage-info">
        ☁️ Stockage AWS S3 activé - Photos sauvegardées dans le cloud
      </div>
    </div>
  );
}

export default ProfilePhoto;
