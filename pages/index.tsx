"use client";

import { saveCardData, uploadImageAndGetURL } from "@/app/services/cardService";
import Logo from "@/components/Logo";
import PhotoUpload from "@/components/PhotoUpload";
import lottieChar from "@/public/character_intro.json";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import QRCode from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingHearts from "../components/LoadingHearts";

import LoadingProcess from "@/components/LoadingProcess";
import "animate.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface IPayload {
  sender: string;
  recipient: string;
  message: string;
  image_url: any;
  color: string;
}

const initialPayload = {
  sender: "",
  recipient: "",
  message: "",
  image_url: null,
  color: "red",
};

const sampleItems = [
  {
    image: "happy.png",
    title: "Happy",
    message:
      "Halo bestie! Selamat Lebaran! 🌙🎉 Lebaran kali ini, mari kita tetap stay connected, sharing cerita, dan bertukar doa. Eid Mubarak, bestie!  ",
  },
  {
    image: "funny.png",
    title: "Joyful",
    message:
      "Eid Mubarak, bestie! 🌟Walau kita beda timezone, Cheers to more virtual hangouts and endless laughter! Selamat lebaran bestie 🌙🎉",
  },
  {
    image: "warm.png",
    title: "Inspiring",
    message:
      "Hey bestie! 🎉 Eid Mubarak! May this Eid bring you lots of happiness and blessings with every step you take. 🌟",
  },
];

