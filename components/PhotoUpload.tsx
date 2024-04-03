import moment from "moment";
import { useRef, useState, useEffect, FC, useCallback } from "react";

interface PhotoUploadProps {
  onImageSelect: (file: File) => void;
  handleSubmit: () => void;
  placeholderImg: string;
  color: string;
  className?: string;
  sender: string;
}

const PhotoUpload: FC<PhotoUploadProps> = ({
  onImageSelect,
  handleSubmit,
  placeholderImg,
  color,
  className,
  sender,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [photoTaken, setPhotoTaken] = useState<boolean>(false);

  const drawPlaceholder = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
      };
      img.src = placeholderImg;
    }
  }, [placeholderImg]);

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current && isVideoReady) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Save the current state of the context
        ctx.save();

        // Mirror the image
        ctx.scale(-1, 1); // Flip the canvas context horizontally
        ctx.translate(-canvasRef.current.width, 0); // Move the canvas context back into the correct position

        // Draw the mirrored video frame onto the canvas
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Restore the canvas context to its original state
        ctx.restore();

        // Proceed with creating a blob and a File from the canvas
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File(
              [blob],
              `${sender}_photo_${moment().format("MMMM-DD-YY")}_${Math.floor(
                Math.random() * 100
              )}.png`,
              {
                type: "image/png",
              }
            );
            setPhotoTaken(true);
            onImageSelect(file);
          }
        }, "image/png");

        // Pause the video and indicate that the video is no longer ready for another snapshot
        videoRef.current.pause();
        setIsVideoReady(false);
      }
    }
  };

  const drawImageToCanvas = (imageSrc: string) => {
    // Early exit if canvasRef.current is null to satisfy TypeScript's strict null checks.
    if (!canvasRef.current) {
      console.error("Canvas ref is null");
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        // At this point, we've already checked that canvasRef.current is not null,
        // so we can assert non-null using the non-null assertion operator (!).
        ctx.drawImage(
          img,
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
        URL.revokeObjectURL(imageSrc); // Revoke the object URL here
      };
      img.src = imageSrc;
    }
  };

  const handleRetry = async () => {
    setPhotoTaken(false); // Reset to take another photo or upload
    // Clear the canvas first
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    // If the stream is still active, attempt to play the video again
    if (stream && videoRef.current) {
      try {
        await videoRef.current.play();
        setIsVideoReady(true);
      } catch (error) {
        console.error("Error trying to replay the video:", error);
        drawPlaceholder();
      }
    } else {
      // If the stream is not active, reacquire it
      await getVideoStream();
    }
  };

  const getVideoStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // This will request the front camera on a smartphone
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.style.transform = "scaleX(-1)"; // This will mirror the video
        await videoRef.current.play();
        setIsVideoReady(true);
      }
    } catch (error) {
      console.error("Error accessing the video stream:", error);
      drawPlaceholder();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const originalFile = event.target.files?.[0];
    if (originalFile) {
      const newFileName = `uploaded_${sender}_photo_${moment().format(
        "YYYY-MM-DD"
      )}_${Math.floor(Math.random() * 1000)}.${originalFile.name
        .split(".")
        .pop()}`;

      const fileWithNewName = new File([originalFile], newFileName, {
        type: originalFile.type,
      });

      const imageUrl = URL.createObjectURL(fileWithNewName);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }

      drawImageToCanvas(imageUrl);
      onImageSelect(fileWithNewName);
      setPhotoTaken(true);
    }
  };

  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video && video.videoWidth > 0 && video.videoHeight > 0) {
      const ctx = canvas.getContext("2d");
      const videoRatio = video.videoWidth / video.videoHeight;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight, drawX, drawY;

      // Determine the dimensions to cover the canvas with the video.
      if (videoRatio < canvasRatio) {
        drawWidth = canvas.width;
        drawHeight = drawWidth / videoRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2; // Center vertically
      } else {
        drawHeight = canvas.height;
        drawWidth = drawHeight * videoRatio;
        drawX = (canvas.width - drawWidth) / 2; // Center horizontally
        drawY = 0;
      }

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.save(); // Save the current state
      ctx?.scale(-1, 1); // Mirror the canvas context
      ctx?.drawImage(video, -drawX, drawY, drawWidth * -1, drawHeight); // Draw the mirrored frame
      ctx?.restore(); // Restore the original state
    }

    // Request the next frame of the animation
    requestAnimationFrame(updateCanvas);
  }, []);

  useEffect(() => {
    // Start updating the canvas as soon as the component mounts
    updateCanvas();
  }, [updateCanvas]);

  useEffect(() => {
    getVideoStream();

    return () => {
      // Cleanup function to stop the video stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(updateCanvas);

    // Cleanup function to cancel the requestAnimationFrame
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateCanvas]);

  return (
    <div className={`relative z-10 h-[100%] py-5 mt-5 ${className}`}>
      <img
        alt="HeartLeft"
        width={50}
        height={50}
        src="/heart-left.png"
        className="absolute left-5 top-0"
      />
      <img
        alt="HeartRight"
        width={50}
        height={50}
        src="/heart-right.png"
        className="absolute right-5 top-0"
      />
      <canvas
        ref={canvasRef}
        width="250"
        height="250"
        className="rounded-lg mx-auto"
      />
      {!photoTaken ? (
        <>
          <div className="w-[100%] justify-between items-end my-4 flex animate__animated animate__fadeIn">
            <img alt="HeartLeft" width={50} height={50} src="/heart-left.png" />
            <h3
              className={`animate__animated animate__fadeIn text-center text-${
                color === "red"
                  ? "red-400"
                  : color === "yellow"
                  ? "yellow-400"
                  : "blue-400"
              }`}
            >
              <b>Take Your Photo</b>
            </h3>
            <img
              alt="HeartLeft"
              width={50}
              height={50}
              src="/heart-right.png"
            />
          </div>
          <p
            className={`animate__animated animate__fadeIn text-center text-${
              color === "red"
                ? "red-400"
                : color === "yellow"
                ? "yellow-400"
                : "blue-400"
            }`}
          >
            Reveal Your Beauty. Snap a photo and let your radiance shine. Share
            your essence with the world.
          </p>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: "absolute", top: "-9999px" }}
            onCanPlay={() => setIsVideoReady(true)}
          ></video>
          <button
            className={`animate__animated animate__fadeIn text-center text-white mt-5 bg-${color} w-[100%] py-4 rounded-md transition-1 flex justify-center items-center gap-1`}
            onClick={takePhoto}
            disabled={!isVideoReady} // Disable the button until the video is ready
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.098 4.487C8.365 3.177 9.531 2.25 10.866 2.25H14.134C15.469 2.25 16.634 3.177 16.902 4.487C16.9315 4.63125 17.0088 4.76137 17.1212 4.85642C17.2337 4.95147 17.3748 5.00591 17.522 5.011H17.555C18.958 5.073 20.036 5.245 20.936 5.836C21.503 6.208 21.991 6.686 22.371 7.245C22.844 7.939 23.052 8.737 23.152 9.701C23.25 10.644 23.25 11.825 23.25 13.321V13.406C23.25 14.902 23.25 16.084 23.152 17.026C23.052 17.99 22.844 18.788 22.371 19.483C21.9898 20.0423 21.5022 20.5211 20.936 20.892C20.233 21.353 19.426 21.557 18.448 21.654C17.49 21.75 16.289 21.75 14.763 21.75H10.237C8.711 21.75 7.51 21.75 6.552 21.654C5.574 21.557 4.767 21.354 4.064 20.892C3.49771 20.5208 3.01009 20.0417 2.629 19.482C2.156 18.788 1.948 17.99 1.848 17.026C1.75 16.084 1.75 14.902 1.75 13.406V13.321C1.75 11.825 1.75 10.644 1.848 9.701C1.948 8.737 2.156 7.939 2.629 7.245C3.01009 6.68532 3.49771 6.2062 4.064 5.835C4.964 5.245 6.042 5.073 7.445 5.012L7.462 5.011H7.478C7.62516 5.00591 7.76632 4.95147 7.87879 4.85642C7.99125 4.76137 8.06846 4.63125 8.098 4.487ZM10.866 3.75C10.226 3.75 9.689 4.193 9.568 4.786C9.373 5.746 8.521 6.502 7.496 6.511C6.148 6.571 5.426 6.736 4.886 7.09C4.48488 7.35322 4.13934 7.69264 3.869 8.089C3.593 8.494 3.427 9.013 3.339 9.856C3.251 10.712 3.25 11.816 3.25 13.364C3.25 14.912 3.25 16.015 3.34 16.871C3.427 17.714 3.593 18.233 3.87 18.639C4.138 19.033 4.483 19.373 4.887 19.638C5.304 19.911 5.838 20.076 6.701 20.162C7.575 20.249 8.701 20.25 10.278 20.25H14.722C16.298 20.25 17.424 20.25 18.299 20.162C19.162 20.076 19.696 19.912 20.113 19.638C20.517 19.373 20.863 19.033 21.131 18.638C21.407 18.233 21.573 17.714 21.661 16.871C21.749 16.015 21.75 14.911 21.75 13.364C21.75 11.816 21.75 10.712 21.66 9.856C21.573 9.013 21.407 8.494 21.13 8.089C20.86 7.69212 20.5144 7.35231 20.113 7.089C19.575 6.736 18.853 6.571 17.503 6.511C16.479 6.501 15.627 5.747 15.432 4.786C15.368 4.49027 15.2039 4.22569 14.9674 4.03694C14.7309 3.84819 14.4366 3.74684 14.134 3.75H10.866ZM12.5 10.75C11.9033 10.75 11.331 10.9871 10.909 11.409C10.4871 11.831 10.25 12.4033 10.25 13C10.25 13.5967 10.4871 14.169 10.909 14.591C11.331 15.0129 11.9033 15.25 12.5 15.25C13.0967 15.25 13.669 15.0129 14.091 14.591C14.5129 14.169 14.75 13.5967 14.75 13C14.75 12.4033 14.5129 11.831 14.091 11.409C13.669 10.9871 13.0967 10.75 12.5 10.75ZM8.75 13C8.75 12.0054 9.14509 11.0516 9.84835 10.3483C10.5516 9.64509 11.5054 9.25 12.5 9.25C13.4946 9.25 14.4484 9.64509 15.1517 10.3483C15.8549 11.0516 16.25 12.0054 16.25 13C16.25 13.9946 15.8549 14.9484 15.1517 15.6517C14.4484 16.3549 13.4946 16.75 12.5 16.75C11.5054 16.75 10.5516 16.3549 9.84835 15.6517C9.14509 14.9484 8.75 13.9946 8.75 13ZM17.75 10C17.75 9.80109 17.829 9.61032 17.9697 9.46967C18.1103 9.32902 18.3011 9.25 18.5 9.25H19.5C19.6989 9.25 19.8897 9.32902 20.0303 9.46967C20.171 9.61032 20.25 9.80109 20.25 10C20.25 10.1989 20.171 10.3897 20.0303 10.5303C19.8897 10.671 19.6989 10.75 19.5 10.75H18.5C18.3011 10.75 18.1103 10.671 17.9697 10.5303C17.829 10.3897 17.75 10.1989 17.75 10Z"
                fill={
                  color === "red"
                    ? "red"
                    : color === "yellow"
                    ? "yellow"
                    : "blue"
                }
              />
            </svg>
            Take Photo
          </button>
          <div className="text-center mt-5 animate__animated animate__fadeIn">
            <h3>
              <span
                className={`bg-white orline py-2 px-3 rounded-full  text-${
                  color === "red"
                    ? "red-400"
                    : color === "yellow"
                    ? "yellow-400"
                    : "blue-400"
                }`}
              >
                Or
              </span>
            </h3>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
          <button
            className={`animate__animated animate__fadeIn text-center flex justify-center items-center gap-1 text-white mt-5 text-${
              color === "red"
                ? "red-400"
                : color === "yellow"
                ? "yellow-400"
                : "blue-400"
            } w-[100%] py-4 rounded-md transition-1`}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5 8C18.5 8.53043 18.2893 9.03914 17.9142 9.41421C17.5391 9.78929 17.0304 10 16.5 10C15.9696 10 15.4609 9.78929 15.0858 9.41421C14.7107 9.03914 14.5 8.53043 14.5 8C14.5 7.46957 14.7107 6.96086 15.0858 6.58579C15.4609 6.21071 15.9696 6 16.5 6C17.0304 6 17.5391 6.21071 17.9142 6.58579C18.2893 6.96086 18.5 7.46957 18.5 8Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.443 1.25H12.557C14.866 1.25 16.675 1.25 18.087 1.44C19.531 1.634 20.671 2.04 21.566 2.934C22.461 3.829 22.866 4.969 23.06 6.414C23.25 7.825 23.25 9.634 23.25 11.943V12.031C23.25 13.94 23.25 15.502 23.146 16.774C23.042 18.054 22.829 19.121 22.351 20.009C22.141 20.4 21.881 20.751 21.566 21.066C20.671 21.961 19.531 22.366 18.086 22.56C16.675 22.75 14.866 22.75 12.557 22.75H12.443C10.134 22.75 8.325 22.75 6.913 22.56C5.469 22.366 4.329 21.96 3.434 21.066C2.641 20.273 2.231 19.286 2.014 18.06C1.799 16.857 1.76 15.36 1.752 13.502C1.75 13.029 1.75 12.529 1.75 12.001V11.943C1.75 9.634 1.75 7.825 1.94 6.413C2.134 4.969 2.54 3.829 3.434 2.934C4.329 2.039 5.469 1.634 6.914 1.44C8.325 1.25 10.134 1.25 12.443 1.25ZM7.113 2.926C5.835 3.098 5.064 3.426 4.495 3.995C3.925 4.565 3.598 5.335 3.426 6.614C3.252 7.914 3.25 9.622 3.25 12V12.844L4.251 11.968C4.69007 11.5837 5.25882 11.3806 5.84203 11.3999C6.42524 11.4192 6.97931 11.6594 7.392 12.072L11.682 16.362C12.0149 16.6948 12.4546 16.8996 12.9235 16.9402C13.3925 16.9808 13.8608 16.8547 14.246 16.584L14.544 16.374C15.0997 15.9835 15.7714 15.7932 16.4493 15.834C17.1273 15.8749 17.7713 16.1446 18.276 16.599L21.106 19.146C21.392 18.548 21.561 17.762 21.651 16.653C21.749 15.448 21.75 13.946 21.75 12C21.75 9.622 21.748 7.914 21.574 6.614C21.402 5.335 21.074 4.564 20.505 3.994C19.935 3.425 19.165 3.098 17.886 2.926C16.586 2.752 14.878 2.75 12.5 2.75C10.122 2.75 8.413 2.752 7.113 2.926Z"
                fill={
                  color === "red"
                    ? "red"
                    : color === "yellow"
                    ? "yellow"
                    : "blue"
                }
              />
            </svg>
            Upload Photo
          </button>
        </>
      ) : (
        <>
          <div className="w-[100%] my-4 text-center animate__animated animate__fadeIn">
            <h3
              className={`text-center text-${
                color === "red"
                  ? "red-400"
                  : color === "yellow"
                  ? "yellow-400"
                  : "blue-400"
              }`}
            >
              Are you sure to send this ?
            </h3>
          </div>
          <p
            className={`animate__animated animate__fadeIn text-center text-${
              color === "red"
                ? "red-400"
                : color === "yellow"
                ? "yellow-400"
                : "blue-400"
            }`}
          >
            Reveal Your Beauty. Snap a photo and let your radiance shine. Share
            your essence with the world.
          </p>
          <div className="animate__animated animate__fadeIn flex justify-center mt-5 items-center gap-5">
            <img alt="HeartLeft" width={75} height={75} src="/heart-left.png" />
            <button type="button" onClick={handleSubmit}>
              <svg
                width="98"
                height="90"
                viewBox="0 0 98 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M49 89.6L41.895 83.1547C16.66 60.3518 0 45.2639 0 26.8556C0 11.7676 11.858 0 26.95 0C35.476 0 43.659 3.95509 49 10.1563C54.341 3.95509 62.524 0 71.05 0C86.142 0 98 11.7676 98 26.8556C98 45.2639 81.34 60.3518 56.105 83.1547L49 89.6Z"
                  fill="white"
                />
                <path
                  d="M38.8996 30.2752L33.4564 40.8032V46H29.626V40.8032L24.1828 30.2752H28.5284L31.5748 36.8608L34.5988 30.2752H38.8996ZM44.8893 33.344V36.5248H50.0189V39.4816H44.8893V42.9312H50.6909V46H41.0589V30.2752H50.6909V33.344H44.8893ZM59.4833 46.1568C58.3334 46.1568 57.303 45.9701 56.3921 45.5968C55.4811 45.2235 54.7494 44.6709 54.1969 43.9392C53.6593 43.2075 53.3755 42.3264 53.3457 41.296H57.4225C57.4822 41.8784 57.6838 42.3264 58.0273 42.64C58.3707 42.9387 58.8187 43.088 59.3713 43.088C59.9387 43.088 60.3867 42.9611 60.7153 42.7072C61.0438 42.4384 61.2081 42.0725 61.2081 41.6096C61.2081 41.2213 61.0737 40.9003 60.8049 40.6464C60.551 40.3925 60.2299 40.1835 59.8417 40.0192C59.4683 39.8549 58.9307 39.6683 58.2289 39.4592C57.2134 39.1456 56.3846 38.832 55.7425 38.5184C55.1003 38.2048 54.5478 37.7419 54.0849 37.1296C53.6219 36.5173 53.3905 35.7184 53.3905 34.7328C53.3905 33.2693 53.9206 32.1269 54.9809 31.3056C56.0411 30.4693 57.4225 30.0512 59.1249 30.0512C60.8571 30.0512 62.2534 30.4693 63.3137 31.3056C64.3739 32.1269 64.9414 33.2768 65.0161 34.7552H60.8721C60.8422 34.2475 60.6555 33.8517 60.3121 33.568C59.9686 33.2693 59.5281 33.12 58.9905 33.12C58.5275 33.12 58.1542 33.2469 57.8705 33.5008C57.5867 33.7397 57.4449 34.0907 57.4449 34.5536C57.4449 35.0613 57.6838 35.4571 58.1617 35.7408C58.6395 36.0245 59.3862 36.3307 60.4017 36.6592C61.4171 37.0027 62.2385 37.3312 62.8657 37.6448C63.5078 37.9584 64.0603 38.4139 64.5233 39.0112C64.9862 39.6085 65.2177 40.3776 65.2177 41.3184C65.2177 42.2144 64.9862 43.0283 64.5233 43.76C64.0753 44.4917 63.4182 45.0741 62.5521 45.5072C61.6859 45.9403 60.663 46.1568 59.4833 46.1568ZM73.2309 29.7152L72.7829 40.4448H69.5349L69.0869 29.7152H73.2309ZM71.2149 46.1792C70.5429 46.1792 69.9904 45.9851 69.5573 45.5968C69.1392 45.1936 68.9301 44.7008 68.9301 44.1184C68.9301 43.5211 69.1392 43.0208 69.5573 42.6176C69.9904 42.2144 70.5429 42.0128 71.2149 42.0128C71.872 42.0128 72.4096 42.2144 72.8277 42.6176C73.2608 43.0208 73.4773 43.5211 73.4773 44.1184C73.4773 44.7008 73.2608 45.1936 72.8277 45.5968C72.4096 45.9851 71.872 46.1792 71.2149 46.1792Z"
                  fill={
                    color === "red"
                      ? "rgb(237 91 91)"
                      : color === "yellow"
                      ? "#efd799"
                      : "#8cb9ea"
                  }
                />
              </svg>
            </button>
            <img
              alt="HeartLeft"
              width={75}
              height={75}
              src="/heart-right.png"
            />
          </div>
          <div className="text-center mt-5 animate__animated animate__fadeIn">
            <h3>
              <span
                className={`bg-white orline py-2 px-3 rounded-full  text-${
                  color === "red"
                    ? "red-400"
                    : color === "yellow"
                    ? "yellow-400"
                    : "blue-400"
                }`}
              >
                Or
              </span>
            </h3>
          </div>
          <button
            className={`animate__animated animate__fadeIn text-center flex justify-center items-center gap-1 text-white mt-5 text-${
              color === "red"
                ? "red-400"
                : color === "yellow"
                ? "yellow-400"
                : "blue-400"
            } w-[100%] py-4 rounded-md transition-1`}
            onClick={handleRetry}
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
};

export default PhotoUpload;
