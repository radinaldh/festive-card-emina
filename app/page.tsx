"use client";
import Image from "next/image";
import LoadingHearts from "../components/LoadingHearts.client";
import "animate.css";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import Ellipse from "@/components/Ellipse";
import Lottie from "react-lottie-player";
import lottieChar from "@/public/character_intro.json";
import lottieSnake from "@/public/snake_ladder.json";
import { TypeAnimation } from "react-type-animation";
import EllipseRevert from "@/components/EllipseRevert";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
interface IPayload {
  sender: string;
  recipient: string;
  message: string;
  image_url: string;
}

const initialPayload = {
  sender: "",
  recipient: "",
  message: "",
  image_url: "",
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

export default function Home() {
  const [steps, setSteps] = useState(0);
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  const [animateIn2, setAnimateIn2] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [animateOut2, setAnimateOut2] = useState<boolean>(false);
  const [renderAudio, setRenderAudio] = useState<boolean>(false);
  const [renderAudioBg, setRenderAudioBg] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("red");
  const [payload, setPayload] = useState<IPayload>(initialPayload);
  const wait = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (renderAudioBg && audioRef.current) {
      audioRef.current.play();
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
      const runsAnimations2 = async () => {
        await wait(4000);
        setAnimateOut(true);
        await wait(1000);
        setSteps(4);
        setAnimateOut(false);
      };
      runsAnimations2();
    }
  }, [steps]);

  return (
    <main>
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
            animateIn ? "animate__fadeIn block" : "hidden"
          } animate__slow bg-${bgColor}-opacity`}
        >
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
            <div className="flex flex-col">
              <div
                className={`flex flex-col justify-center place-items-center h-[100%] pt-20 transition-1 ${
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
                <div className="p-10 text-center text-black">
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
                      setAnimateIn2(false);
                      setAnimateOut(true);
                      await wait(2000);
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
                <audio controls={false} autoPlay className="hidden">
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
              } bottom-0`}
            />
          )}
          {steps === 4 && (
            <div
              className={`my-16 py-5 h-[100%] flex flex-col justify-center items-center z-10 ${
                animateIn2 && !animateOut
                  ? "animate__animated animate__fadeIn"
                  : "animate__animated animate__fadeOut"
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
                className={`mb-16 transition-1`}
              />
              <h3
                className={`text-center text-${
                  bgColor === "red"
                    ? "red-400"
                    : bgColor === "yellow"
                    ? "yellow-400"
                    : "blue-400"
                }`}
              >
                Bestie mau bonding sama siapa nih?
              </h3>
              <div className="w-[100%] p-5">
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
                    />
                  </label>
                </div>
                <button
                  className={`text-center text-white p-5 bg-${bgColor} w-[100%] py-4 rounded-md transition-1`}
                  onClick={async () => {
                    setAnimateIn2(false);
                    setAnimateOut(true);
                    await wait(1000);
                    setAnimateOut(false);
                    setAnimateIn2(true);
                    setSteps(5);
                  }}
                >
                  Start to create connection card
                </button>
              </div>
              <Image src={"/love.png"} width={200} height={200} alt="LOVE" />
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
                              width={50}
                              height={50}
                              src={`/${item.image}`}
                              className="inline"
                            />
                          </div>

                          <h6>{item.title}</h6>
                          <p className="text-[12px]">{item.message}</p>
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
                  className={`text-center text-white p-5 bg-${bgColor} w-[100%] py-4 rounded-md transition-1 relative z-10`}
                  onClick={async () => {
                    setAnimateIn2(false);
                    setAnimateOut(true);
                    await wait(1000);
                    setSteps(6);
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
