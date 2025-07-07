import React from "react";

const tagImageMap = [
  { shape: "square", color: "purple", imageUrl: "/purpleSqure.png" },
  { shape: "circular", color: "purple", imageUrl: "/circlePurple.png" },
  { shape: "square", color: "black", imageUrl: "/blackSqure.png" },
  { shape: "circular", color: "black", imageUrl: "/circleBlack.png" },
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
  width = 250,
  height = 250,
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
      style={{ width, height }}
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
