import { db } from "@/app/utils/firebase/firebaseConfig";
import Ellipse from "@/components/Ellipse";
import EllipseRevert from "@/components/EllipseRevert";
import lottieLetter from "@/public/letter.json";
import "animate.css";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, NextPage } from "next";
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
    };
    runAnimations();
  }, []);

  useEffect(() => {
    if (!data) {
      router.push("/");
    }
  }, [data]);

  console.log(steps);

  const textColor = `text-${
    data?.color === "red"
      ? "red-400"
      : data?.color === "yellow"
      ? "yellow-400"
      : "blue-400"
  }`;

  return (
    <div
      className={`relative z-10 flex flex-col max-h-screen  justify-between h-[100vh] items-center w-[100%] overflow-hidden animate__animated transition-1 animate__slow bg-${data?.color}-opacity`}
    >
      <Ellipse
        className="absolute top-0 right-0 transition-1 z-0"
        color={
          data?.color === "red"
            ? "#D97279"
            : data?.color === "yellow"
            ? "#F4DEA7"
            : "#9F85BB"
        }
      />
      <EllipseRevert
        className="absolute bottom-0 left-0 transition-1 z-0"
        color={
          data?.color === "red"
            ? "#D97279"
            : data?.color === "yellow"
            ? "#F4DEA7"
            : "#9F85BB"
        }
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
          <div className="px-10 relative">
            {data?.image_url && (
              <Image
                src={data?.image_url}
                alt="Card Image"
                width={200}
                height={200}
                layout="responsive"
                priority
                className={`aspect-square object-cover rounded-md border-2 border-${
                  data?.color === "red"
                    ? "red"
                    : data?.color === "yellow"
                    ? "yellow"
                    : "blue"
                } ${animateIn && "animate__animated animate__zoomIn"}`}
              />
            )}
            <Image
              src={`/ketupat.png`}
              alt="Card Image"
              width={100}
              height={100}
              className="absolute right-0 -bottom-5 animate__animated animate__pulse animate__infinite animate__delay-2s animate__slow"
            />
            <Image
              src={`/chatbubble.png`}
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
              animateIn && "animate__animated animate__zoomIn animate__delay-2s"
            }`}
          >
            <h4 className={`${textColor}`}>
              Dear <b>{data?.recipient}</b>
            </h4>
            <h4 className={`${textColor}`}>
              Its’ connection card from <b>{data?.sender}</b>
            </h4>
            <svg
              width="333"
              height="2"
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
                  <stop stopColor="#F78B93" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#F78B93" />
                  <stop offset="1" stopColor="#F78B93" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <p className={`${textColor} py-5`}>Message: {data?.message}</p>
          </div>
          <button
            className={`text-center text-white mt-5 bg-${
              data?.color
            } w-[100%] py-4 rounded-md transition-1 ${
              animateIn && "animate__animated animate__zoomIn animate__delay-3s"
            }`}
            onClick={() => router.push("/")}
          >
            Create Your Own Card
          </button>
        </div>
      )}
    </div>
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
