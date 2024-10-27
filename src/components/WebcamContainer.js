import { useRef, useState } from "react";
import Webcam from "react-webcam";
import JSZip from "jszip";
const WebcamContainer = ({ nameShop, location, dateToDay }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [isSent,setIsSent]=useState(false)
  const webcamRef = useRef(null);

  // Fonction pour capturer une photo
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setThumbnails((prevThumbnails) => [...prevThumbnails, imageSrc]);
    }
  };

  // Fonction pour zipper les images et les télécharger
  const zipAndDownloadImages = async () => {
    const zip = new JSZip();

    // Ajout du fichier texte au ZIP
    const textContent = `magazin: ${nameShop}\ndate: ${dateToDay}\nlatitude:${location.latitude}\nlongitude:${location.longitude}`;
    zip.file("metadata.txt", textContent);

    thumbnails.forEach((src, index) => {
      const base64Data = src.split(",")[1]; // Supprime le préfixe "data:image/jpeg;base64,"
      zip.file(`apikadi_${index + 1}.jpg`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    // URL de votre webhook Make.com
    const webhookUrl = "https://hook.eu2.make.com/bbbpe7hcybai99c0xscwcuf8gis5en5x";

  // Utiliser FormData pour ajouter le fichier avec un nom spécifique
  const formData = new FormData();
  formData.append("filename", `${nameShop.replace(/\s/g, '')}_${dateToDay}.zip`); // Nom du fichier
  formData.append("data", content, `${nameShop.replace(/\s/g, '')}_${dateToDay}.zip`); // Blob du fichier avec nom

  try {
    // Envoyer la requête POST avec FormData
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    // Vérifier la réponse du serveur
    if (response.ok) {
        setIsSent(true)
      console.log("Fichier ZIP envoyé avec succès !");
    } else {
      console.error("Échec de l'envoi du fichier ZIP :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du fichier ZIP :", error);
  }
  };

    // Configuration du Webcam pour utiliser la caméra environnementale
    const videoConstraints = {
        facingMode: { exact: "environment" }, // Utilise la caméra arrière
      };
  return (
<>
{ !isSent?   <div className="flex flex-col items-center  min-h-screen bg-gray-100 p-4 gap-4">
      <div className="mb-4 rounded bg-slate-600">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          width={300} // Largeur de la webcam
        />
      </div>
      <button onClick={capturePhoto} className="btn btn-neutral">
        Prendre la Photo
      </button>
      {thumbnails.length > 0 && (
        <button className="btn btn-success" onClick={zipAndDownloadImages}>
          Envoyer photos
        </button>
      )}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold mt-8">Photos prises</h2>
        <div className="carousel rounded-box w-full h-16">
          <div className="carousel-item w-1/2">
            {thumbnails.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Thumbnail ${index}`}
                className="w-fit object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>:
    <div className="h-screen bg-lime-400">
        <p className="text-lg font-extrabold">C'est bon</p>

    </div>}
</>
  );
};

export default WebcamContainer;
