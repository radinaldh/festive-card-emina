import React, { useState, useEffect, FC } from "react";

interface ILoadingHeartsProps {
  className?: string;
}

const LoadingHearts: FC<ILoadingHeartsProps> = ({ className }) => {
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
      <h2 className="text-center mb-2 tracking-widest">Loading...</h2>
      <div className="loading-container">
        {filledHearts.map((filled, index) => (
          <div key={index} className={`heart ${filled ? "filled" : ""}`} />
        ))}
      </div>
    </div>
  );
};

export default LoadingHearts;
