"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { isMobile } from "react-device-detect";
import styles from "./page.module.css";
import Grid from "./Grid/grid";
import ShopifyButton from './Shopify/ShopifyButton'
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

  const headerRef = useRef(null);
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

  // const initialized = useRef(false)
  // const lastValue = useRef(null)
  // const weightValues = []
  // useEffect(() => {
  //   if (!initialized.current) {
  //     initialized.current = true
  //     setInterval(randomizeText, 1000);
  //   }
  // });
  // function randomizeText() {
  //   let randomWeight = Math.random() * (200 - 35) + 35;
  //   let randomWidth = 400 + Math.round(Math.random() * 3) * 100;
  //   headerRef.current.style.fontVariationSettings = "\"wdth\" " + randomWidth;
  //   console.log(headerRef.current, randomWidth)
  // }
  
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
        <a href="https://overnice.com">
          <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.4029 23.8945C10.2161 23.8945 9.6893 22.17 9.6893 15.039C9.6893 7.81474 10.2161 6.18346 12.4029 6.18346C14.5898 6.18346 15.1166 7.90796 15.1166 15.039C15.1166 22.17 14.5898 23.8945 12.4029 23.8945ZM12.4029 0.108887C1.46856 0.108887 0 7.51955 0 14.9458C0 23.1798 1.03757 30.0001 12.4029 30.0001C23.3373 30.0001 24.8059 22.4807 24.8059 15.0545C24.7899 6.82043 23.7683 0.108887 12.4029 0.108887Z"
            fill="#FEFEFE"/>
          </svg>
        </a>


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

      {/* <div className={styles.themeSwitch}>
        <div className={styles.themeHandle}></div>
        <div className={styles.themeHandle}></div>
        <div className={styles.themeHandle}></div>
      </div> */}

      <section className={styles.heading}>
        <div className="w-fit max-w-full flex items-center">
          <h1 className={`grow ${styles.left}`} style={{"--delay": '0s'}} ref={headerRef}>Squeezy</h1>
          <h1 className={`grow ${styles.right}`} style={{"--delay": '0s'}} ref={headerRef}>Squeezy</h1>
        </div>
        <div className="w-fit max-w-full flex items-center">
          <h1 className={`grow ${styles.right}`} style={{"--delay": '-0.8s'}} ref={headerRef}>Squeezy</h1>
          <h1 className={`grow ${styles.left}`} style={{"--delay": '-0.8s'}} ref={headerRef}>Squeezy</h1>
        </div>
        <div className="w-fit max-w-full flex items-center">
          <h1 className={`grow ${styles.left}`} style={{"--delay": '-0.3s'}} ref={headerRef}>Squeezy</h1>
          <h1 className={`grow ${styles.right}`} style={{"--delay": '-0.3s'}} ref={headerRef}>Squeezy</h1>
        </div>
        <div className="w-fit max-w-full flex items-center">
          <h1 className={`grow ${styles.right}`} style={{"--delay": '0s'}} ref={headerRef}>Squeezy</h1>
          <h1 className={`grow ${styles.left}`} style={{"--delay": '0s'}} ref={headerRef}>Squeezy</h1>
        </div>
        <div className="w-fit max-w-full flex items-center">
          <h1 className={`grow ${styles.left}`} style={{"--delay": '-0.5s'}} ref={headerRef}>Squeezy</h1>
          <h1 className={`grow ${styles.right}`} style={{"--delay": '-0.5s'}} ref={headerRef}>Squeezy</h1>
        </div>
        
        <p className="mb-8">A squishable and squashable variable font</p>
        <ShopifyButton id={8815969796426}></ShopifyButton>
      </section>

      <section className={styles.variableLines} ref={variableLinesSectionRef}>
        {/* Width Lines */}
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
        {/* ------ Lines ------ */}
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
        ></p>
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
