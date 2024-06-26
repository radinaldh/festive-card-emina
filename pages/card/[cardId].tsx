import { db } from "@/app/utils/firebase/firebaseConfig";
import Logo from "@/components/Logo";
import lottieLetter from "@/public/letter.json";
import "animate.css";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";

interface ICardData {
  recipient: string;
  message: string;
  sender: string;
  image_url: string;
  color: string;
}

interface IProps {
  data: ICardData | null;
}

const CardPage: NextPage<IProps> = ({ data }) => {
  const router = useRouter();
  const [steps, setSteps] = useState<number>(0);
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  const wait = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  useEffect(() => {
    const runAnimations = async () => {
      await wait(2000);
      setSteps(1);
      setAnimateIn(true);
      await wait(2000);
      setAnimateIn(false);
    };
    runAnimations();
  }, []);

  useEffect(() => {
    if (!data) {
      router.push("/");
    }
  }, [data]);

  const textColor = `text-${
    data?.color === "red"
      ? "red-400"
      : data?.color === "yellow"
      ? "yellow-400"
      : "blue-400"
  }`;

  return (
    <>
      <Head>
        <title>
          Emina Festive Microsite - From {data?.sender} to {data?.recipient}
        </title>
      </Head>
      <div
        className={`relative z-10 flex flex-col min-h-screen justify-center items-center w-[100%] overflow-x-hidden animate__animated transition-1 animate__slow bg-${data?.color}-opacity`}
      >
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
        {steps === 0 && (
          <Lottie
            animationData={lottieLetter}
            style={{ width: "100%", height: "100%" }}
            className={`absolute top-0 left-0 bottom-0 right-0 z-10`}
            play
            loop
          />
        )}
        {steps === 1 && (
          <div
            className={`flex flex-col justify-center items-center w-[100%] h-[100%] p-5 relative z-10`}
          >
            <Logo
              width={100}
              height={50}
              color={
                data?.color === "red"
                  ? "#F78B93"
                  : data?.color === "yellow"
                  ? "#878684"
                  : "#FFF"
              }
              className={`mb-5 transition-1`}
            />
            <div className="px-5 relative text-center">
              {data?.image_url && (
                <img
                  src={data?.image_url}
                  alt="Card Image"
                  className={`w-[90%] aspect-square object-cover rounded-md m-auto border-2 border-${
                    data?.color === "red"
                      ? "red"
                      : data?.color === "yellow"
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
                data?.color === "red"
                  ? "red"
                  : data?.color === "yellow"
                  ? "yellow"
                  : "blue"
              } ${
                animateIn &&
                "animate__animated animate__zoomIn animate__delay-2s"
              }`}
            >
              <h4 className={`${textColor}`}>
                Dear <b className="capitalize">{data?.recipient}</b>,
              </h4>
              <h4 className={`${textColor} mb-4`}>
                <b className="capitalize">{data?.sender}</b> send you a
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
                    <stop stopColor={data?.color} stopOpacity="0" />
                    <stop offset="0.5" stopColor={data?.color} />
                    <stop offset="1" stopColor={data?.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <p className={`${textColor} py-5`}>{data?.message}</p>
            </div>
            <div className={`flex gap-4 justify-center items-stretch`}>
              <img
                alt="HeartLeft"
                width={50}
                src="/heart-left.png"
                className={`aspect-square object-contain ${
                  animateIn &&
                  "animate__animated animate__bounceInLeft animate__delay-3s"
                }`}
              />

              <a
                href="https://www.instagram.com/reel/C4u3fhtp0ik/?igsh=MW1sZ282aGowcTdnYw=="
                className={`bg-[#85E7E6] text-center mt-5 text-white text-shadow shadow-md w-[100%] py-4 px-5 rounded-md transition-1 animate__animated ${
                  animateIn
                    ? "animate__bounceInLeft animate__delay-3s"
                    : "animate__tada animate__infinite animate__slow"
                }`}
                target="_blank"
              >
                <strong>
                  Makeup <br /> inspo
                </strong>
              </a>
              <a
                href="https://www.instagram.com/reel/C4xCDdbJTtN/?igsh=OWcwcmdrdWt4ZGFt"
                className={`bg-[#FCBDCB] text-center mt-5 text-white text-shadow shadow-md w-[100%] py-4 px-5 rounded-md transition-1 animate__animated ${
                  animateIn
                    ? "animate__bounceInLeft animate__delay-3s"
                    : "animate__tada animate__infinite animate__slow"
                }`}
                target="_blank"
              >
                <strong>
                  OOTD <br /> inspo
                </strong>
              </a>
              <img
                alt="HeartRight"
                width={50}
                src="/heart-right.png"
                className={`aspect-square object-contain ${
                  animateIn &&
                  "animate__animated animate__bounceInRight animate__delay-3s"
                }`}
              />
            </div>
            <button
              className={`text-center text-white mt-5 bg-${
                data?.color
              } w-[100%] py-4 rounded-md transition-1 ${
                animateIn &&
                "animate__animated animate__zoomIn animate__delay-3s"
              }`}
              onClick={() => router.push("/")}
            >
              Create Your Own Card
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cardId = context.params?.cardId;

  if (typeof cardId !== "string") {
    // If cardId is not a string, then something went wrong with the routing
    return {
      notFound: true,
    };
  }

  const docRef = doc(db, "card", cardId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { notFound: true };
  }

  const data: ICardData = {
    recipient: docSnap.data().recipient,
    message: docSnap.data().message,
    sender: docSnap.data().sender,
    image_url: docSnap.data().image_url,
    color: docSnap.data().color,
  };

  return {
    props: {
      data,
    },
  };
};

export default CardPage;
