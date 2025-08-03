// utils/cropImage.ts
import { Area } from "react-easy-crop";

export default function getCroppedImg(imageSrc: string, cropArea: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject();

      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject();
        resolve(blob);
      }, "image/jpeg");
    };

    image.onerror = reject;
  });
}
