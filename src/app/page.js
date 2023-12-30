"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { isMobile } from "react-device-detect";
import styles from "./page.module.css";
import Grid from "./Grid/grid";

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState();
  const [renderedLetters, setRenderedLetters] = useState([currentLetter]);
  const [renderedLettersWidths, setRenderedLettersWidths] = useState([]);
  const [gyroPermissionGranted, setGyroPermissionGranted] = useState(false);

  const themes = ["red", "blue", "pink", "black"];
  const [theme, setTheme] = useState(0);

  const changeTheme = (newTheme) => {
    // if (theme === themes.length - 1) {
    //   setTheme(0);
    // } else {
    //   setTheme(theme + 1);
    // }

    if (newTheme === theme) {
      console.log(theme);
      return;
    }
    console.log(newTheme);
    setTheme(newTheme);
  };

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

  const currentLetterRef = useRef(null);
  const variableLinesSectionRef = useRef(null);
  const editableSectionRef = useRef(null);

  const min = 0.6080125;
  const max = 1.0880125;

  useEffect(() => {
    let x = 0;
    let delta = 0;

    let center = window.innerWidth / 2;

    let height = currentLetterRef.current.getBoundingClientRect().height;
    const ratio = 300 / ((height * max - height * min) / 2);

    const handleMouseMove = (e) => {
      x = Math.abs(center - e.clientX);
      delta = Math.floor(x - (height * min) / 2);

      const width = 400 + delta * ratio;

      const snappedWidth = snappedWidths.reduce(function (prev, curr) {
        return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
      });

      setSnappedWidth(snappedWidth);

      if (delta >= 0 && delta <= (height * max - height * min) / 2) {
        setCurrentWidth(width);
      }
    };

    const handleResize = () => {
      center = window.innerWidth / 2;
      height = currentLetterRef.current.getBoundingClientRect().height;
    };

    const variableLinesSection = variableLinesSectionRef.current;
    const editableSection = editableSectionRef.current;

    if (!isMobile) {
      variableLinesSection &&
        variableLinesSection.addEventListener("mousemove", handleMouseMove);

      editableSection &&
        editableSection.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      variableLinesSection &&
        variableLinesSection.addEventListener("mousemove", handleMouseMove);

      editableSection &&
        editableSection.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  });

  // Gyro
  function getAccel() {
    // Android
    // setGyroPermissionGranted(true);
    // let delta;
    // const ratio = 300 / 30;

    // // console.log("accelerometer permission granted");

    // window.addEventListener("deviceorientation", (e) => {
    //   delta = Math.abs(e.gamma);

    //   if (delta > 0 && delta < 30) {
    //     const width = 400 + delta * ratio;

    //     const snappedWidth = snappedWidths.reduce(function (prev, curr) {
    //       return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
    //     });

    //     setSnappedWidth(snappedWidth);
    //     setCurrentWidth(width);
    //   }
    // });

    // IOS
    DeviceMotionEvent.requestPermission().then((response) => {
      if (response == "granted") {
        setGyroPermissionGranted(true);
        let delta;
        const ratio = 300 / 30;

        // console.log("accelerometer permission granted");

        window.addEventListener("deviceorientation", (e) => {
          delta = Math.abs(e.gamma);

          if (delta > 0 && delta < 30) {
            const width = 400 + delta * ratio;

            const snappedWidth = snappedWidths.reduce(function (prev, curr) {
              return Math.abs(curr - width) < Math.abs(prev - width)
                ? curr
                : prev;
            });

            setSnappedWidth(snappedWidth);
            setCurrentWidth(width);
          }
        });
      }
    });
  }

  useEffect(() => {
    const random = () => {
      return Math.floor(Math.random() * heroLetterSet.length);
    };

    setCurrentLetter(heroLetterSet[random()]);
    setRenderedLetters((v) => [...v, currentLetter]);
    setRenderedLettersWidths((v) => [...v, snappedWidth]);

    renderedLetters.length > 4 && renderedLetters.shift();
    renderedLettersWidths.length > 4 && renderedLettersWidths.shift();
    // console.log(renderedLetters, renderedLettersWidths);
  }, [snappedWidth]);

  useEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  return (
    <main
      className={styles.main}
      // style={{
      //   "--currentWidth": currentWidth,
      // }}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      </Head>
      {isMobile && gyroPermissionGranted === false && (
        <button
          id="accelPermsButton"
          className={styles.accessButton}
          onClick={getAccel}
        >
          Activate Gyro Sensor
        </button>
      )}
      <header className={styles.header}>
        <h1 className={styles.title}>Squeezy VF</h1>
        <div
          className={styles.themeSwitch}
          style={{ width: 12 * themes.length + 4 * (themes.length - 1) }}
        >
          {themes.map((thisTheme, index) => {
            // console.log(index, theme);

            return (
              <button
                key={index}
                className={`${styles.switch} ${thisTheme} ${
                  index === theme ? styles.active : ""
                }`}
                onClick={() => changeTheme(index)}
                style={{
                  left: 16 * index,
                }}
              ></button>
            );
          })}
        </div>
      </header>

      <p className={styles.width}>{snappedWidth}</p>
      <div className={styles.widthLinesLeft}>
        {snappedWidths.map((width, key) => (
          <div
            className={`${styles.widthLine} ${
              width === snappedWidth ? styles.active : ""
            }`}
            key={key}
          ></div>
        ))}
      </div>
      <div className={styles.widthLinesRight}>
        {snappedWidths.map((width, key) => (
          <div
            className={`${styles.widthLine} ${
              width === snappedWidth ? styles.active : ""
            }`}
            key={key}
          ></div>
        ))}
      </div>
      {/* <div className={styles.themeSwitch}>
        <div className={styles.themeHandle}></div>
        <div className={styles.themeHandle}></div>
        <div className={styles.themeHandle}></div>
      </div> */}

      <section className={styles.variableLines} ref={variableLinesSectionRef}>
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
      <section className={styles.editor} ref={editableSectionRef}>
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
      <Grid
        isMobile={isMobile}
        snappedWidths={snappedWidths}
        extSnappedWidth={gyroPermissionGranted ? snappedWidth : null}
        extCurrentWidth={gyroPermissionGranted ? currentWidth : null}
        gyroPermissionGranted={gyroPermissionGranted}
      />
    </main>
  );
}
