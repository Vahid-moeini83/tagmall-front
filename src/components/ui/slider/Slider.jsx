"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function Slider({
  min = 0,
  max = 100,
  value = [0, 100],
  onChange,
  className,
  ...props
}) {
  const [localValue, setLocalValue] = useState(value);
  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setDragging(index);
  };

  const handleMouseMove = (e) => {
    if (dragging === null || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    const newValue = Math.round(min + percent * (max - min));

    const newLocalValue = [...localValue];
    newLocalValue[dragging] = newValue;

    // Ensure min doesn't exceed max and vice versa
    if (dragging === 0 && newValue > localValue[1]) {
      newLocalValue[0] = localValue[1];
    } else if (dragging === 1 && newValue < localValue[0]) {
      newLocalValue[1] = localValue[0];
    } else {
      newLocalValue[dragging] = newValue;
    }

    setLocalValue(newLocalValue);
    onChange?.(newLocalValue);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, localValue]);

  const getPercent = (val) => ((val - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div
        ref={sliderRef}
        className="relative h-[0.5px] bg-black rounded-full cursor-pointer"
      >
        {/* Active range */}
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            left: `${getPercent(localValue[0])}%`,
            right: `${100 - getPercent(localValue[1])}%`,
          }}
        />

        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: `${getPercent(localValue[0])}%` }}
          onMouseDown={handleMouseDown(0)}
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
          </div>
        </div>

        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: `${getPercent(localValue[1])}%` }}
          onMouseDown={handleMouseDown(1)}
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
