import React, { useState, useEffect, FC } from "react";

interface ILoadingProcessProps {
  className?: string;
  color?: string;
}

const LoadingProcess: FC<ILoadingProcessProps> = ({ className, color }) => {
  const totalHearts = 5; // Total number of hearts
  const [filledHearts, setFilledHearts] = useState(
    Array(totalHearts).fill(false)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFilledHearts((prevFilledHearts) => {
        const allHeartsEmpty = prevFilledHearts.every((filled) => !filled);
        const newFilledHearts = prevFilledHearts.map((_, index) => {
          if (allHeartsEmpty) {
            // If all hearts are empty, only fill the first one
            return index === 0;
          } else {
            // Otherwise, fill the next empty heart
            const firstEmptyHeart = prevFilledHearts.findIndex(
              (filled) => !filled
            );
            return index <= firstEmptyHeart;
          }
        });
        return newFilledHearts;
      });
    }, 2000 / totalHearts); // The hearts fill every 2 seconds divided by the number of hearts

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      <h4 className={`text-center mb-2 tracking-widest text-${color}-400`}>
        Your Connection Card is still being processed
      </h4>
      <div className="loading-container justify-center">
        {filledHearts.map((filled, index) => (
          <div
            key={index}
            className={`drop-shadow-md heart ${filled ? "filled" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingProcess;
