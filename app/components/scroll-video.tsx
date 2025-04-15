import React, { useEffect, useRef } from "react";
import "../../styles/scrollVideo.css";
import { t } from "i18next";

export default function ScrollVideo() {
  const videoRef = useRef(null);
  const textsRef = useRef([]);

  useEffect(() => {
    const video = videoRef.current;

    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const scrollFraction = scrollY / maxScroll;

      if (video.duration) {
        const currentTime = scrollFraction * video.duration;
        video.currentTime = currentTime;
        updateTexts(currentTime);
      }
    };

    const updateTexts = (currentTime) => {
      textsRef.current.forEach((text) => {
        const start = parseFloat(text.dataset.timeStart);
        const end = parseFloat(text.dataset.timeEnd);

        // Calcular progreso de aparición/desaparición
        let opacity = 0;
        if (currentTime >= start && currentTime <= end) {
          opacity =
            1 - Math.abs(currentTime - (start + end) / 2) / ((end - start) / 2);
        }

        text.style.opacity = Math.min(Math.max(opacity, 0), 1);
        text.style.transform = `translateY(${20 - opacity * 20}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hidden md:block video-section">
      <div className="video-overlay">
        <video
          ref={videoRef}
          className="scroll-video"
          muted
          playsInline
          preload="metadata"
        >
          <source
            src="https://chap-blue.s3.us-east-2.amazonaws.com/2796082-uhd_3840_2160_25fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay reinstalado */}
        <div className="video-overlay-filter"></div>

        {/* Textos con tiempos ajustados */}
        <div
          className="story-text"
          data-time-start="0"
          data-time-end="5"
          data-position="left"
          ref={(el) => (textsRef.current[0] = el)}
          style={{ fontFamily: "chapFont" }}
          dangerouslySetInnerHTML={{ __html: t("scrollVideo.scroll.text1") }}
        />
        <div
          className="story-text"
          data-time-start="5"
          data-time-end="7"
          ref={(el) => (textsRef.current[1] = el)}
          data-position="right"
          dangerouslySetInnerHTML={{ __html: t("scrollVideo.scroll.text2") }}
          style={{ fontFamily: "chapFont" }}
        />
        <div
          className="story-text"
          data-time-start="7"
          data-time-end="9"
          data-position="left"
          ref={(el) => (textsRef.current[2] = el)}
          dangerouslySetInnerHTML={{ __html: t("scrollVideo.scroll.text3") }}
          style={{ fontFamily: "chapFont" }}
        />

        {/* <div
          className="story-text"
          data-time-start="0"
          data-time-end="4"
          data-position="left"
          ref={(el) => (textsRef.current[0] = el)}
          style={{ fontFamily: "chapFont" }}
        >
          Tu perro <strong className="text-color-bg">es único</strong>. Su Dog
          Tag también. 🐾✨
        </div>
        <div
          className="story-text"
          data-time-start="3"
          data-time-end="7"
          data-position="right"
          ref={(el) => (textsRef.current[1] = el)}
          style={{ fontFamily: "chapFont" }}
        >
          El mundo puede ser enorme, pero con un{" "}
          <strong className="text-color-bg">simple escaneo</strong>,
          <br /> siempre sabrás dónde está.
        </div>
        <div
          className="story-text"
          data-time-start="6"
          data-time-end="10"
          data-position="left"
          ref={(el) => (textsRef.current[2] = el)}
          style={{ fontFamily: "chapFont" }}
        >
          Todo su <strong className="text-color-bg">cuidado</strong>, sus{" "}
          <strong className="text-color-bg-2">aventuras</strong>, su{" "}
          <strong className="text-color-bg-3">historia...</strong> al alcance de
          tu mano.
        </div> */}
        {/* <div
          className="story-text"
          data-time-start="9"
          data-time-end="13"
          ref={(el) => (textsRef.current[3] = el)}
        >
          Porque cuando se trata de proteger lo que amas, nada es demasiado. 🚀
        </div>
        <div
          className="story-text"
          data-time-start="12"
          data-time-end="16"
          ref={(el) => (textsRef.current[4] = el)}
          style={{ fontFamily: "chapFont" }}
        >
          Dog Tags inteligentes: seguridad, amor y conexión en cada paso que
          dan. 💫
        </div> */}
      </div>
    </div>
  );
}
