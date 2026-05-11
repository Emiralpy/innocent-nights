"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const palette = {
  night: "#0D0D0D",
  silver: "#B8B8B8",
  denim: "#AFC3D6",
  smoke: "#5A5A5A"
};

const memoryImages = [
  {
    src: "/assets/night-archive/ride-blur.jpg",
    alt: "blurred motorcycle at night",
    caption: "motion"
  },
  {
    src: "/assets/night-archive/private-world.jpg",
    alt: "emiralp kilic beside motorcycle",
    caption: "silence"
  },
  {
    src: "/assets/night-archive/after-ride.jpg",
    alt: "after ride on motorcycle",
    caption: "escape"
  },
  {
    src: "/assets/night-archive/moon-overlook.jpg",
    alt: "moonlit motorcycle overlook",
    caption: "memory"
  }
];

const manifesto = [
  "Not everybody understands the night.",
  "Some people fear it.\nSome people sleep through it.\nSome people distract themselves from it.",
  "But for me,\nthe night was always where everything felt real.",
  "I grew up around engines,\nchrome,\nmovement,\nsilence,\nheadlights,\nlong roads,\nand men that never really explained their emotions.",
  "My father was a biker.",
  "And somehow,\nwithout realizing it,\nthat world raised me too.",
  "The leather.\nThe cold air.\nThe late rides.\nThe freedom.\nThe danger.\nThe loneliness.\nThe masculinity.\nThe obsession with escape.",
  "I think innocent nights was born there.",
  "Not as fashion.",
  "As a feeling.",
  "This brand is the result of sleepless nights spent trying to understand myself without the noise of the world around me.",
  "No expectations.\nNo filters.\nNo pretending.",
  "Just me,\nthe darkness,\nmy thoughts,\nmy desires,\nmy fears,\nmy ambitions,\nand the version of myself I knew I could become.",
  "desire.\ndream.\nmanifest.",
  "Those words are not collections.",
  "They are phases of my life.",
  "desire is wanting more from life even when you do not know how to reach it yet.",
  "dream is escaping reality long enough to imagine who you truly are underneath everything.",
  "manifest is becoming that person in real life.",
  "innocent nights exists for the people who feel deeply but stay silent about it.",
  "The people who romanticize empty streets,\nheadlights,\nlate drives,\nchrome reflections,\nparking garages,\ncity lights,\nand the feeling of being awake while the rest of the world sleeps.",
  "This brand is about emotional freedom.",
  "About becoming yourself without asking for permission.",
  "About finding beauty in darkness without letting it destroy you.",
  "About chasing something bigger,\neven if nobody understands it yet.",
  "This is not just denim.",
  "This is every sleepless night that changed me."
];

