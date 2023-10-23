"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState();
  const [renderedLetters, setRenderedLetters] = useState([currentLetter]);
  const [renderedLettersWidths, setRenderedLettersWidths] = useState([]);
  const [showcasedLetter, setShowcasedLetter] = useState("A");

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

  // const snappedWidths = [400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700];
  const snappedWidths = [400, 430, 460, 490, 520, 550, 580, 610, 640, 670, 700];

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

  const fullLetterSet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const regularLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "U",
    "V",
    "X",
    "Y",
    "Z",
  ];
  const wideLetters = ["M", "T", "W"];
  const narrowLetters = ["I"];
  const centerSlitLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "U",
    "V",
    "X",
    "Y",
    "Z",
  ];
  const centerWideGapLetters = [
    "A",
    "B",
    "H",
    "K",
    "R",
    "N",
    "X",
    "S",
    "Y",
    "Z",
  ];
  const centerGapLetters = ["B", "C", "X"];
  const centerWideBottomEdgeLetters = ["P"];
  const centerBottomEdgeLetters = ["J", "L", "K"];
  const centerTopEdgeLetters = ["R"];
  const doubleSlitLetters = ["M", "N", "T", "W"];
  const topGapLetters = ["G"];
  const topEnclosedLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "M",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "Z",
  ];
  const bottomEnclosedLetters = [
    "B",
    "C",
    "D",
    "E",
    "G",
    "J",
    "L",
    "O",
    "Q",
    "S",
    "U",
    "V",
    "W",
    "Y",
    "Z",
  ];

  const currentLetterRef = useRef(null);

  const min = 0.6080125;
  const max = 1.0880125;

  useEffect(() => {
    let x = 0;
    let delta = 0;

    let center = window.innerWidth / 2;
    let height = currentLetterRef.current.getBoundingClientRect().height;

    const getWidth = (ratio) => {
      return height * ratio;
    };

    const ratio = 300 / ((getWidth(max) - getWidth(min)) / 2);

    const handleMouseMove = (e) => {
      x = Math.abs(center - e.clientX);
      delta = Math.floor(x - getWidth(min) / 2);

      const width = 400 + delta * ratio;

      const snappedWidth = snappedWidths.reduce(function (prev, curr) {
        return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
      });

      setSnappedWidth(snappedWidth);

      if (delta >= 0 && delta <= (getWidth(max) - getWidth(min)) / 2) {
        setCurrentWidth(width);
      }
    };

    const handleResize = () => {
      center = window.innerWidth / 2;
      height = currentLetterRef.current.getBoundingClientRect().height;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  });

  // Gyro
  // function getAccel() {
  //   DeviceMotionEvent.requestPermission().then((response) => {
  //     if (response == "granted") {
  //       console.log(currentWidth);
  //       let delta;
  //       const ratio = 300 / 30;
  //       // var px = 50; // Position x and y
  //       // var vx = 0.0; // Velocity x and y
  //       // var updateRate = 1 / 60; // Sensor refresh rate

  //       console.log("accelerometer permission granted");
  //       // Do stuff here
  //       // document.body.style.background = "#eee";

  //       // Add a listener to get smartphone acceleration
  //       // in the XYZ axes (units in m/s^2)
  //       // window.addEventListener("devicemotion", (event) => {
  //       // console.log(event);
  //       // });
  //       // Add a listener to get smartphone orientation
  //       // in the alpha-beta-gamma axes (units in degrees)
  //       window.addEventListener("deviceorientation", (e) => {
  //         delta = Math.abs(e.gamma);
  //         // leftToRight_degrees = e.gamma;

  //         // x = Math.floor(400 + e.gamma);

  //         if (delta > 0 && delta < 30) {
  //           setCurrentgetWidth(Math.floor(400 + delta * ratio));
  //           console.log(currentWidth);
  //         }

  //         // vx = vx + leftToRight_degrees * updateRate * 2;

  //         // px = px + vx * 0.5;
  //         // if (px > 98 || px < 0) {
  //         //   px = Math.max(0, Math.min(98, px)); // Clip px between 0-98
  //         //   vx = 0;
  //         // }
  //       });
  //     }
  //   });
  // }

  useEffect(() => {
    const random = () => {
      return Math.floor(Math.random() * heroLetterSet.length);
    };

    setCurrentLetter(heroLetterSet[random()]);
    setRenderedLetters((v) => [...v, currentLetter]);
    setRenderedLettersWidths((v) => [...v, snappedWidth]);

    renderedLetters.length > 4 && renderedLetters.shift();
    renderedLettersWidths.length > 4 && renderedLettersWidths.shift();
    console.log(renderedLetters, renderedLettersWidths);
  }, [snappedWidth]);

  return (
    <main className={styles.main}>
      {/* <button
        id="accelPermsButton"
        className={styles.accessButton}
        onClick={getAccel}
      >
        Get Access
      </button> */}
      <h1 className={styles.title} onClick={changeTheme}>
        Squeezy VF
      </h1>
      <p className={styles.width}>{snappedWidth}</p>

      <section className={styles.variableLines}>
        <div className={styles.letters}>
          <div
            className={`${styles.letter} ${styles.letter3}`}
            style={{
              fontVariationSettings: `"wdth" ${
                renderedLettersWidths[renderedLettersWidths.length - 3]
              }`,
            }}
          >
            {renderedLetters[renderedLetters.length - 3]}
          </div>
          <div
            className={`${styles.letter} ${styles.letter2}`}
            style={{
              fontVariationSettings: `"wdth" ${
                renderedLettersWidths[renderedLettersWidths.length - 2]
              }`,
            }}
          >
            {renderedLetters[renderedLetters.length - 2]}
          </div>
          <div
            className={`${styles.letter} ${styles.letter1}`}
            style={{
              fontVariationSettings: `"wdth" ${
                renderedLettersWidths[renderedLettersWidths.length - 1]
              }`,
            }}
          >
            {renderedLetters[renderedLetters.length - 1]}
          </div>
          <div
            className={styles.letter}
            ref={currentLetterRef}
            style={{
              fontVariationSettings: `"wdth" ${currentWidth}`,
            }}
          >
            {currentLetter}
          </div>
        </div>
      </section>
      <section className={styles.editor}>
        <p
          className={styles.editableArea}
          contentEditable
          suppressContentEditableWarning
          style={{
            fontVariationSettings: `"wdth" ${currentWidth}`,
          }}
        >
          Type anything
        </p>
      </section>
      <section className={styles.gridContainer}>
        <div className={styles.grid}>
          {fullLetterSet.map((letter, key) => {
            return (
              <div
                className={styles.gridItem}
                key={key}
                style={
                  {
                    // fontVariationSettings: `"wdth" ${currentWidth}`,
                  }
                }
                onMouseMove={() => setShowcasedLetter(letter)}
              >
                {letter}
              </div>
            );
          })}
        </div>
        <div
          className={styles.gridShowcase}
          style={
            {
              // fontVariationSettings: `"wdth" ${currentWidth}`,
            }
          }
        >
          {showcasedLetter}
          <div
            className={`${styles.gridLines} ${
              regularLetters.includes(showcasedLetter) ? styles.regular : ""
            } 
            ${wideLetters.includes(showcasedLetter) ? styles.wide : ""} ${
              narrowLetters.includes(showcasedLetter) ? styles.narrow : ""
            } ${
              centerSlitLetters.includes(showcasedLetter)
                ? styles.centerSlit
                : ""
            } ${
              doubleSlitLetters.includes(showcasedLetter)
                ? styles.doubleSlit
                : ""
            } ${
              centerWideGapLetters.includes(showcasedLetter)
                ? styles.centerWideGap
                : ""
            } ${
              centerGapLetters.includes(showcasedLetter) ? styles.centerGap : ""
            } ${
              centerWideBottomEdgeLetters.includes(showcasedLetter)
                ? styles.centerWideBottomEdge
                : ""
            } ${
              centerTopEdgeLetters.includes(showcasedLetter)
                ? styles.centerTopEdge
                : ""
            } ${
              centerBottomEdgeLetters.includes(showcasedLetter)
                ? styles.centerBottomEdge
                : ""
            } ${topGapLetters.includes(showcasedLetter) ? styles.topGap : ""} ${
              topEnclosedLetters.includes(showcasedLetter)
                ? styles.topEnclosed
                : ""
            } ${
              bottomEnclosedLetters.includes(showcasedLetter)
                ? styles.bottomEnclosed
                : ""
            }`}
          >
            <div className={styles.left}></div>
            <div className={styles.right}></div>
            <div className={styles.top}></div>
            <div className={styles.bottom}></div>
            <div className={styles.centerTop}></div>
            <div className={styles.centerBottom}></div>
            <div className={styles.centerWideTop}></div>
            <div className={styles.centerWideBottom}></div>
            <div className={styles.centerLeft}></div>
            <div className={styles.centerRight}></div>
            <div className={styles.centerTwoLeft}></div>
            <div className={styles.centerTwoRight}></div>
            <div className={styles.outerTop}></div>
            <div className={styles.outerBottom}></div>
          </div>
        </div>
      </section>
    </main>
  );
}
