"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [renderedLetters, setRenderedLetters] = useState([currentLetter]);
  const [renderedLettersWidths, setRenderedLettersWidths] = useState([]);

  const themes = ["red", "blue", "pink", "black"];
  const [theme, setTheme] = useState(0);

  const changeTheme = () => {
    if (theme === themes.length - 1) {
      setTheme(0);
    } else {
      setTheme(theme + 1);
    }

    document.body.className = themes[theme];
  };

  // const gridLines = [400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700];
  // const gridLines = [400, 440, 480, 520, 560, 600, 640, 680, 700];
  const gridLines = [400, 430, 460, 490, 520, 550, 580, 610, 640, 670, 700];

  const letterSet = [
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
  const random = () => {
    return Math.floor(Math.random() * letterSet.length);
  };

  const gridsRef = useRef(null);
  const gridRef = useRef(null);
  const currentLetterRef = useRef(null);
  const letter1Ref = useRef(null);
  const letter2Ref = useRef(null);
  const letter3Ref = useRef(null);

  // function changeLetter() {
  //   setCurrentLetter(letterSet[random()]);
  //   console.log(currentLetter);
  // }

  const addLetter = (width) => {
    setCurrentLetter(letterSet[random()]);
    setRenderedLetters((v) => [...v, currentLetter]);
    // setRenderedLettersWidths((v) => [...v, width]);
    setRenderedLettersWidths((v) => [...v, width]);

    renderedLetters.length > 4 && renderedLetters.shift();
    renderedLettersWidths.length > 4 && renderedLettersWidths.shift();
    console.log(renderedLetters, renderedLettersWidths);
  };

  // function coordinate(event) {
  //   const x = event.clientX;
  //   const y = event.clientY;
  // }

  useEffect(() => {
    const grids = gridsRef.current;
    const grid = gridRef.current;

    const gridsWidth = grids.getBoundingClientRect().width;
    const gridWidth = grid.getBoundingClientRect().width;

    let x = 0;
    let y = 0;

    // font axis goes from 400 to 700 -> delta is 300
    let ratio = 300 / gridWidth;

    document.body.addEventListener("mousemove", (e) => {
      x = Math.floor(e.clientX - (window.innerWidth - gridsWidth) / 2);

      if (x >= gridsWidth - gridWidth) {
        setCurrentWidth(
          Math.floor(400 + (x - (gridsWidth - gridWidth)) * ratio)
        );
      } else {
        setCurrentWidth(Math.floor(700 - x * ratio));
      }

      currentLetterRef.current.style.setProperty(
        `font-variation-settings`,
        `"wdth" ${currentWidth}`
      );

      letter1Ref.current.style.setProperty(
        `font-variation-settings`,
        `"wdth" ${renderedLettersWidths[renderedLettersWidths.length - 1]}`
      );

      letter2Ref.current.style.setProperty(
        `font-variation-settings`,
        `"wdth" ${renderedLettersWidths[renderedLettersWidths.length - 2]}`
      );

      letter3Ref.current.style.setProperty(
        `font-variation-settings`,
        `"wdth" ${renderedLettersWidths[renderedLettersWidths.length - 3]}`
      );
    });
  });

  return (
    <main className={styles.main}>
      <h1 className={styles.title} onClick={changeTheme}>
        Squeezy VF
      </h1>
      <p className={styles.width}>
        {renderedLettersWidths[renderedLettersWidths.length - 1]}
      </p>
      <div className={styles.grids} ref={gridsRef}>
        <div className={styles.grid} ref={gridRef}>
          {gridLines.toReversed().map((width, key) => (
            <div
              className={styles.gridLine}
              key={key}
              onMouseEnter={() => addLetter(width)}
            ></div>
          ))}
        </div>
        <div className={styles.grid}>
          {gridLines.map((width, key) => (
            <div
              className={styles.gridLine}
              key={key}
              onMouseEnter={() => addLetter(width)}
            ></div>
          ))}
        </div>
      </div>
      <div className={styles.letters}>
        <div className={`${styles.letter} ${styles.letter3}`} ref={letter3Ref}>
          {renderedLetters[renderedLetters.length - 3]}
        </div>
        <div className={`${styles.letter} ${styles.letter2}`} ref={letter2Ref}>
          {renderedLetters[renderedLetters.length - 2]}
        </div>
        <div className={`${styles.letter} ${styles.letter1}`} ref={letter1Ref}>
          {renderedLetters[renderedLetters.length - 1]}
        </div>
        <div className={styles.letter} ref={currentLetterRef}>
          {currentLetter}
        </div>
      </div>
    </main>
  );
}
