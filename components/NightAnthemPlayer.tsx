"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const playlist = [
  {
    src: "/audio/too-many-nights.mp3",
    title: "too many nights"
  },
  {
    src: "/audio/5-to-10.mp3",
    title: "5 to 10"
  },
  {
    src: "/audio/new-drop.mp3",
    title: "new drop"
  }
];

const TARGET_VOLUME = 0.3;
const STORAGE_KEY = "innocent-nights-anthem";

type Track = (typeof playlist)[number];

export default function NightAnthemPlayer() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prefersSound, setPrefersSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedTrack(playlist[Math.floor(Math.random() * playlist.length)]);
    setPrefersSound(window.localStorage.getItem(STORAGE_KEY) === "on");
  }, []);

  useEffect(() => {
    if (!selectedTrack) {
      return;
    }

    const audio = new Audio(selectedTrack.src);
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = 0;
    audioRef.current = audio;

    audio.addEventListener("error", warnAudioFailure);

    return () => {
      cancelFade();
      audio.pause();
      audio.removeEventListener("error", warnAudioFailure);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [selectedTrack]);

  function warnAudioFailure() {
    if (process.env.NODE_ENV === "development") {
      console.warn("Night anthem failed to load:", selectedTrack?.src);
    }
  }

  function cancelFade() {
    if (fadeRef.current !== null) {
      window.cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }

  function fadeVolume(target: number, duration = 1100, afterFade?: () => void) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    cancelFade();
    const startVolume = audio.volume;
    const startTime = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = startVolume + (target - startVolume) * eased;

      if (progress < 1) {
        fadeRef.current = window.requestAnimationFrame(step);
        return;
      }

      fadeRef.current = null;
      afterFade?.();
    };

    fadeRef.current = window.requestAnimationFrame(step);
  }

  async function beginAnthem() {
    const audio = audioRef.current;
    if (!audio || !selectedTrack) {
      return;
    }

    try {
      cancelFade();
      audio.volume = Math.min(audio.volume, 0.04);
      await audio.play();
      setIsPlaying(true);
      setPrefersSound(true);
      window.localStorage.setItem(STORAGE_KEY, "on");
      fadeVolume(TARGET_VOLUME, 1300);
    } catch (error) {
      setIsPlaying(false);
      if (process.env.NODE_ENV === "development") {
        console.warn("Night anthem playback was blocked or failed:", error);
      }
    }
  }

  function stopAnthem() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    setIsPlaying(false);
    setPrefersSound(false);
    window.localStorage.setItem(STORAGE_KEY, "off");
    fadeVolume(0, 850, () => audio.pause());
  }

  function toggleAnthem() {
    if (isPlaying) {
      stopAnthem();
      return;
    }

    void beginAnthem();
  }

  const status = isPlaying ? "anthem" : prefersSound ? "ready" : "off";

  return (
    <motion.button
      className={`group fixed bottom-5 left-1/2 z-[75] flex -translate-x-1/2 items-center gap-3 rounded-full border px-3 py-2 pr-4 text-left font-mono text-[0.58rem] text-silver backdrop-blur-xl transition sm:left-auto sm:right-6 sm:translate-x-0 ${
        isPlaying
          ? "border-silver/44 bg-night/72 shadow-[0_0_46px_rgba(184,184,184,0.14)]"
          : "border-silver/18 bg-night/50 opacity-70 shadow-[0_18px_60px_rgba(0,0,0,0.42)] hover:opacity-100"
      }`}
      type="button"
      aria-label="Toggle soundtrack"
      aria-pressed={isPlaying}
      onClick={toggleAnthem}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-silver/22 bg-[radial-gradient(circle_at_35%_20%,rgba(184,184,184,0.22),rgba(13,13,13,0.42)_42%,rgba(13,13,13,0.92))] shadow-[inset_0_1px_0_rgba(184,184,184,0.22)]">
        <motion.span
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_110deg,transparent,rgba(184,184,184,0.5),transparent,rgba(175,195,214,0.18),transparent)] opacity-[0.55] blur-[0.5px]"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 24, repeat: Infinity, ease: "linear" } : { duration: 0.6 }}
        />
        <motion.span
          className="absolute inset-[-0.35rem] rounded-full border border-silver/12"
          animate={isPlaying ? { opacity: [0.18, 0.48, 0.18], scale: [1, 1.08, 1] } : { opacity: 0.16, scale: 1 }}
          transition={isPlaying ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
        />
        <Image
          src="/assets/brand/innocent-dagger.png"
          alt="innocent dagger symbol"
          width={1412}
          height={2116}
          className={`relative z-10 h-8 w-auto object-contain transition duration-500 ${
            isPlaying ? "opacity-90 drop-shadow-[0_0_12px_rgba(184,184,184,0.28)]" : "opacity-[0.48]"
          }`}
        />
      </span>

      <span className="relative z-10 flex min-w-16 flex-col leading-none">
        <span className="text-[0.68rem] text-silver/80">night sound</span>
        <span className="mt-1 text-[0.52rem] text-silver/42">{status}</span>
      </span>

      <span className="flex h-8 w-5 items-end justify-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((bar) => (
          <motion.span
            className="w-px rounded-full bg-silver/60"
            key={bar}
            animate={isPlaying ? { height: [7, 18 - bar * 3, 9, 15] } : { height: 5 }}
            transition={isPlaying ? { duration: 0.9 + bar * 0.16, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          />
        ))}
      </span>
    </motion.button>
  );
}
