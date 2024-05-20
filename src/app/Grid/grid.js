"use client";

import React, { useEffect, useRef, useState } from "react";

import styles from "./grid.module.css";

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
const narrowLetters = ["I"];
const wideLetters = ["M", "T", "W"];
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
const centerWideGapLetters = ["A", "B", "H", "K", "R", "N", "X", "S", "Y", "Z"];
const centerGapLetters = ["B", "C", "X"];
const centerWideBottomEdgeLetters = ["P", "T"];
const centerBottomEdgeLetters = ["J", "L", "K"];
const centerTopEdgeLetters = ["R"];
const doubleSlitLetters = ["M", "N", "T", "W"];
const topGapLetters = ["G", "E", "F"];
const bottomGapLetters = ["E"];
const bottomGapTopEdgeLetters = ["F"];
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

export default function Grid({
  isMobile,
  snappedWidths,
  extSnappedWidth,
  extCurrentWidth,
  gyroPermissionGranted,
}) {
  const [currentLetter, setCurrentLetter] = useState("A");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState();

  const showcaseSectionRef = useRef(null);
  const currentLetterRef = useRef(null);

  // Width to height ratios 400 / 700
  const ratios = {
    narrow: {
      min: 0.3547232,
      max: 0.5838095,
    },

    regular: {
      min: 0.6080125,
      max: 1.0880125,
    },
    wide: {
      min: 1.0141055,
      max: 1.8036036,
    },
  };

  useEffect(() => {
    const showcaseSection = showcaseSectionRef.current;

    let x = 0;
    let delta = 0;

    let center = window.innerWidth * 0.75;
    let min;
    let max;

    if (narrowLetters.includes(currentLetter)) {
      min = ratios.narrow.min;
      max = ratios.narrow.max;
    } else if (wideLetters.includes(currentLetter)) {
      min = ratios.wide.min;
      max = ratios.wide.max;
    } else {
      min = ratios.regular.min;
      max = ratios.regular.max;
    }

    let height = currentLetterRef.current.getBoundingClientRect().height;
    const ratio = 300 / ((height * max - height * min) / 2);

    // console.log(currentLetter, min);

    const handleMouseMove = (e) => {
      x = Math.abs(center - e.clientX);
      delta = Math.floor(x - (height * min) / 2);

      const width = 400 + delta * ratio;

      const snappedWidth = snappedWidths.reduce(function (prev, curr) {
        return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
      });

      setSnappedWidth(snappedWidth);
      console.log(currentWidth, snappedWidth);

      if (delta >= 0 && delta <= (height * max - height * min) / 2) {
        setCurrentWidth(width);
      }
    };

    const handleResize = () => {
      center = window.innerWidth * 0.75;
      height = currentLetterRef.current.getBoundingClientRect().height;
    };

    if (!isMobile) {
      showcaseSection &&
        showcaseSection.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      showcaseSection &&
        showcaseSection.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (gyroPermissionGranted) {
      setSnappedWidth(extSnappedWidth);
      setCurrentWidth(extCurrentWidth);
    }
  }, [extSnappedWidth, extCurrentWidth, gyroPermissionGranted]);

  return (
    <section data-index='2' className={styles.gridContainer}>
      <div className={styles.grid}>
        {fullLetterSet.map((letter, key) => {
          return (
            <div
              className={`${styles.gridItem} ${currentLetter === letter ? styles.active : 'fuck'}`}
              key={key}
              onClick={() => setCurrentLetter(letter)}
            >
              {letter}
            </div>
          );
        })}
      </div>
      <div
        className={`${styles.gridShowcase} ${
          narrowLetters.includes(currentLetter) ? styles.narrow : ""
        } ${wideLetters.includes(currentLetter) ? styles.wide : ""}`}
        ref={showcaseSectionRef}
        style={{
          fontVariationSettings: `"wdth" ${currentWidth}`,
        }}
      >
        <div className={styles.showcasedLetter}>
          <span ref={currentLetterRef}>{currentLetter}</span>
          <div
            className={`${styles.gridLines}
            ${wideLetters.includes(currentLetter) ? styles.wide : ""} ${
              centerSlitLetters.includes(currentLetter) ? styles.centerSlit : ""
            } ${
              doubleSlitLetters.includes(currentLetter) ? styles.doubleSlit : ""
            } ${
              centerWideGapLetters.includes(currentLetter)
                ? styles.centerWideGap
                : ""
            } ${
              centerGapLetters.includes(currentLetter) ? styles.centerGap : ""
            } ${
              centerWideBottomEdgeLetters.includes(currentLetter)
                ? styles.centerWideBottomEdge
                : ""
            } ${
              centerTopEdgeLetters.includes(currentLetter)
                ? styles.centerTopEdge
                : ""
            } ${
              centerBottomEdgeLetters.includes(currentLetter)
                ? styles.centerBottomEdge
                : ""
            } ${topGapLetters.includes(currentLetter) ? styles.topGap : ""} ${
              bottomGapLetters.includes(currentLetter) ? styles.bottomGap : ""
            } ${
              bottomGapTopEdgeLetters.includes(currentLetter)
                ? styles.bottomGapTopEdge
                : ""
            } ${
              topEnclosedLetters.includes(currentLetter)
                ? styles.topEnclosed
                : ""
            } ${
              bottomEnclosedLetters.includes(currentLetter)
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
            <div className={styles.centerTwoTop}></div>
            <div className={styles.centerTwoBottom}></div>
            <div className={styles.centerWideTop}></div>
            <div className={styles.centerWideBottom}></div>
            <div
              className={styles.centerLeft}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(${-0.1666 * (currentWidth / 400)}em, -50%)`
                    : null,
              }}
            ></div>
            <div
              className={styles.centerRight}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(${-0.1433 * (currentWidth / 400)}em, -50%)`
                    : null,
              }}
            ></div>
            <div
              className={styles.centerTwoLeft}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(${0.1633 * (currentWidth / 400)}em, -50%)`
                    : null,
              }}
            ></div>
            <div
              className={styles.centerTwoRight}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(${0.14 * (currentWidth / 400)}em, -50%)`
                    : null,
              }}
            ></div>
            <div className={styles.outerTop}></div>
            <div className={styles.outerBottom}></div>
          </div>
        </div>
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
      </div>
    </section>
  );
}