const smoke = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 23) % 100}%`,
  delay: index * 0.37,
  width: 90 + (index % 5) * 34
}));

export default function NightArchivePage() {
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 72, damping: 26 });
  const heroY = useTransform(progress, [0, 0.25], [0, 120]);
  const heroScale = useTransform(progress, [0, 0.25], [1.08, 1.18]);
  const titleOpacity = useTransform(progress, [0, 0.2], [1, 0]);

  const smokeField = useMemo(
    () =>
      smoke.map((item, index) => (
        <motion.span
          aria-hidden="true"
          className="absolute h-px rounded-full bg-silver/20 blur-sm"
          key={index}
          style={{ left: item.left, top: item.top, width: item.width }}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: [0, 0.34, 0], x: [-24, 36, 84], y: [-4, -18, -8] }}
          transition={{
            duration: 8 + (index % 6),
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )),
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="normal-case relative isolate min-h-screen overflow-hidden bg-night text-silver">
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-silver/70"
        style={{ scaleX: progress }}
      />

      <motion.div
        className="fixed inset-0 z-[90] grid place-items-center bg-night"
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? "none" : "auto" }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
      >
        <div className="text-center">
          <p className="font-editorial text-sm text-silver/38">innocent nights™</p>
          <motion.p
            className="mt-5 font-display text-5xl text-silver sm:text-7xl"
            initial={{ opacity: 0, filter: "blur(18px)", y: 18 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            the night archive
          </motion.p>
        </div>
      </motion.div>

      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        <div className="absolute inset-0">{smokeField}</div>
        <div className="absolute left-[-20%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-denim/[0.07] blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-18%] h-[38rem] w-[38rem] rounded-full bg-silver/[0.04] blur-3xl" />
      </div>

      <a
        className="fixed left-5 top-5 z-50 border border-silver/14 bg-night/44 px-4 py-2 font-mono text-[0.58rem] text-silver/62 backdrop-blur-md transition hover:border-silver/38 hover:text-silver"
        href="/"
      >
        innocent nights™
      </a>

      <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-24">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <Image
            src="/assets/night-archive/ride-blur.jpg"
            alt="blurred motorcycle at night"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.48] grayscale contrast-125"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-night/72 via-night/44 to-night" />
        <div className="absolute inset-0 film-scanlines opacity-[0.08]" />
        <motion.div
          className="relative z-20 mx-auto max-w-4xl text-center"
          style={{ opacity: titleOpacity }}
          initial={{ opacity: 0, filter: "blur(22px)", y: 28 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[0.62rem] text-silver/48">innocent nights™</p>
          <h1 className="mt-8 font-display text-6xl leading-none text-silver sm:text-8xl lg:text-9xl">
            THE NIGHT ARCHIVE
          </h1>
          <p className="mt-8 font-editorial text-xl text-silver/70 sm:text-2xl">manifest desire.</p>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 z-20 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-silver/0 via-silver/34 to-silver/0" />
      </section>

      <section className="relative px-5 py-28 sm:py-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <Reveal className="max-w-md">
            <p className="font-mono text-[0.6rem] text-silver/40">private world</p>
            <h2 className="mt-6 font-display text-5xl leading-none text-silver sm:text-7xl">
              a son inside the silence.
            </h2>
            <p className="mt-8 font-editorial text-xl leading-9 text-silver/58">
              this is not brand mythology. this is the room behind it, the road under it, the feeling that stayed.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <PersonalImageFrame />
          </Reveal>
        </div>
      </section>

      <section className="relative px-5 py-28 sm:py-44">
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-5xl edge-rule opacity-60" />
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-24 text-center">
            <p className="font-mono text-[0.6rem] text-silver/40">the manifesto</p>
            <h2 className="mt-6 font-display text-5xl leading-none text-silver sm:text-7xl">
              Not as fashion. As a feeling.
            </h2>
          </Reveal>

          <div className="space-y-16 sm:space-y-20">
            {manifesto.map((paragraph, index) => (
              <ManifestoParagraph content={paragraph} index={index} key={index} />
            ))}
          </div>

          <Reveal className="mt-28 text-center">
            <p className="font-display text-5xl leading-none text-silver sm:text-7xl">innocent nights™</p>
            <p className="mt-7 font-editorial text-xl text-silver/62">manifest desire.</p>
            <p className="mt-12 font-editorial text-lg text-silver/46">— Emiralp Kilic</p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-28 sm:py-40">
        <Reveal className="mx-auto mb-14 max-w-3xl px-5 text-center">
          <p className="font-mono text-[0.6rem] text-silver/40">visual memory strip</p>
          <h2 className="mt-6 font-display text-5xl leading-none text-silver sm:text-7xl">
            chrome, roads, after midnight.
          </h2>
        </Reveal>

        <div className="relative mask-fade">
          <motion.div
            className="flex w-max gap-5 px-5"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          >
            {[...memoryImages, ...memoryImages].map((image, index) => (
              <figure
                className="relative h-[28rem] w-[18rem] overflow-hidden border border-silver/10 bg-night sm:h-[34rem] sm:w-[24rem]"
                key={`${image.src}-${index}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 18rem, 24rem"
                  className="object-cover opacity-[0.72] grayscale saturate-0 transition duration-700 hover:scale-[1.03] hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/30" />
                <figcaption className="absolute bottom-5 left-5 font-mono text-[0.62rem] text-silver/48">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative grid min-h-[80svh] place-items-center px-5 py-28 text-center">
        <div className="absolute inset-0 bg-[url('/assets/night-archive/moon-overlook.jpg')] bg-cover bg-center opacity-[0.12] grayscale" />
        <div className="absolute inset-0 bg-night/74" />
        <Reveal className="relative z-10 mx-auto max-w-4xl">
          <h2 className="font-display text-6xl leading-none text-silver sm:text-8xl">
            some nights change you forever.
          </h2>
          <p className="mt-12 font-display text-4xl text-silver/80 sm:text-5xl">innocent nights™</p>
          <p className="mt-6 font-editorial text-xl text-silver/54">manifest desire.</p>
        </Reveal>
      </section>
    </main>
  );
}

function PersonalImageFrame() {
  return (
    <figure className="relative min-h-[35rem] overflow-hidden border border-silver/12 bg-night shadow-[0_30px_120px_rgba(0,0,0,0.62)] sm:min-h-[46rem]">
      <Image
        src="/assets/night-archive/private-world.jpg"
        alt="emiralp kilic with motorcycle at night"
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover opacity-[0.78] grayscale contrast-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/24" />
      <div className="absolute inset-0 film-scanlines opacity-[0.08]" />
      <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <p className="font-display text-4xl text-silver sm:text-6xl">“for my innocent nights.”</p>
        <p className="mt-6 font-editorial text-lg text-silver/56">— Emiralp Kilic</p>
      </figcaption>
    </figure>
  );
}

function ManifestoParagraph({ content, index }: { content: string; index: number }) {
  const important = index === 0 || index === 7 || index === 9 || index === 26;

  return (
    <motion.p
      className={`whitespace-pre-line font-editorial leading-[1.8] text-silver ${
        important ? "text-3xl sm:text-5xl" : "text-xl text-silver/68 sm:text-2xl"
      }`}
      initial={{ opacity: 0, y: 34, filter: "blur(18px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.85, delay: Math.min(index * 0.015, 0.18), ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.p>
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
