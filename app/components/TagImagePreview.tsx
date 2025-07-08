import React from "react";

const tagImageMap = [
  { shape: "square", color: "purple", imageUrl: "/purpleS.png" },
  { shape: "circular", color: "purple", imageUrl: "/circlePurple.png" },
  { shape: "square", color: "black", imageUrl: "/blackS.png" },
  { shape: "square", color: "blue", imageUrl: "/blueS.png" },
];

type Props = {
  shape: string;
  color: string;
  className?: string;
  width?: number;
  height?: number;
};

export default function TagImagePreview({
  shape,
  color,
  className = "",
  width,
  height,
}: Props) {
  const match = tagImageMap.find(
    (img) =>
      img.shape.toLowerCase() === shape.toLowerCase() &&
      img.color.toLowerCase() === color.toLowerCase()
  );

  console.log("matchmatch", match);

  return match ? (
    <img
      src={match.imageUrl}
      alt={`Tag: ${shape} ${color}`}
      className={`object-contain ${className}`}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      }}
    />
  ) : (
    <div
      className={`bg-gray-200 text-gray-500 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      Sin preview
    </div>
  );
}
