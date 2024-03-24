import { useRef, useState, useEffect, FC } from "react";

interface PhotoUploadProps {
  onImageSelect: (file: File) => void;
  placeholderImg: string;
  color: string;
}

const PhotoUpload: FC<PhotoUploadProps> = ({
  onImageSelect,
  placeholderImg,
  color,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          // If there is an error, or no camera is accessible, we display the placeholder image.
          drawPlaceholder();
        });
    } else {
      drawPlaceholder();
    }

    return () => {
      // Clean up the stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const drawPlaceholder = () => {
    const ctx = canvasRef.current?.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(
        img,
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
    };
    img.src = placeholderImg;
  };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "user_photo.png", {
              type: "image/png",
            });
            onImageSelect(file);
          }
        }, "image/png");
        // Pause the stream after taking the photo
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="relative z-10 h-[100%] py-5">
      <canvas ref={canvasRef} width="300" height="300" className="rounded-lg" />
      {stream && <video ref={videoRef} style={{ display: "none" }}></video>}
      <button
        className={`text-center text-white mt-5 bg-${color} w-[100%] py-4 rounded-md transition-1`}
        onClick={takePhoto}
      >
        Take Photo
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            onImageSelect(file);
          }
        }}
        style={{ display: "none" }}
      />
      <button
        className={`text-center text-white mt-5 bg-${color} w-[100%] py-4 rounded-md transition-1`}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Photo
      </button>
    </div>
  );
};

export default PhotoUpload;
