"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState();
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
  const editableRef = useRef(null);
  const letter1Ref = useRef(null);
  const letter2Ref = useRef(null);
  const letter3Ref = useRef(null);

  const min = 0.6080125;
  const max = 1.0880125;
  const increment = 0.024;

  // function changeLetter() {
  //   setCurrentLetter(letterSet[random()]);
  //   console.log(currentLetter);
  // }

  const addLetter = (width) => {
    setCurrentLetter(letterSet[random()]);
    setRenderedLetters((v) => [...v, currentLetter]);
    setRenderedLettersWidths((v) => [...v, width]);

    renderedLetters.length > 4 && renderedLetters.shift();
    renderedLettersWidths.length > 4 && renderedLettersWidths.shift();
    console.log(renderedLetters, renderedLettersWidths);
  };

  useEffect(() => {
    let x = 0;
    let delta = 0;

    let center = window.innerWidth / 2;
    let height = currentLetterRef.current.getBoundingClientRect().height;

    const getWidth = (ratio) => {
      return height * ratio;
    };

    const ratio = 300 / ((getWidth(max) - getWidth(min)) / 2);

    // document.body.addEventListener("mousemove", (e) => {});

    const handleMouseMove = (e) => {
      x = Math.abs(center - e.clientX);
      delta = Math.floor(x - getWidth(min) / 2);

      const width = 400 + delta * ratio;

      const snappedWidth = gridLines.reduce(function (prev, curr) {
        return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
      });

      setSnappedWidth(snappedWidth);

      if (delta >= 0 && delta <= (getWidth(max) - getWidth(min)) / 2) {
        setCurrentWidth(width);
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

      editableRef.current.style.setProperty(
        `font-variation-settings`,
        `"wdth" ${currentWidth}`
      );
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
  function getAccel() {
    DeviceMotionEvent.requestPermission().then((response) => {
      if (response == "granted") {
        console.log(currentWidth);
        let delta;
        const ratio = 300 / 30;
        // var px = 50; // Position x and y
        // var vx = 0.0; // Velocity x and y
        // var updateRate = 1 / 60; // Sensor refresh rate

        console.log("accelerometer permission granted");
        // Do stuff here
        // document.body.style.background = "#eee";

        // Add a listener to get smartphone acceleration
        // in the XYZ axes (units in m/s^2)
        // window.addEventListener("devicemotion", (event) => {
        // console.log(event);
        // });
        // Add a listener to get smartphone orientation
        // in the alpha-beta-gamma axes (units in degrees)
        window.addEventListener("deviceorientation", (e) => {
          delta = Math.abs(e.gamma);
          // leftToRight_degrees = e.gamma;

          // x = Math.floor(400 + e.gamma);

          if (delta > 0 && delta < 30) {
            setCurrentgetWidth(Math.floor(400 + delta * ratio));
            console.log(currentWidth);
          }

          // vx = vx + leftToRight_degrees * updateRate * 2;

          // px = px + vx * 0.5;
          // if (px > 98 || px < 0) {
          //   px = Math.max(0, Math.min(98, px)); // Clip px between 0-98
          //   vx = 0;
          // }
        });
      }
    });
  }

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
            ref={letter3Ref}
          >
            {renderedLetters[renderedLetters.length - 3]}
          </div>
          <div
            className={`${styles.letter} ${styles.letter2}`}
            ref={letter2Ref}
          >
            {renderedLetters[renderedLetters.length - 2]}
          </div>
          <div
            className={`${styles.letter} ${styles.letter1}`}
            ref={letter1Ref}
          >
            {renderedLetters[renderedLetters.length - 1]}
          </div>
          <div className={styles.letter} ref={currentLetterRef}>
            {currentLetter}
          </div>

          {/* Grid */}
          <div className={styles.grids} ref={gridsRef}>
            <div className={styles.grid} ref={gridRef}>
              {gridLines
                .slice()
                .reverse()
                .map((width, key) => (
                  <div
                    className={styles.gridLine}
                    key={key}
                    onMouseEnter={() => addLetter(width)}
                    style={{
                      width: `${(max - min) / 2 / gridLines.length}em`,
                    }}
                  ></div>
                ))}
            </div>
            <div className={styles.grid}>
              {gridLines.map((width, key) => (
                <div
                  className={styles.gridLine}
                  key={key}
                  onMouseEnter={() => addLetter(width)}
                  style={{
                    width: `${(max - min) / 2 / gridLines.length}em`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className={styles.editor}>
        <p className={styles.editableArea} ref={editableRef} contentEditable>
          Type anything
        </p>
      </section>
    </main>
  );
}
