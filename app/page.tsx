"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const palette = {
  night: "#0D0D0D",
  silver: "#B8B8B8",
  denim: "#AFC3D6",
  smoke: "#5A5A5A",
  burgundy: "#4A0F16"
};

const chapters = [
  {
    name: "desire.",
    line: "black wash denim. chrome weight. dangerous romance.",
    mood: "seductive darkness held under silver hardware.",
    accent: palette.burgundy,
    glow: "rgba(74, 15, 22, 0.38)"
  },
  {
    name: "dream.",
    line: "faded blue denim. moonlit softness. late-night memory.",
    mood: "the quiet ache of wanting more than sleep can hold.",
    accent: palette.denim,
    glow: "rgba(175, 195, 214, 0.22)"
  },
  {
    name: "manifest.",
    line: "identity. movement. ambition made visible.",
    mood: "a private symbol becoming a public myth.",
    accent: palette.silver,
    glow: "rgba(184, 184, 184, 0.16)"
  }
];

const archiveLines = [
  "lost luxury fashion archive",
  "late-night denim scripture",
  "chrome romance under matte black glass",
  "sleepless ambition in motion"
];

const particles = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 29) % 100}%`,
  top: `${(index * 47) % 100}%`,
  delay: (index % 9) * 0.42,
  size: 1 + (index % 3)
}));

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [signed, setSigned] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 18 });
  const audioRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 28 });
  const logoY = useTransform(smoothProgress, [0, 0.35], [0, 86]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.24], [1, 0.32]);

  const particleMarkup = useMemo(
    () =>
      particles.map((particle, index) => (
        <motion.span
          aria-hidden="true"
          className="absolute rounded-full bg-silver/45 blur-[0.5px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: [0, 0.55, 0.08],
            y: [-8, -34, -58],
            x: index % 2 === 0 ? [0, 7, -5] : [0, -8, 6]
          }}
          transition={{
            duration: 7 + (index % 6),
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          key={index}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size
          }}
        />
      )),
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1750);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((oscillator) => oscillator.stop());
      audioRef.current?.close();
    };
  }, []);

  function updateCursor(event: React.MouseEvent<HTMLElement>) {
    setCursor({
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100
    });
  }

  async function toggleAudio() {
    if (!audioRef.current) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      const context = new AudioCtor();
      const gain = context.createGain();
      const low = context.createOscillator();
      const high = context.createOscillator();

      low.type = "sine";
      high.type = "triangle";
      low.frequency.value = 48;
      high.frequency.value = 96;
      gain.gain.value = 0.0001;

      low.connect(gain);
      high.connect(gain);
      gain.connect(context.destination);
      low.start();
      high.start();

      audioRef.current = context;
      gainRef.current = gain;
      oscillatorsRef.current = [low, high];
    }

    await audioRef.current.resume();
    const next = !audioOn;
    gainRef.current?.gain.setTargetAtTime(next ? 0.018 : 0.0001, audioRef.current.currentTime, 0.08);
    setAudioOn(next);
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSigned(true);
  }

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-night text-silver"
      onMouseMove={updateCursor}
      style={{
        backgroundImage: `radial-gradient(circle at ${cursor.x}% ${cursor.y}%, rgba(184,184,184,0.10), transparent 18rem)`
      }}
    >
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-silver/70"
        style={{ scaleX: smoothProgress }}
      />

      <LoadingVeil loaded={loaded} />
      <Atmosphere particles={particleMarkup} />

      <button
        className="fixed right-5 top-5 z-50 border border-silver/20 bg-night/50 px-4 py-2 font-mono text-[0.58rem] text-silver/70 backdrop-blur-md transition hover:border-silver/45 hover:text-silver focus:outline-none focus:ring-1 focus:ring-silver/50"
        type="button"
        aria-label="toggle ambient sound"
        onClick={toggleAudio}
      >
        sound {audioOn ? "on" : "off"}
      </button>

      <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-20">
        <div className="absolute inset-0 bg-[url('/assets/dagger-mark.png')] bg-contain bg-center bg-no-repeat opacity-[0.055] blur-[1px]" />
        <div className="absolute inset-0 film-scanlines opacity-[0.08]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-silver/[0.035] blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.32, 0.16] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-night to-transparent" />

        <motion.div
          className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center"
          style={{ y: logoY, opacity: logoOpacity }}
          initial={{ opacity: 0, filter: "blur(18px)", y: 28 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.4, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative w-full max-w-[980px] overflow-hidden">
            <Image
              src="/assets/hero-logo.png"
              alt="innocent nights dagger logo"
              width={1100}
              height={360}
              priority
              className="relative z-10 h-auto w-full object-contain opacity-95 drop-shadow-[0_0_42px_rgba(184,184,184,0.10)]"
            />
            <div className="absolute inset-y-0 -left-1/3 z-20 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-silver/25 to-transparent blur-xl" />
          </div>

          <motion.p
            className="mt-8 font-editorial text-lg text-silver/82 sm:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.65 }}
          >
            manifest desire.
          </motion.p>
          <motion.p
            className="mt-6 font-mono text-[0.58rem] text-silver/48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.05 }}
          >
            coming soon
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-silver/38"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.35 }}
        >
          <span className="h-12 w-px bg-gradient-to-b from-silver/0 via-silver/40 to-silver/0" />
          <span className="font-mono text-[0.55rem]">archive opens</span>
        </motion.div>
      </section>

      <section className="relative px-5 py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-[0.58rem] text-silver/42">world introduction</p>
            <h1 className="mt-6 font-display text-5xl leading-[0.9] text-silver sm:text-7xl lg:text-8xl">
              innocent nights™
            </h1>
            <p className="mt-8 max-w-xl font-editorial text-xl leading-8 text-silver/64 sm:text-2xl sm:leading-10">
              a hidden fashion universe for desire, sleepless ambition, chrome romance, and beauty with danger.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="grid gap-4 sm:grid-cols-2">
            {archiveLines.map((line, index) => (
              <div className="chrome-panel min-h-36 p-6" key={line}>
                <span className="relative z-10 font-mono text-[0.55rem] text-silver/34">
                  0{index + 1}
                </span>
                <p className="relative z-10 mt-8 font-editorial text-xl leading-7 text-silver/76">{line}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-28 sm:py-40">
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl edge-rule opacity-70" />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-12 -z-10 w-[12rem] -translate-x-1/2 opacity-[0.08] mix-blend-screen sm:w-[18rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.08, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }}
        >
          <Image src="/assets/dagger-mark.png" alt="" width={170} height={410} className="h-auto w-full" />
        </motion.div>

        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[0.58rem] text-silver/42">collection chapters</p>
          <h2 className="mt-5 font-display text-5xl leading-none text-silver sm:text-7xl">
            desire. dream. manifest.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-editorial text-xl leading-8 text-silver/58">
            three emotional uniforms from one private mythology. black wash, faded blue, and the identity that moves through both.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-7xl gap-5 lg:grid-cols-3">
          {chapters.map((chapter, index) => (
            <ChapterCard chapter={chapter} index={index} key={chapter.name} />
          ))}
        </div>
      </section>

      <section className="relative px-5 py-24 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <Reveal className="relative overflow-hidden border border-silver/12 bg-night/60">
            <Image
              src="/assets/denim-archive.png"
              alt="innocent nights denim archive"
              width={1402}
              height={1122}
              className="h-full min-h-[440px] w-full object-cover opacity-70 saturate-[0.72] transition duration-1000 hover:scale-[1.025] hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/10 to-night/35" />
            <div className="absolute inset-0 film-scanlines opacity-[0.07]" />
          </Reveal>

          <Reveal delay={0.14} className="lg:pl-6">
            <p className="font-mono text-[0.58rem] text-silver/42">artifact study</p>
            <h2 className="mt-5 font-display text-5xl leading-none text-silver sm:text-7xl">the jean as relic.</h2>
            <div className="mt-10 space-y-7 font-editorial text-xl leading-8 text-silver/60">
              <p>baggy silhouettes, sacred hardware, stone shimmer, and patchwork symbols built for flash photography after midnight.</p>
              <p>black wash carries the wound. light blue carries the memory. chrome carries the obsession.</p>
            </div>
            <div className="mt-10 grid gap-3 font-mono text-[0.62rem] text-silver/44 sm:grid-cols-3">
              <span>chain details</span>
              <span>stone details</span>
              <span>patch details</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative px-5 py-28 sm:py-40">
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl edge-rule opacity-60" />
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[0.58rem] text-silver/42">coming soon</p>
          <h2 className="mt-5 font-display text-6xl leading-none text-silver sm:text-8xl">enter the night.</h2>
          <p className="mx-auto mt-8 max-w-xl font-editorial text-xl leading-8 text-silver/58">
            be first to witness the beginning.
          </p>

          <form className="mx-auto mt-12 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={submitEmail}>
            <input
              className="min-h-14 flex-1 border border-silver/18 bg-night/80 px-5 font-mono text-[0.7rem] text-silver outline-none backdrop-blur-md transition placeholder:text-silver/28 focus:border-silver/55 focus:shadow-[0_0_40px_rgba(184,184,184,0.08)]"
              type="email"
              required
              placeholder="email"
              aria-label="email"
            />
            <button
              className="min-h-14 border border-silver/28 bg-silver/10 px-8 font-mono text-[0.64rem] text-silver transition hover:border-silver/60 hover:bg-silver/16 focus:outline-none focus:ring-1 focus:ring-silver/50"
              type="submit"
            >
              enter
            </button>
          </form>
          <motion.p
            className="mt-6 font-mono text-[0.58rem] text-denim/58"
            animate={{ opacity: signed ? 1 : 0 }}
          >
            witness recorded.
          </motion.p>
        </Reveal>
      </section>

      <footer className="relative px-5 pb-12 pt-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-silver/10 pt-8 font-mono text-[0.58rem] text-silver/38 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>innocent nights™</p>
            <p className="mt-2 text-silver/26">manifest desire.</p>
          </div>
          <div className="flex gap-6">
            <a className="transition hover:text-silver" href="https://instagram.com" aria-label="instagram">
              instagram
            </a>
            <a className="transition hover:text-silver" href="https://tiktok.com" aria-label="tiktok">
              tiktok
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Atmosphere({ particles }: { particles: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-[-18%] top-[12%] h-[32rem] w-[32rem] animate-fog rounded-full bg-burgundy/18 blur-3xl" />
      <div className="absolute right-[-16%] top-[34%] h-[30rem] w-[30rem] animate-fog rounded-full bg-denim/10 blur-3xl [animation-delay:3s]" />
      <div className="absolute bottom-[-20%] left-[26%] h-[36rem] w-[36rem] rounded-full bg-silver/[0.035] blur-3xl" />
      <div className="absolute inset-0">{particles}</div>
    </div>
  );
}

function LoadingVeil({ loaded }: { loaded: boolean }) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-night"
      initial={{ opacity: 1 }}
      animate={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? "none" : "auto" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, filter: "blur(16px)", y: 16 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/assets/dagger-mark.png"
          alt=""
          width={170}
          height={410}
          className="mx-auto h-36 w-auto opacity-[0.72]"
          priority
        />
        <p className="mt-6 font-display text-4xl text-silver chrome-text">innocent nights™</p>
        <p className="mt-4 font-mono text-[0.58rem] text-silver/42">manifest desire.</p>
      </motion.div>
    </motion.div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34, filter: "blur(18px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ChapterCard({
  chapter,
  index
}: {
  chapter: (typeof chapters)[number];
  index: number;
}) {
  return (
    <motion.article
      className="chrome-panel group min-h-[31rem] p-7 sm:p-8"
      initial={{ opacity: 0, y: 44, filter: "blur(18px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 10%, ${chapter.glow}, transparent 16rem), linear-gradient(180deg, rgba(13,13,13,0.96), rgba(13,13,13,0.76))`
      }}
    >
      <div className="relative z-10 flex h-full min-h-[26rem] flex-col">
        <div className="flex items-center justify-between font-mono text-[0.55rem] text-silver/34">
          <span>chapter 0{index + 1}</span>
          <span style={{ color: chapter.accent }}>✦</span>
        </div>

        <div className="my-12 flex justify-center">
          <div className="relative h-28 w-28">
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ backgroundColor: chapter.glow }}
            />
            <Image
              src="/assets/dagger-mark.png"
              alt=""
              width={170}
              height={410}
              className="absolute left-1/2 top-1/2 h-32 w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.48] mix-blend-screen"
            />
          </div>
        </div>

        <h3 className="font-display text-6xl leading-none chrome-text sm:text-7xl" style={{ color: chapter.accent }}>
          {chapter.name}
        </h3>
        <p className="mt-7 font-mono text-[0.64rem] leading-6 text-silver/44">{chapter.line}</p>
        <p className="mt-auto pt-12 font-editorial text-xl leading-8 text-silver/58">{chapter.mood}</p>
      </div>
    </motion.article>
  );
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
