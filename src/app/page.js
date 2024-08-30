"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "./page.module.css";

import localFont from "next/font/local";

// Font files can be colocated inside of `pages`
const TT_NEORIS = localFont({
  src: "../../public/fonts/TT_Neoris_Variable.woff2",
});
const SQUEEZY = localFont({ src: "../../public/fonts/SqueezyVF.woff2" });

export default function Home() {
  // ANIMATION SPEED (smaller = faster)
  const speed = 7;

  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState("400");
  const [renderedLetters, setRenderedLetters] = useState([currentLetter]);
  const [renderedLettersWidths, setRenderedLettersWidths] = useState([]);
  const [positionValues, setpositionValues] = useState({});

  const [positionX, setPositionX] = useState(400);
  const [animationDirection, setAnimationDirection] = useState("forward");

  const [count, setCount] = useState();

  const themes = ["black", "red", "yellowGreen", "yellowBlue"];

  const [theme, setTheme] = useState(0);

  const changeTheme = () => {
    if (theme === themes.length - 1) {
      setTheme(0);
    } else {
      setTheme(theme + 1);
    }
  };

  // const snappedWidths = [400, 430, 460, 490, 520, 550, 580, 610, 640, 670, 700];
  const snappedWidths = [400, 450, 500, 550, 600, 650, 700];

  const heroLetterSet = [
    "A",
    "B",
    "C",
    "G",
    "H",
    "J",
    "K",
    "L",
    "O",
    "P",
    "R",
    "S",
    "U",
    "V",
    "X",
    "Y",
    "Z",
  ];

  const currentLetterRef = useRef(null);
  const variableLinesSectionRef = useRef(null);
  const mainContainer = useRef();

  const min = 0.6080125;
  const max = 1.0880125;

  useEffect(() => {
    let center = window.innerWidth / 2;

    let height = currentLetterRef.current.getBoundingClientRect().height;
    const ratio = 300 / ((height * max - height * min) / 2);

    const handleAnimation = (width) => {
      // console.log(width);

      const snappedWidth = snappedWidths.reduce(function (prev, curr) {
        return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
      });

      setSnappedWidth(snappedWidth);
      setCurrentWidth(width);

      // console.log(width, snappedWidth, currentLetter);
      // if (width >= 400 && width <= 700) {
      //   setCurrentWidth(width);
      // }
    };

    const handleResize = () => {
      center = window.innerWidth / 2;
      height = currentLetterRef.current.getBoundingClientRect().height;
    };

    // OLD APPROACH
    // ------------

    // setTimeout(() => {
    //   if (positionX <= 400) {
    //     setAnimationDirection("forward");
    //   }

    //   if (positionX >= 700) {
    //     setAnimationDirection("backward");
    //   }

    //   if (animationDirection === "forward") {
    //     setPositionX(positionX + 1);
    //   } else if (animationDirection === "backward") {
    //     setPositionX(positionX - 1);
    //   }
    //   handleAnimation(positionX);
    //   // console.log(animationDirection, positionX);
    // }, speed);

    // NEW APPROACH
    // ------------

    const easeOutQuad = (t) => t * (2 - t);
    const frameDuration = 1000 / 60;
    const countTo = 300;
    const duration = 5000;

    let frame = 0;
    const totalFrames = Math.round(duration / frameDuration);
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      // let progress = frame / totalFrames;

      setCount(countTo * progress);
      setPositionX(400 + count);
      setPositionX(countTo * progress);
      console.log(countTo * progress);
      console.log(positionX);

      if (frame === totalFrames) {
        frame = 0;
      }
      handleAnimation(positionX);
      console.log(positionX, count, progress);
    }, frameDuration);

    window.addEventListener("resize", handleResize);
  });

  // console.log(Math.floor(count));

  useEffect(() => {
    handleAnimation(positionX);
  }, [positionValues.positionX]);

  // RANDOM LETTERS
  useEffect(() => {
    const random = () => {
      return Math.floor(Math.random() * heroLetterSet.length);
    };

    setCurrentLetter(heroLetterSet[random()]);
    setRenderedLetters((v) => [...v, currentLetter]);
    setRenderedLettersWidths((v) => [...v, snappedWidth]);

    renderedLetters.length > 5 && renderedLetters.shift();
    renderedLettersWidths.length > 5 && renderedLettersWidths.shift();
  }, [snappedWidth]);

  // Update Theme on body

  useEffect(() => {
    changeTheme();
    // console.log(theme);
  }, [animationDirection]);

  useEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  return (
    <main
      ref={mainContainer}
      className={`${styles.main} ${TT_NEORIS.className} scroll-smooth`}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      </Head>
      <section
        id="info"
        data-index="0"
        className={`relative select-none ${styles.variableLines}`}
        ref={variableLinesSectionRef}
      >
        {/* ------ Letters ------ */}
        <div className={`${styles.letters} ${SQUEEZY.className}`}>
          <div
            className={`${styles.letter} ${styles.letter3}`}
            style={{
              fontVariationSettings: `"wdth" ${
                renderedLettersWidths[renderedLettersWidths.length - 4]
              }`,
            }}
          >
            {renderedLetters[renderedLetters.length - 4]}
          </div>
          <div
            className={`${styles.letter} ${styles.letter2}`}
            style={{
              fontVariationSettings: `"wdth" ${
                renderedLettersWidths[renderedLettersWidths.length - 3]
              }`,
            }}
          >
            {renderedLetters[renderedLetters.length - 3]}
          </div>
          <div
            className={`${styles.letter} ${styles.letter1}`}
            style={{
              fontVariationSettings: `"wdth" ${
                renderedLettersWidths[renderedLettersWidths.length - 2]
              }`,
            }}
          >
            {renderedLetters[renderedLetters.length - 2]}
          </div>
          <div
            className={`${styles.letter} ${styles.mainLetter}`}
            ref={currentLetterRef}
            style={{
              fontVariationSettings: `"wdth" ${currentWidth}`,
            }}
          >
            {currentLetter}
          </div>
        </div>
      </section>
    </main>
  );
}
