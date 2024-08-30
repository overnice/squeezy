"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "./page.module.css";
import anime from "animejs";
import localFont from "next/font/local";

// Font files can be colocated inside of `pages`
const TT_NEORIS = localFont({
  src: "../../public/fonts/TT_Neoris_Variable.woff2",
});
const SQUEEZY = localFont({ src: "../../public/fonts/SqueezyVF.woff2" });

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState("400");
  const [renderedLetters, setRenderedLetters] = useState([currentLetter]);
  const [renderedLettersWidths, setRenderedLettersWidths] = useState([]);

  const [positionX, setPositionX] = useState(0);

  const themes = ["black", "red", "yellowGreen", "yellowBlue"];
  const [theme, setTheme] = useState(0);

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


  // ANIMATION ---------------------------

  // pseudo values which are animated - their values are used to update independent STATE values
  const virtualMousePosition = {
    x: 400,
  }
  const themeIndex = {
    value: 0
  }

  // Animation duration is linked to both anim so they sync up.
  const animDuration = 1000

  useEffect(() => {
    anime({
      targets: virtualMousePosition, // initial value
      x: 700, // final value
      duration: animDuration, // animation duration in milliseconds
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutCubic',
      round: 1, // round the value to the nearest integer
      update: (anim) => {
        setPositionX(virtualMousePosition.x);
      }
    });

    anime({
      targets: themeIndex, // initial value
      value: themes.length, // final value
      duration: animDuration * 8, // animation duration in milliseconds
      loop: true,
      easing: 'linear',
      round: 1, // round the value to the nearest integer
      update: (anim) => {
        setTheme(themeIndex.value);
      }
    });
  }, []);

  // ---------------------------------------------------------------------------

  useEffect(() => {
      const snappedWidth = snappedWidths.reduce(function (prev, curr) {
        return Math.abs(curr - positionX) < Math.abs(prev - positionX) ? curr : prev;
      });
      setSnappedWidth(snappedWidth);
      setCurrentWidth(positionX);

  }, [positionX, snappedWidths]);

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
    document.body.className = themes[theme];
  }, [theme, themes]);

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
