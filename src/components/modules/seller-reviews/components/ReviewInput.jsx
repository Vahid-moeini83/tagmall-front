"use client";

import { useEffect, useRef, useState } from "react";
import { StarIcon } from "@/icons";
import { ScanLineIcon } from "lucide-react";
import Image from "next/image";

export default function ReviewInput({
  userAvatar,
  onSubmit,
  isEditMode = false,
  isReportMode = false,
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFileMode, setIsFileMode] = useState(false);
  const [file, setFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync textarea height with comment
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsFileMode(true);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsFileMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (rating > 0 && (comment.trim() || file)) {
      onSubmit({ rating, comment, file });
      setRating(0);
      setComment("");
      setFile(null);
      setIsFileMode(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-end gap-2 max-w-[500px] mx-auto w-full">
      {/* Review input box */}
      <div className="flex-1 bg-gray-200 rounded-xl p-[5px] flex flex-col gap-2">
        {/* Stars */}
        <div className="flex items-center justify-center gap-7 lg:gap-[30px] bg-white py-2 rounded-lg px-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoveredRating || rating);
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-200"
              >
                {isActive ? (
                  <StarIcon className="text-yellow-600 w-5 h-5 lg:w-6 lg:h-6" />
                ) : ( 
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lg:w-6 lg:h-6"
                  >
                    <path
                      d="M17.66 22.6698C17.13 22.6698 16.45 22.4998 15.6 21.9998L12.61 20.2298C12.3 20.0498 11.7 20.0498 11.4 20.2298L8.4 21.9998C6.63 23.0498 5.59 22.6298 5.12 22.2898C4.66 21.9498 3.94 21.0798 4.41 19.0798L5.12 16.0098C5.2 15.6898 5.04 15.1398 4.8 14.8998L2.32 12.4198C1.08 11.1798 1.18 10.1198 1.35 9.59982C1.52 9.07982 2.06 8.15982 3.78 7.86982L6.97 7.33982C7.27 7.28982 7.7 6.96982 7.83 6.69982L9.6 3.16982C10.4 1.55982 11.45 1.31982 12 1.31982C12.55 1.31982 13.6 1.55982 14.4 3.16982L16.16 6.68982C16.3 6.95982 16.73 7.27982 17.03 7.32982L20.22 7.85982C21.95 8.14982 22.49 9.06982 22.65 9.58982C22.81 10.1098 22.91 11.1698 21.68 12.4098L19.2 14.8998C18.96 15.1398 18.81 15.6798 18.88 16.0098L19.59 19.0798C20.05 21.0798 19.34 21.9498 18.88 22.2898C18.63 22.4698 18.23 22.6698 17.66 22.6698ZM12 18.5898C12.49 18.5898 12.98 18.7098 13.37 18.9398L16.36 20.7098C17.23 21.2298 17.78 21.2298 17.99 21.0798C18.2 20.9298 18.35 20.3998 18.13 19.4198L17.42 16.3498C17.23 15.5198 17.54 14.4498 18.14 13.8398L20.62 11.3598C21.11 10.8698 21.33 10.3898 21.23 10.0598C21.12 9.72983 20.66 9.45982 19.98 9.34982L16.79 8.81982C16.02 8.68982 15.18 8.06982 14.83 7.36982L13.07 3.84982C12.75 3.20982 12.35 2.82982 12 2.82982C11.65 2.82982 11.25 3.20982 10.94 3.84982L9.17 7.36982C8.82 8.06982 7.98 8.68982 7.21 8.81982L4.03 9.34982C3.35 9.45982 2.89 9.72983 2.78 10.0598C2.67 10.3898 2.9 10.8798 3.39 11.3598L5.87 13.8398C6.47 14.4398 6.78 15.5198 6.59 16.3498L5.88 19.4198C5.65 20.4098 5.81 20.9298 6.02 21.0798C6.23 21.2298 6.77 21.2198 7.65 20.7098L10.64 18.9398C11.02 18.7098 11.51 18.5898 12 18.5898Z"
                      fill="#353535"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* File preview (if file selected) */}
        {isFileMode && file && (
          <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg">
            <span className="text-xs text-gray-600 truncate max-w-[200px]">
              {file.name}
            </span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-error-medium"
            >
              ×
            </button>
          </div>
        )}

        {/* Comment input and actions */}
        <div className="flex items-center gap-2 px-1">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="تجربه خرید شما از فروشنده"
            rows={1}
            className="font-iransans placeholder:text-gray-400 placeholder:text-sm placeholder:text-center placeholder:pr-5 text-gray-600 min-h-12 py-3 px-2 flex-1 bg-transparent border-none outline-none resize-none overflow-hidden leading-6"
            // style={{ minHeight: "48px" }}
          />

          <div className="flex items-center gap-2 shrink-0">
            {/* Scan/Scan Line icon for file upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
            {!comment.trim() && !file && !isEditMode && !isReportMode ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <ScanLineIcon size={24} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={rating === 0 && !comment.trim() && !file}
                className={`font-iransans text-sm transition-colors cursor-pointer ${
                  comment.trim() || file ? "text-primary" : "text-gray-400"
                }`}
              >
                ارسال
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
