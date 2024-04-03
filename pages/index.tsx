"use client";

import { saveCardData, uploadImageAndGetURL } from "@/app/services/cardService";
import Ellipse from "@/components/Ellipse";
import EllipseRevert from "@/components/EllipseRevert";
import Logo from "@/components/Logo";
import PhotoUpload from "@/components/PhotoUpload";
import lottieChar from "@/public/character_intro.json";
import lottieProducts from "@/public/products.json";
import "animate.css";
import { NextPage } from "next";
import Image from "next/image";
import QRCode from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import LoadingHearts from "../components/LoadingHearts";
import Head from "next/head";
import moment from "moment";

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
    image: "happy.png", // Random animal image
    title: "Happy",
    message: "Just a random happy animal.",
  },
  {
    image: "funny.png", // Random nature image
    title: "Joyful",
    message: "Nature is always a joy to look at.",
  },
  {
    image: "warm.png", // Random architecture image
    title: "Inspiring",
    message: "Architecture can inspire us in many ways.",
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
  const [bgColor, setBgColor] = useState<string>("red");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [payload, setPayload] = useState<IPayload>(initialPayload);
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
          text: "I wanted to share this card with you:",
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
          text: "Check out this connection card I made using from Emina",
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
      setSuccessMessage("URL copied successfully!");
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
        "Hello Bestie! Yay, it's festive moment!",
        "Nggak terasa ya sudah ramadhan lagi",
        ["Saatnya build connection dengan", "orang terdekat kalian!"],
        ["Yuk kreasikan connection card", "kamu bareng, EMINA!"],
      ];
      for (let i = 0; i < messages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
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
            steps !== 8 ? "justify-between" : "justify-center"
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
          <Ellipse
            className="absolute top-0 right-0 transition-1 z-0"
            color={
              bgColor === "red"
                ? "#D97279"
                : bgColor === "yellow"
                ? "#F4DEA7"
                : "#9F85BB"
            }
          />
          <EllipseRevert
            className="absolute bottom-0 left-0 transition-1 z-0"
            color={
              bgColor === "red"
                ? "#D97279"
                : bgColor === "yellow"
                ? "#F4DEA7"
                : "#9F85BB"
            }
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
                      ? "#F4DEA7"
                      : "#8CB9EA"
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
                className={`bg-white transition-1 absolute ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInUpBig h-[30vh] bottom-0"
                    : !animateIn2 && !animateOut
                    ? "-bottom-[100%]"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutDownBig"
                    : "-bottom-[100%]"
                }  w-[100%] } `}
              >
                <div className="px-10 pt-10 pb-40 text-center text-black">
                  <div className="flex justify-evenly absolute md:-top-[10%] -top-[20%] w-[100%] left-0">
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
                      className={`bg-blue-opacity cursor-pointer aspect-square rounded-lg transition-half ${
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
                    ? "#F4DEA7"
                    : "#8CB9EA"
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
                      className="text-bubble p-5 text-end animate__animated animate__fadeIn"
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
                      className="text-bubble p-5 text-end animate__animated animate__fadeIn"
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
                className={`absolute bottom-10 z-0 right-2 ${
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
                className={`text-center text-white m-5 p-5 bg-${bgColor} w-[80%] py-4 rounded-md transition-1 absolute bottom-0 ${
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
            <div
              className={`animate__animated animate__slow relative w-[100%] ${
                char === 0 ? "animate__fadeIn" : char > 6 && "animate__fadeOut"
              } `}
              onClick={() => setChar((i: any) => i + 1)}
            >
              <img src="/snakeBg.png" className="w-[100%]" alt="emina" />
              <img
                src="/char.png"
                className={`absolute w-[30%] transition-1 ${
                  char === 0
                    ? "bottom-[7%] left-2"
                    : char === 1
                    ? "bottom-[7%] left-[65%]"
                    : char === 2
                    ? "bottom-[26%] left-[65%]"
                    : char === 3
                    ? "bottom-[26%] left-2"
                    : char === 4
                    ? "bottom-[49%] left-2"
                    : char === 5
                    ? "bottom-[49%] left-[65%]"
                    : char === 6
                    ? "bottom-[74%] left-[65%]"
                    : "bottom-[74%] left-2"
                }`}
                alt="emina char"
              />
              <div className="absolute bottom-3 w-[100%] px-5">
                <button
                  className={`text-center text-white p-5 bg-${bgColor} w-[100%] py-4 rounded-md transition-1 animate__animated animate__pulse animate__infinite`}
                >
                  <strong>Tap the screen!</strong>
                </button>
              </div>
            </div>
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
                    ? "#F4DEA7"
                    : "#8CB9EA"
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
                        ? "#F4DEA7"
                        : "#8CB9EA"
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
                  <label className="w-[100%]">
                    <textarea
                      value={payload.message}
                      placeholder="Write your message..."
                      rows={3}
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
                  <div className="flex justify-center items-stretch gap-3 w-[100%] my-4">
                    {sampleItems.map((item: any, index: number) => (
                      <div
                        className={`rounded-2xl text-center py-5 transition-1 ${
                          activeIndex === index ? "shadow-xl" : "shadow-sm"
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
                        <p className="text-[10px] lg:text-[12px]">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>

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
            <Lottie
              loop
              animationData={lottieProducts}
              play
              style={{ width: "100%", height: "100%" }}
              className={`absolute top-0 left-0 right-0 bottom-0`}
            />
          )}
          {steps === 8 && (
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
                    setSteps(6);
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
                      ? "#F4DEA7"
                      : "#8CB9EA"
                  }
                  className={`mb-5 transition-1`}
                />
                <Image
                  alt={"hearts"}
                  width={75}
                  height={75}
                  src={`/heart-left.png`}
                  className="absolute inline left-5 animate__animated animate__heartBeat animate__infinite animate__slower top-5"
                />
                <Image
                  alt={"hearts"}
                  width={75}
                  height={75}
                  src={`/heart-right.png`}
                  className="absolute inline right-5 animate__animated animate__heartBeat animate__infinite animate__slower animate__delay-2s top-5"
                />
                <div className="p-3 bg-white rounded-xl HpQrcode relative z-10">
                  <QRCode value={qrCodeUrl} size={200} className="" />
                </div>
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
                      {successMessage && (
                        <p className="success-message">{successMessage}</p>
                      )}
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
                      Download Image
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
