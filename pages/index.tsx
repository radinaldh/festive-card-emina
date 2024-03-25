"use client";

import { saveCardData, uploadImageAndGetURL } from "@/app/services/cardService";
import Ellipse from "@/components/Ellipse";
import EllipseRevert from "@/components/EllipseRevert";
import Logo from "@/components/Logo";
import PhotoUpload from "@/components/PhotoUpload";
import lottieChar from "@/public/character_intro.json";
import lottieSnake from "@/public/snake_ladder.json";
import lottieProducts from "@/public/products.json";
import "animate.css";
import { NextPage } from "next";
import Image from "next/image";
import QRCode from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import { TypeAnimation } from "react-type-animation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingHearts from "../components/LoadingHearts";

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
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  const [animateIn2, setAnimateIn2] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [animateOut2, setAnimateOut2] = useState<boolean>(false);
  const [renderAudio, setRenderAudio] = useState<boolean>(false);
  const [renderAudioBg, setRenderAudioBg] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("red");
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

      // Check if `image_url` is an instance of File
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
      setSteps(7);
      setAnimateOut(true);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      setSuccessMessage("URL copied successfully!"); // Add a success message
    } catch (error) {
      setErrorMessage("Error copying URL: " + error); // Add an error message
    } finally {
      // Optionally, clear any temporary messages after a short delay
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);
    }
  };

  useEffect(() => {
    if (renderAudioBg && audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, [renderAudioBg]);

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
    if (steps === 3) {
      const runsAnimations = async () => {
        await wait(4000);
        setAnimateOut(true);
        await wait(1000);
        setSteps(4);
        setAnimateOut(false);
      };
      runsAnimations();
    }
    if (steps === 7) {
      const runsAnimations = async () => {
        await wait(3000);
        setSteps(8);
        setAnimateIn(true);
      };
      runsAnimations();
    }
  }, [steps]);

  return (
    <>
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
              className={`animate__animated animate__slow ${
                animateOut ? "animate__fadeOutDownBig" : "animate__fadeInUpBig"
              }`}
            />
          </div>
        </div>
      )}
      {steps !== 0 && (
        <div
          className={`${
            steps !== 5 && "flex flex-col"
          } max-h-screen  justify-between h-[100vh] items-center w-[100%] overflow-hidden animate__animated relative transition-1 ${
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
                  width={100}
                  height={50}
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
                  width={200}
                  height={100}
                  className={`animate__animated animate__slow transition-1 ${
                    animateIn && "animate__zoomIn"
                  }`}
                />
              </div>
              <div
                className={`bg-white transition-1 ${
                  animateIn2 && !animateOut
                    ? "animate__animated animate__slow animate__fadeInUpBig bottom-0 relative h-[50vh] "
                    : !animateIn2 && !animateOut
                    ? "-bottom-[100%] absolute"
                    : !animateIn2 && animateOut
                    ? "animate__animated animate__slow animate__fadeOutDownBig"
                    : "-bottom-[100%] absolute"
                }  w-[100%] } `}
              >
                <div className="px-10 pt-10 pb-40 text-center text-black">
                  <div className="flex justify-evenly absolute -top-[10%] w-[100%] left-0">
                    <div
                      className={`bg-red-opacity cursor-pointer aspect-square rounded-lg ${
                        bgColor === "red" && "border-white border-4"
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
                      className={`bg-yellow-opacity cursor-pointer aspect-square rounded-lg ${
                        bgColor === "yellow" && "border-white border-4"
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
                      className={`bg-blue-opacity cursor-pointer aspect-square rounded-lg ${
                        bgColor === "blue" && "border-white border-4"
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
                  <h3 className="mt-5">Choose Your Color!</h3>
                  <p>
                    Explore a spectrum of possibilities and select the shade
                    that resonates with your inner self. Be authentic, be true.
                    Your unique journey in color begins here!
                  </p>
                  <button
                    className={`text-center text-white mt-5 bg-${bgColor} w-[100%] py-4 rounded-md transition-1`}
                    onClick={async () => {
                      if (audioRef.current) {
                        audioRef.current.play();
                        audioRef.current.volume = 0.2;
                      }
                      if (voiceRef.current) {
                        voiceRef.current.play();
                      }
                      setPayload((prev: any) => ({
                        ...prev,
                        color: bgColor,
                      }));
                      setAnimateIn2(false);
                      setAnimateOut(true);
                      await wait(1000);
                      setSteps(2);
                      setAnimateIn2(true);
                      setAnimateOut(false);
                      await wait(1000);
                      setRenderAudio(true);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
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
              {renderAudio && (
                <div
                  className={`text-bubble absolute top-32 z-10 text-black p-5 text-justify mt-16 mx-5 ${
                    animateOut && "animate__animated animate__fadeOut"
                  }`}
                >
                  <TypeAnimation
                    sequence={[
                      "Hello Bestie! Yay, it's festive moment!",
                      2000,
                      "Nggak terasa ya sudah ramadhan lagi",
                      1750,
                      "Saatnya build connection dengan orang terdekat kalian!",
                      1250,
                      "Yuk kreasikan connection card kamu bareng, EMINA!",
                    ]}
                    wrapper="span"
                    speed={80}
                    style={{ fontSize: "1em", display: "inline-block" }}
                  />
                </div>
              )}
              <Lottie
                loop
                animationData={lottieChar}
                play
                style={{ width: "100%", height: "95%" }}
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
              {renderAudio && (
                <audio
                  ref={voiceRef}
                  controls={false}
                  autoPlay
                  className="hidden"
                >
                  <source src="/voice_over.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {renderAudio && (
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
              )}
            </>
          )}
          {steps === 3 && (
            <Lottie
              loop={false}
              animationData={lottieSnake}
              play
              style={{ width: "100%", height: "100%" }}
              className={`absolute animate__animated animate__fast ${
                !animateOut ? "animate__fadeIn" : "animate__fadeOut"
              } bottom-0 top-0 left-0 right-0`}
            />
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
                    ? "red-400"
                    : bgColor === "yellow"
                    ? "yellow-400"
                    : "blue-400"
                }`}
              >
                Bestie mau bonding sama siapa nih?
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
                className="absolute bottom-10 z-0"
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
                    src={`/hearts-2.png`}
                    className="absolute inline left-10"
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
                    src={`/hearts.png`}
                    className="absolute inline right-10"
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
                  <Swiper
                    spaceBetween={15}
                    slidesPerView={3}
                    className="my-5"
                    centeredSlides={true}
                    navigation={true}
                    modules={[Navigation, Pagination]}
                    pagination={true}
                    autoHeight
                  >
                    {sampleItems.map((item: any, index: number) => (
                      <SwiperSlide
                        key={index}
                        onClick={() =>
                          setPayload((prev: any) => ({
                            ...prev,
                            message: item.message,
                          }))
                        }
                        className="cursor-pointer"
                      >
                        <div className="bg-white rounded-2xl text-center py-5 shadow-sm text-white bg-gradient h-[100%]">
                          <div className="border-white border-solid p-2 mx-4 rounded-lg border-2">
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
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute w-[100%] text-center top-0 z-0">
                    <Image
                      src={"/love.png"}
                      width={400}
                      height={400}
                      alt="LOVE"
                      className="inline"
                    />
                  </div>
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
              <div className="w-[100%] p-4 relative z-10 ">
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
              <div className="flex flex-col items-center justify-center relative z-10 gap-3 h-[100%] w-[100$]">
                <div className="p-3 bg-white rounded-xl HpQrcode">
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
                    onClick={downloadQR}
                  >
                    Download
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
                  <button
                    className={`bg-white w-[100%] py-3 px-4 rounded-md text-${
                      bgColor === "red"
                        ? "red-400"
                        : bgColor === "yellow"
                        ? "yellow-400"
                        : "blue-400"
                    }`}
                    type="button"
                    onClick={copyToClipboard}
                  >
                    Copy Link
                  </button>
                </div>
                {successMessage && (
                  <p className="success-message">{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Index;
