import React from "react";

const tagImageMap = [
  { shape: "square", color: "purple", imageUrl: "/purpleS.png" },
  { shape: "circular", color: "purple", imageUrl: "/Cpurple.png" },
  { shape: "circular", color: "blue", imageUrl: "/Cblue.png" },
  { shape: "circular", color: "green", imageUrl: "/Cgreen.png" },
  { shape: "circular", color: "black", imageUrl: "/Cblack.png" },
  { shape: "square", color: "black", imageUrl: "/blackS.png" },
  { shape: "square", color: "blue", imageUrl: "/blueS.png" },
  { shape: "square", color: "green", imageUrl: "/greenS.png" },
  { shape: "circular-small", color: "purple", imageUrl: "/SCpurple.png" },
  { shape: "circular-small", color: "blue", imageUrl: "/SCblue.png" },
  { shape: "circular-small", color: "green", imageUrl: "/SCgreen.png" },
  { shape: "circular-small", color: "black", imageUrl: "/SCblack.png" },
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
