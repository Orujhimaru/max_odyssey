import { useState, useEffect } from "react";

export const useCountUp = (end, duration = 1500, start = 0) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const easing = (t) => 1 - Math.pow(1 - t, 4); // CSS ease-out quartic

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      if (progress < 1) {
        const easedProgress = easing(progress);
        setCount(Math.floor(easedProgress * (end - start) + start));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};