const Index: NextPage = () => {
  const [steps, setSteps] = useState(0);
  const [char, setChar] = useState(0);
  const [chat, setChat] = useState<any[]>([]);
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  const [animateIn2, setAnimateIn2] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [animateOut2, setAnimateOut2] = useState<boolean>(false);
  const [renderAudio, setRenderAudio] = useState<boolean>(false);
  const [renderAudioBg, setRenderAudioBg] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("blue");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [payload, setPayload] = useState<IPayload>(initialPayload);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const wait = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

  const handleImageSelect = (file: any) => {
    // Handle the file, e.g., upload to server or display a preview
    if (file) {
      setPayload((prev: any) => ({
        ...prev,
        image_url: file,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadError("");

    try {
      let imageUrl = "";
      setAnimateOut(true);
      await wait(500);
      setSteps(7);
      if (payload.image_url instanceof File) {
        imageUrl = await uploadImageAndGetURL(payload.image_url);
        setImageUrl(imageUrl);
      }
      const cardData = {
        ...payload,
        image_url: imageUrl,
      };

      const docId = await saveCardData(cardData);

      const generatedLink = `${process.env.NEXT_PUBLIC_URL}/card/${docId}`;
      setQrCodeUrl(generatedLink);

      await wait(1000);
      setAnimateOut(false);
      setAnimateOut2(false);
      setAnimateIn(false);
      setAnimateIn2(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setUploadError(
        "Failed to upload the image and save the card. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        // Here we're sharing the URL encoded in the QR code
        await navigator.share({
          title: "Check out this card",
          text: "Hallo Bestie, its connection card for you 😊 ",
          url: qrCodeUrl, // This is the URL you're encoding in your QR code
        });
        console.log("Card shared successfully");
      } catch (error) {
        console.error("Error sharing the card:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert("Web Share API is not supported in this browser.");
    }
  };

  const downloadQR = () => {
    let canvas = document.querySelector(
      ".HpQrcode > canvas"
    ) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${payload.sender}_${payload.recipient}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const shareQRImage = async () => {
    const originalCanvas = document.querySelector(
      ".HpQrcode > canvas"
    ) as HTMLCanvasElement;
    if (!originalCanvas) {
      console.error("QR Code canvas not found.");
      return;
    }

    const padding = 20;
    const textHeight = 30;
    const captionText = "Emina Connection Card";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = originalCanvas.width + padding * 2;
    canvas.height = originalCanvas.height + padding * 2 + textHeight;

    if (!ctx) {
      console.error("Failed to get canvas context.");
      return;
    }

    // Draw the white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the original QR code on the new canvas, centered
    ctx.drawImage(originalCanvas, padding, padding);

    // Add caption text
    ctx.fillStyle = "#000000"; // text color
    ctx.textAlign = "center";
    ctx.font = "16px Arial"; // modify as needed
    ctx.fillText(
      captionText,
      canvas.width / 2,
      originalCanvas.height + padding * 1.5 + textHeight
    );

    // Convert the new canvas to a blob and share
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to convert canvas to Blob.");
        return;
      }

      const fileName = `from-${payload?.sender}-qr-code-${moment().format(
        "YYYY-MM-DD"
      )}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      try {
        await navigator.share({
          files: [file],
          title: "QR Code",
          text: "Check out this connection card I made using Emina Festive Connection Card",
        });
        console.log("QR code with caption shared successfully");
      } catch (error) {
        console.error("Error sharing the QR code with caption:", error);
      }
    }, "image/png");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      setSuccessMessage("Copied!");
    } catch (error) {
      setErrorMessage("Error copying URL: " + error);
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);
    }
  };

  const handleMessage = (index: number, item: any) => {
    setPayload({
      ...payload,
      message: item.message,
    });
    setActiveIndex(index); // Set the clicked item as active
  };

  const textColor = `text-${
    bgColor === "red"
      ? "red-400"
      : bgColor === "yellow"
      ? "yellow-400"
      : "blue-400"
  }`;

  useEffect(() => {
    const runAnimations = async () => {
      await wait(3000);
      setAnimateOut(true);

      await wait(1000);
      setAnimateOut2(true);

      await wait(1000);
      setSteps(1);
      setRenderAudioBg(true);
      setAnimateOut(false);
      setAnimateOut2(false);
      setAnimateIn(true);
      await wait(1000);
      setAnimateIn2(true);
    };

    runAnimations();
  }, []);

  useEffect(() => {
    if (char > 6) {
      const runsAnimations = async () => {
        setAnimateOut(false);
        await wait(1000);
        setSteps(4);
      };
      runsAnimations();
    }
  }, [char]);

  useEffect(() => {
    const runChats = async () => {
      const messages = [
        "Hallo bestie, yay lebaran is coming 😍",
        ["Nggak terasa ya bentar", "lagi udah mau lebaran 😊"],
        ["Saatnya build connection sama", "orang terdekat kalian 🥰"],
        ["Yuk kreasikan connection card", "kamu bareng Emina ✨"],
      ];
      for (let i = 0; i < messages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1 second
        setChat((currentChat: any) => [...currentChat, messages[i]]); // Append new message
      }
    };

    if (steps === 2) {
      runChats();
    }
  }, [steps]);

  useEffect(() => {
    if (steps === 7) {
      const runsAnimations = async () => {
        await wait(3000);
        if (!isSubmitting) {
          setSteps(8);
          setAnimateIn(true);
        }
      };
      runsAnimations();
    }
  }, [steps, isSubmitting]);

  useEffect(() => {
    // Define the function to toggle audio based on document visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Emina Festive Microsite - Create Your Connection Card</title>
      </Head>
      {steps === 0 && (
        <div
          className={`flex max-h-screen flex-col justify-center h-[100vh] items-center w-[100%] line-vector overflow-hidden animate__animated ${
            animateOut2 && "animate__fadeOut"
          } animate__slow`}
        >
          <div
            className={`relative flex flex-col justify-center place-items-center`}
          >
            <Logo
              width={200}
              height={100}
              color="white"
              className={`mb-5 animate__animated animate__slow ${
                animateOut ? "animate__fadeOutUpBig" : "animate__fadeInDownBig"
              }`}
            />
            <LoadingHearts
              className={`animate__animated ${
                animateOut2
                  ? "animate__fadeOut animate__slower"
                  : "animate__fadeIn"
              }`}
            />
            <Image
              src="/colors-of-connection.png"
              alt="Emina Logo"
              width={400}
              height={200}
              layout="responsive"
              className={`animate__animated animate__slow ${
                animateOut ? "animate__fadeOutDownBig" : "animate__fadeInUpBig"
              }`}
            />
          </div>
        </div>
      )}
      {steps !== 0 && (
        <div
          className={`${steps !== 5 && "flex flex-col"} min-h-screen ${
            steps !== 9 && steps !== 7 ? "justify-between" : "justify-center"
          } items-center w-[100%] overflow-hidden animate__animated relative transition-1 ${
            animateIn && "animate__fadeIn"
          } animate__slow bg-${bgColor}-opacity`}
        >
          {error ||
            (uploadError &&
              (!payload.recipient || !payload.sender || !payload.message) && (
                <p className="bg-red w-[100%] text-center absolute top-0 z-20">
                  ERROR:{" "}
                  {!payload.sender
                    ? "Sender is empty"
                    : !payload.recipient
                    ? "Recipient is empty"
                    : !payload.message
                    ? "Message is empty"
                    : uploadError}
                </p>
              ))}
          {renderAudioBg && (
            <audio
              ref={audioRef}
              controls={false}
              autoPlay
              className="hidden"
              loop
            >
              <source src="/background_music.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <img
            src="/awan-1.png"
            className="absolute top-[10%] right-0 transition-1 z-0 left-0 w-[100%] scale-150 opacity-60"
            alt="awan emina"
          />
          <img
            src="/awan-2.png"
            className="absolute bottom-[10%] right-0 transition-1 z-0 left-0 w-[100%] scale-150 opacity-60"
            alt="awan emina"
          />

          {steps === 1 && (
            <div className="flex flex-col h-[100%]">
              <div
                className={`flex flex-col justify-center place-items-center pt-5 h-[100%] ${
                  !animateIn2 ? "opacity-0" : "opacity-100"
                } transition-1 ${
                  animateOut &&
                  "animate__animated animate__slow animate__fadeOutUpBig"
                }`}
              >
                <Logo
                  width={200}
                  height={100}
                  color={
                    bgColor === "red"
                      ? "#F78B93"
                      : bgColor === "yellow"
                      ? "#878684"
                      : "#FFF"
                  }
                  className={`mb-5 transition-1`}
                />
                <Image
                  src="/colors-of-connection.png"
                  alt="Emina Logo"
                  width={400}
                  height={200}
                  layout="responsive"
                  className={`animate__animated animate__slow transition-1 ${
                    animateIn && "animate__zoomIn"
                  }`}
                />
              </div>
              <div
                className={`bg-white transition-1 absolute left-0 ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInUpBig h-[40vh] bottom-0"
                    : !animateIn2 && !animateOut
                    ? "-bottom-[100%]"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutDownBig"
                    : "-bottom-[100%]"
                }  w-[100%] } `}
              >
                <div className="px-10 pt-10 pb-40 text-center text-black">
                  <div className="flex justify-evenly absolute -top-[15%] w-[100%] left-0">
                    <div
                      className={`bg-red-opacity cursor-pointer aspect-square rounded-lg transition-half ${
                        bgColor === "red" && "border-white border-4 shadow-xl"
                      }`}
                    >
                      <div className="p-3 h-[100%] flex items-center">
                        <span
                          className={`rounded-lg kv-bg-red`}
                          onClick={() => setBgColor("red")}
                        ></span>
                      </div>
                    </div>
                    <div
                      className={`bg-yellow-opacity cursor-pointer aspect-square rounded-lg transition-half ${
                        bgColor === "yellow" &&
                        "border-white border-4 shadow-xl"
                      }`}
                    >
                      <div className="p-3 h-[100%] flex items-center">
                        <span
                          className={`rounded-lg kv-bg-yellow`}
                          onClick={() => setBgColor("yellow")}
                        ></span>
                      </div>
                    </div>
                    <div
                      className={`bg-blue-opacity-choice cursor-pointer aspect-square rounded-lg transition-half ${
                        bgColor === "blue" && "border-white border-4 shadow-xl"
                      }`}
                    >
                      <div className="p-3 h-[100%] flex items-center">
                        <span
                          className={`rounded-lg kv-bg-blue`}
                          onClick={() => setBgColor("blue")}
                        ></span>
                      </div>
                    </div>
                  </div>
                  <h3
                    className={`mt-5 text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                  >
                    <b>Choose Your Color!</b>
                  </h3>
                  <button
                    className={`text-center text-white mt-5 bg-${bgColor} w-[100%] py-4 rounded-md transition-1`}
                    onClick={async () => {
                      if (audioRef.current) {
                        audioRef.current.play();
                      }
                      if (voiceRef.current) {
                        voiceRef.current.play();
                      }
                      setPayload((prev: any) => ({
                        ...prev,
                        color: bgColor,
                      }));
                      setRenderAudio(true);
                      setAnimateIn2(false);
                      setAnimateOut(true);
                      await wait(1000);
                      setSteps(2);
                      setAnimateIn2(true);
                      setAnimateOut(false);
                      await wait(1000);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {renderAudio && (
            <audio ref={voiceRef} controls={false} autoPlay className="hidden">
              <source src="/voice_over.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          {steps === 2 && (
            <>
              <Logo
                width={200}
                height={100}
                color={
                  bgColor === "red"
                    ? "#F78B93"
                    : bgColor === "yellow"
                    ? "#878684"
                    : "#FFF"
                }
                className={`my-5 transition-1 ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInDownBig"
                    : !animateIn2 && !animateOut
                    ? "-top-[100%] absolute"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutUpBig"
                    : "-top-[100%] absolute"
                }`}
              />
              <div
                className={`absolute flex flex-col gap-5 top-24 right-0 z-10 text-black text-justify mt-16 mx-5 items-end ${
                  animateOut && "animate__animated animate__fadeOut"
                }`}
              >
                {chat.map((message, index) =>
                  Array.isArray(message) ? (
                    <span
                      key={index}
                      className="text-bubble p-5 text-end animate__animated animate__fadeIn animate__slow"
                    >
                      {message.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                          {part}
                          {partIndex < message.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </span>
                  ) : (
                    <span
                      key={index}
                      className="text-bubble p-5 text-end animate__animated animate__fadeIn animate__slow"
                    >
                      {message}
                    </span>
                  )
                )}
              </div>
              <Lottie
                loop
                animationData={lottieChar}
                play
                style={{ width: "100%", height: "85%" }}
                className={`absolute ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInUpBig top-0 "
                    : !animateIn2 && !animateOut
                    ? "-bottom-[100%]"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutDownBig"
                    : "-bottom-[100%]"
                }`}
              />

              <Image
                src={"/love.png"}
                width={200}
                height={200}
                alt="LOVE"
                className={`absolute bottom-14 z-0 right-2 ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInUpBig"
                    : !animateIn2 && !animateOut
                    ? "-bottom-[100%] absolute"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutDownBig"
                    : "-bottom-[100%] absolute"
                }`}
              />

              <button
                className={`text-center text-white m-5 p-5 bg-${bgColor} w-[80%] py-4 rounded-md transition-1 absolute bottom-5 ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInUpBig"
                    : !animateIn2 && !animateOut
                    ? "-bottom-[100%] absolute"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutDownBig"
                    : "-bottom-[100%] absolute"
                }`}
                onClick={async () => {
                  setAnimateIn2(false);
                  setAnimateOut(true);
                  await wait(2000);
                  setAnimateOut(false);
                  setSteps(3);
                  await wait(1000);
                  setAnimateIn2(true);
                  await wait(1000);
                  setRenderAudio(false);
                }}
              >
                Get Started
              </button>
            </>
          )}
          {steps === 3 && (
            <>
              <div
                className={`animate__animated animate__slow relative w-[100%] h-screen ${
                  char === 0
                    ? "animate__fadeIn"
                    : char > 6 && "animate__fadeOut"
                } `}
              >
                <div className="flex flex-col justify-center min-h-screen items-stretch h-screen w-[100%] px-3 z-10">
                  <div
                    className={`flex w-[100%] justify-center shadow-md relative items-stretch z-30 ${
                      animateIn && "animate__animated animate__bounceInLeft"
                    }`}
                  >
                    <div
                      className={`w-[50%] flex justify-center rounded-tl-lg`}
                    >
                      <img
                        src="/step1.png"
                        alt="Step 1"
                        className="w-[100%] object-contain"
                      />
                    </div>
                    <div
                      className={`bg-white p-4 w-[50%] text-${bgColor}-400 h-[100%] flex items-center rounded-tr-lg`}
                    >
                      <strong>Choose your colors of connection</strong>
                    </div>
                    <Image
                      alt={"hearts"}
                      width={75}
                      height={75}
                      src={`/heart-left.png`}
                      className="absolute inline left-0 -top-5 z-40 animate__animated animate__heartBeat animate__infinite animate__slower"
                    />
                  </div>
                  <div
                    className={`flex w-[100%] justify-center shadow-md relative items-stretch z-20 ${
                      animateIn &&
                      "animate__animated animate__bounceInRight animate__slow"
                    }`}
                  >
                    <div
                      className={`bg-white p-4 w-[50%] text-${bgColor}-400 text-end h-[150px] flex items-center`}
                    >
                      <strong>Write your connection Message</strong>
                    </div>
                    <div
                      className={`bg-red-opacity w-[50%] flex justify-center`}
                    >
                      <img
                        src="/step2.png"
                        alt="Step 2"
                        className="w-[100%] object-contain"
                      />
                    </div>
                  </div>
                  <div
                    className={`flex w-[100%] justify-center shadow-md items-stretch z-10 relative ${
                      animateIn &&
                      "animate__animated animate__bounceInLeft animate__slower"
                    }`}
                  >
                    <div
                      className={`w-[50%] flex justify-center rounded-bl-lg`}
                    >
                      <img
                        src="/step3.png"
                        alt="Step 2"
                        className="w-[100%] object-contain"
                      />
                    </div>
                    <div
                      className={`bg-white p-4 w-[50%] text-${bgColor}-400 h-[100%] flex items-center rounded-br-lg`}
                    >
                      <strong>Insert your photo</strong>
                    </div>
                    <Image
                      alt={"hearts"}
                      width={75}
                      height={75}
                      src={`/heart-right.png`}
                      className="absolute inline right-0 bottom-0 animate__animated animate__heartBeat animate__infinite animate__slower animate__delay-2s"
                    />
                  </div>
                  <div className={`transition-1 w-[100%] mt-5`}>
                    <button
                      className={`text-center text-white p-5 bg-blue w-[100%] py-4 rounded-md transition-1 animate__animated animate__pulse animate__infinite animate__slow`}
                      onClick={async () => {
                        setAnimateOut(false);
                        setChar(5);
                        setSteps(4);
                      }}
                    >
                      <strong>Next</strong>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {steps === 4 && (
            <div
              className={`my-2 py-5 h-[100%] flex flex-col items-center z-10 ${
                animateIn2 && !animateOut
                  ? "animate__animated animate__fadeIn"
                  : "animate__animated animate__fadeOut"
              }`}
            >
              <Logo
                width={100}
                height={75}
                color={
                  bgColor === "red"
                    ? "#F78B93"
                    : bgColor === "yellow"
                    ? "#878684"
                    : "#FFF"
                }
                className={`my-5 transition-1`}
              />
              <h4
                className={`text-center px-5 text-${
                  bgColor === "red"
                    ? "red-500"
                    : bgColor === "yellow"
                    ? "yellow-500"
                    : "blue-500"
                } text-shadow-${
                  bgColor === "red"
                    ? "red"
                    : bgColor === "yellow"
                    ? "yellow"
                    : "blue"
                }`}
              >
                <b>Bestie mau bonding sama siapa nih?</b>
              </h4>
              <div className="w-[100%] p-5 relative z-10">
                <div className="input-icon">
                  <label
                    className={`flex flex-col text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                  >
                    Nama kamu
                    <input
                      type="text"
                      value={payload.sender}
                      className={`form-control transition-1`}
                      onChange={(e: any) => {
                        setPayload((prev: any) => ({
                          ...prev,
                          sender: e.target.value,
                        }));
                      }}
                      placeholder="Sender name"
                    />
                  </label>
                </div>

                <div className="input-icon">
                  <label
                    className={`flex flex-col text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                  >
                    Bestie kamu
                    <input
                      type="text"
                      value={payload.recipient}
                      className={`form-control transition-1`}
                      onChange={(e: any) => {
                        setPayload((prev: any) => ({
                          ...prev,
                          recipient: e.target.value,
                        }));
                      }}
                      placeholder="Recipient name"
                    />
                  </label>
                </div>

                <button
                  className={`text-center text-white p-5 bg-${bgColor} w-[100%] py-4  my-5 rounded-md transition-1`}
                  onClick={async () => {
                    if (payload.sender && payload.recipient) {
                      setAnimateIn2(false);
                      setAnimateOut(true);
                      await wait(1000);
                      setAnimateOut(false);
                      setAnimateIn2(true);
                      setSteps(5);
                      setError(false);
                    } else {
                      setError(true);
                    }
                  }}
                >
                  Start to create connection card
                </button>
              </div>
              <Image
                src={"/love.png"}
                width={200}
                height={200}
                alt="LOVE"
                className="absolute bottom-10 z-0 animate__animated animate__heartBeat animate__infinite animate__slower"
              />
            </div>
          )}
          {steps === 5 && (
            <>
              <div
                className={`mt-5 w-[100%] z-10 px-5 relative ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__fadeIn"
                    : "animate__animated animate__fadeOut"
                }`}
              >
                <div className="w-[100%]">
                  <button
                    className={`text-center bg-white rounded-xl shadow-sm py-2 px-5 text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                    onClick={() => {
                      setSteps(4);
                    }}
                  >
                    {"< Back"}
                  </button>
                </div>
                <div className="w-[100%] mt-1 text-center">
                  <Image
                    alt={"hearts"}
                    width={75}
                    height={75}
                    src={`/heart-left.png`}
                    className="absolute inline left-10 animate__animated animate__heartBeat animate__infinite animate__slower"
                  />
                  <Logo
                    width={75}
                    height={75}
                    color={
                      bgColor === "red"
                        ? "#F78B93"
                        : bgColor === "yellow"
                        ? "#878684"
                        : "#FFF"
                    }
                    className={`transition-1 inline`}
                  />
                  <Image
                    alt={"hearts"}
                    width={75}
                    height={75}
                    src={`/heart-right.png`}
                    className="absolute inline right-10 animate__animated animate__heartBeat animate__infinite animate__slower animate__delay-2s"
                  />
                </div>
                <h5
                  className={`text-center my-5 text-${
                    bgColor === "red"
                      ? "red-400"
                      : bgColor === "yellow"
                      ? "yellow-400"
                      : "blue-400"
                  }`}
                >
                  Write Your Message
                </h5>
                <div className="bg-white rounded-xl p-3 flex items-center justify-center">
                  <label className="w-[100%] flex justify-center items-center">
                    <textarea
                      value={payload.message}
                      placeholder="Write your message..."
                      rows={4}
                      className={`message-control transition-1 border-${
                        bgColor === "red"
                          ? "red"
                          : bgColor === "yellow"
                          ? "yellow"
                          : "blue"
                      }`}
                      onChange={(e: any) =>
                        setPayload((prev: any) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    className="mt-5"
                  >
                    {sampleItems.map((item: any, index: number) => (
                      <SwiperSlide className="p-1" key={index}>
                        <div
                          className={`rounded-2xl text-center py-5 transition-1 ${
                            activeIndex === index
                              ? "shadow-md border-2"
                              : "shadow-sm border-0"
                          } text-black bg-gradient w-[100%] shadow-md cursor-pointer`}
                          key={index}
                          onClick={() => handleMessage(index, item)}
                        >
                          <div className={`p-2 mx-2`}>
                            <Image
                              alt={item.title}
                              width={25}
                              height={25}
                              src={`/${item.image}`}
                              className="inline"
                            />
                          </div>

                          <h6>{item.title}</h6>
                          <p className="text-[10px] lg:text-[12px] px-2">
                            {item.message}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <Image
                    src={"/love.png"}
                    width={400}
                    height={400}
                    alt="LOVE"
                    className="absolute bottm-0 left-0 right-0 animate__animated animate__pulse animate__infinite animate__slower"
                  />
                </div>

                <button
                  className={`text-center text-white p-5 bg-${bgColor} w-[100%] py-4 my-5 rounded-md transition-1 relative z-10`}
                  onClick={async () => {
                    if (payload.message) {
                      setAnimateIn2(false);
                      setAnimateOut(true);
                      await wait(1000);
                      setAnimateOut(false);
                      setAnimateIn2(true);
                      setSteps(6);
                      setError(false);
                    } else {
                      setError(true);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {steps === 6 && (
            <div
              className={`mt-5 w-[100%] z-10 px-5 relative ${
                animateIn2 && !animateOut
                  ? "animate__animated animate__fadeIn"
                  : "animate__animated animate__fadeOut"
              }`}
            >
              <div className="w-[100%]">
                <button
                  className={`text-center bg-white rounded-xl shadow-sm py-2 px-5 text-${
                    bgColor === "red"
                      ? "red-400"
                      : bgColor === "yellow"
                      ? "yellow-400"
                      : "blue-400"
                  }`}
                  onClick={() => {
                    setSteps(5);
                  }}
                >
                  {"< Back"}
                </button>
              </div>
              <PhotoUpload
                onImageSelect={handleImageSelect}
                placeholderImg="/placeholder.png"
                color={bgColor}
                handleSubmit={handleSubmit}
                sender={payload.sender}
              />
            </div>
          )}
          {steps === 7 && (
            <div className="h-screen relative flex flex-col justify-center items-center overflow-hidden">
              <Logo
                width={200}
                height={100}
                color={
                  bgColor === "red"
                    ? "#F78B93"
                    : bgColor === "yellow"
                    ? "#878684"
                    : "#FFF"
                }
                className={`mb-5 `}
              />
              <LoadingProcess color={bgColor} />
              <Image
                src="/colors-of-connection.png"
                alt="Emina Logo"
                width={400}
                height={200}
                layout="responsive"
              />
            </div>
          )}
          {steps === 8 && (
            <div
              className={`flex flex-col justify-center items-center w-[100%] h-[100%] p-5 relative z-10`}
            >
              <div className="w-[100%] py-2 flex justify-betwee gap-3">
                <button
                  className={`text-center bg-white rounded-xl shadow-sm py-2 px-5 text-${
                    bgColor === "red"
                      ? "red-400"
                      : bgColor === "yellow"
                      ? "yellow-400"
                      : "blue-400"
                  }`}
                  onClick={async () => {
                    setSteps(6);
                    setAnimateIn2(true);
                    setAnimateOut(false);
                  }}
                >
                  {"< Back"}
                </button>
                <div
                  className={`text-center text-${bgColor}-400 bg-white w-[75%] py-4 rounded-xl transition-1 flex-1`}
                >
                  Your Card Preview
                </div>
              </div>

              <Logo
                width={100}
                height={50}
                color={
                  bgColor === "red"
                    ? "#F78B93"
                    : bgColor === "yellow"
                    ? "#878684"
                    : "#FFF"
                }
                className={`mb-5 mt-5 transition-1`}
              />
              <div className="px-5 relative text-center">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Card Image"
                    className={`w-[90%] aspect-square object-cover rounded-md m-auto border-2 border-${
                      bgColor === "red"
                        ? "red"
                        : bgColor === "yellow"
                        ? "yellow"
                        : "blue"
                    } ${animateIn && "animate__animated animate__zoomIn"}`}
                  />
                )}
                <Image
                  src={`/love.png`}
                  alt="Card Image"
                  width={100}
                  height={100}
                  className="absolute left-0 bottom-0 animate__animated animate__pulse animate__infinite animate__slow"
                />
              </div>

              <div
                className={`bg-white w-[100%] mt-5 px-3 py-2 rounded-md border-2 border-${
                  bgColor === "red"
                    ? "red"
                    : bgColor === "yellow"
                    ? "yellow"
                    : "blue"
                } ${
                  animateIn &&
                  "animate__animated animate__zoomIn animate__delay-2s"
                }`}
              >
                <h4 className={`${textColor}`}>
                  Dear <b className="capitalize">{payload?.recipient}</b>,
                </h4>
                <h4 className={`${textColor} mb-4`}>
                  <b className="capitalize">{payload?.sender}</b> send you a
                  connection card
                </h4>
                <svg
                  width="100%"
                  height="4"
                  viewBox="0 0 333 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    y1="0.612793"
                    x2="333"
                    y2="0.612793"
                    stroke="url(#paint0_linear_180_1481)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_180_1481"
                      x1="-21"
                      y1="1.11279"
                      x2="346"
                      y2="1.11298"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor={bgColor} stopOpacity="0" />
                      <stop offset="0.5" stopColor={bgColor} />
                      <stop offset="1" stopColor={bgColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className={`${textColor} py-5`}>{payload?.message}</p>
              </div>

              <button
                className={`text-center text-white mt-3 bg-${bgColor} w-[100%] py-4 rounded-md transition-1 ${
                  animateIn &&
                  "animate__animated animate__zoomIn animate__delay-3s"
                }`}
                onClick={() => setSteps(9)}
              >
                Send Your Card
              </button>
            </div>
          )}
          {steps === 9 && (
            <>
              <div className="w-[100%] p-4 absolute top-0 left-0 z-10">
                <button
                  className={`text-center bg-white rounded-xl shadow-sm py-2 px-5 text-${
                    bgColor === "red"
                      ? "red-400"
                      : bgColor === "yellow"
                      ? "yellow-400"
                      : "blue-400"
                  }`}
                  onClick={async () => {
                    setSteps(8);
                    setAnimateIn2(true);
                    setAnimateOut(false);
                  }}
                >
                  {"< Back"}
                </button>
              </div>
              <div className="flex flex-col items-center h-[100%] justify-center relative z-10 gap-3 w-[100%]">
                <Logo
                  width={150}
                  height={75}
                  color={
                    bgColor === "red"
                      ? "#F78B93"
                      : bgColor === "yellow"
                      ? "#878684"
                      : "#FFF"
                  }
                  className={`mb-5 transition-1`}
                />
                <Image
                  alt={"hearts"}
                  width={75}
                  height={75}
                  src={`/heart-left.png`}
                  className="absolute inline left-5 animate__animated animate__heartBeat animate__infinite animate__slower animate__delay-2s top-5"
                />
                <Image
                  alt={"hearts"}
                  width={75}
                  height={75}
                  src={`/heart-right.png`}
                  className="absolute inline right-5 animate__animated animate__heartBeat animate__infinite animate__slower animate__delay-3s top-5"
                />
                <div className="p-3 bg-white rounded-xl HpQrcode relative z-10 hidden">
                  <QRCode value={qrCodeUrl} size={200} className="hidden" />
                </div>
                <Image
                  src={"/love_letter.png"}
                  height={150}
                  width={150}
                  alt="Emina Letter"
                  className="animate__animated animate__swing animate__infinite animate__slower"
                />
                <div className="text-center px-4">
                  <h4
                    className={`text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                  >
                    Share your card
                  </h4>
                  <p
                    className={`text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                  >
                    Share your card with your beloved friends or family
                  </p>
                </div>
                <div className="px-4 w-[100%]">
                  <div className="flex w-[100%] gap-3">
                    <button
                      className={`bg-white w-[100%] py-3 px-4 rounded-md text-${
                        bgColor === "red"
                          ? "red-400"
                          : bgColor === "yellow"
                          ? "yellow-400"
                          : "blue-400"
                      }`}
                      type="button"
                      onClick={shareQR}
                    >
                      Share Link
                    </button>
                    <button
                      className={`bg-white w-[100%] py-3 px-4 rounded-md text-${
                        bgColor === "red"
                          ? "red-400"
                          : bgColor === "yellow"
                          ? "yellow-400"
                          : "blue-400"
                      }`}
                      type="button"
                      onClick={shareQRImage}
                    >
                      Share QR
                    </button>
                  </div>
                  <div className="text-center my-5">
                    <h3>
                      <span
                        className={`bg-white orline py-2 px-3 rounded-full  text-${
                          bgColor === "red"
                            ? "red-400"
                            : bgColor === "yellow"
                            ? "yellow-400"
                            : "blue-400"
                        }`}
                      >
                        Or
                      </span>
                    </h3>
                  </div>
                  <div className="flex w-[100%] gap-3">
                    <button
                      className={`text-white w-[100%] py-3 px-4 rounded-md bg-${
                        bgColor === "red"
                          ? "red"
                          : bgColor === "yellow"
                          ? "yellow"
                          : "blue"
                      }`}
                      type="button"
                      onClick={copyToClipboard}
                    >
                      {successMessage && <p>{successMessage}</p>}
                      {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                      )}
                      {!successMessage && !errorMessage && <>Copy Link</>}
                    </button>
                    <button
                      className={`text-white w-[100%] py-3 px-4 rounded-md bg-${
                        bgColor === "red"
                          ? "red"
                          : bgColor === "yellow"
                          ? "yellow"
                          : "blue"
                      }`}
                      type="button"
                      onClick={downloadQR}
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Index;
