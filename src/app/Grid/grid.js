"use client";

import React, { useEffect, useRef, useState } from "react";

import styles from "./grid.module.css";

const fullLetterSet = [
  "A",
  "Ä",
  "Á",
  "À",
  "Â",
  "Ã",
  "B",
  "C",
  "D",
  "E",
  "É",
  "È",
  "Ê",
  "F",
  "G",
  "H",
  "I",
  "Ï",
  "Í",
  "Ì",
  "Î",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "Ö",
  "Ó",
  "Ò",
  "Ô",
  "Õ",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "Ü",
  "Ú",
  "Ù",
  "Û",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  ".",
  ",",
  ":",
  ";",
  "-",
  "–",
  "—",
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
  const [currentWidth, setCurrentWidth] = useState(400);
  const [letterClientWidth, setLetterClientWidth] = useState(400);
  const [snappedWidth, setSnappedWidth] = useState();

  const showcaseSectionRef = useRef(null);
  const currentLetterRef = useRef(null);

  // Width to height ratios 400 / 700
  const ratios = {
    narrow: {
      min: 0.2775,
      max: 0.525,
    },

    regular: {
      min: 0.585,
      max: 1.0695,
    },
    wide: {
      min: 0.887,
      max: 1.6125,
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
    showcaseSection.style.setProperty("--min", min);
    showcaseSection.style.setProperty("--max", max);

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
      } else if (delta < 0) {
        setCurrentWidth(400);
      } else if (delta > (height * max - height * min) / 2) {
        setCurrentWidth(700);
      }
      setLetterClientWidth(
        currentLetterRef.current.getBoundingClientRect().width
      );
    };

    const handleMouseLeave = (e) => {
      // setSnappedWidth(700);
      // setCurrentWidth(700);
    };

    const handleResize = () => {
      center = window.innerWidth * 0.75;
      height = currentLetterRef.current.getBoundingClientRect().height;
    };

    if (!isMobile) {
      showcaseSection &&
        showcaseSection.addEventListener("mousemove", handleMouseMove);

      currentLetterRef.current &&
        currentLetterRef.current.addEventListener(
          "mouseleave",
          handleMouseLeave
        );
    }

    window.addEventListener("resize", handleResize);

    return () => {
      showcaseSection &&
        showcaseSection.removeEventListener("mousemove", handleMouseMove);

      currentLetterRef.current &&
        currentLetterRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (gyroPermissionGranted) {
      setSnappedWidth(extSnappedWidth);
      setCurrentWidth(extCurrentWidth);
    }
  }, [extSnappedWidth, extCurrentWidth, gyroPermissionGranted]);

  const showWidthTicks = useRef({
    opacity: '1'
  })
  const symbols = ['.', ',', ';', ':', '-', '_', '–', '—']

  useEffect(() => {
    if (symbols.includes(currentLetter)) {
      showWidthTicks.current = {
        opacity: '0'
      }
    } else {
      showWidthTicks.current = {
        opacity: '1'
      }
    }
  }, [currentLetter, showWidthTicks, symbols]);

  return (
    <section id="grid" data-index="2" className={styles.gridContainer}>
      <div className={styles.grid}>
        {fullLetterSet.map((letter, key) => {
          return (
            <div
              className={`${styles.gridItem} ${
                currentLetter === letter ? styles.active : "fuck"
              }`}
              key={key}
              onClick={() => {
                setCurrentLetter(letter);
                setTimeout(() => {
                  // Update letter width for wide letter guide lines
                  setLetterClientWidth(
                    currentLetterRef.current.getBoundingClientRect().width
                  );
                }, 10);
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>
      <div
        className={`select-none ${styles.gridShowcase} ${
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
                    ? `translate(calc(
                      -${(letterClientWidth - 14) * 0.5}px
                      + ${(letterClientWidth - 14) * 0.324}px
                      - ${(1 - (currentWidth - 400) / 300) * 5}px
                    ), -50%)`
                    : null,
              }}
            ></div>
            <div
              className={styles.centerRight}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(calc(
                      -${(letterClientWidth - 14) * 0.5}px
                      + ${(letterClientWidth - 14) * 0.338}px
                      + ${(1 - (currentWidth - 400) / 300) * 2}px
                    ), -50%)`
                    : null,
              }}
            ></div>
            <div
              className={styles.centerTwoLeft}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(calc(
                      -${(letterClientWidth - 14) * 0.5}px
                      + ${(letterClientWidth - 14) * 0.675}px
                      + ${(1 - (currentWidth - 400) / 300) * 4}px
                    ), -50%)`
                    : null,
              }}
            ></div>
            <div
              className={styles.centerTwoRight}
              style={{
                transform:
                  wideLetters.includes(currentLetter) &&
                  doubleSlitLetters.includes(currentLetter)
                    ? `translate(calc(
                    -${(letterClientWidth - 14) * 0.5}px
                    + ${(letterClientWidth - 14) * 0.6615}px
                    - ${(1 - (currentWidth - 400) / 300) * 2}px
                  ), -50%)`
                    : null,
              }}
            ></div>
            <div className={styles.outerTop}></div>
            <div className={styles.outerBottom}></div>
          </div>
        </div>

        <div className={styles.widthContainer} style={showWidthTicks.current}>
          {/* WIDTH VALUE! */}
          <p className={styles.width}>{Math.round(currentWidth)}</p>
          {/* ------------ */}
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
      </div>
    </section>
  );
}
