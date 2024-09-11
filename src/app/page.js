"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { isMobile } from "react-device-detect";
import styles from "./page.module.css";
import Grid from "./Grid/grid";
import ShopifyButton from "./Shopify/ShopifyButton";

import localFont from "next/font/local";
import Button from "./button";

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
  const [gyroPermissionGranted, setGyroPermissionGranted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [openDetails, setOpenDetails] = useState(false);
  const [gyroButtonVisibility, setGyroButtonVisibility] = useState("hidden");
  const [cursorHintVisibility, setCursorHintVisibility] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const themes = ["yellowGreen", "yellowBlue", "yellowPurple", "yellowRed"];
  const [theme, setTheme] = useState(0);

  const changeTheme = (newTheme) => {
    if (theme === themes.length - 1) {
      setTheme(0);
    } else {
      setTheme(theme + 1);
    }

    if (newTheme === theme) {
      return;
    }
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
  const gyroButton = useRef();
  const mainContainer = useRef();

  const min = 0.6080125;
  const max = 1.0880125;

  useEffect(() => {
    let x = 0;
    let delta = 0;

    let center = window.innerWidth / 2;

    let height = currentLetterRef.current.getBoundingClientRect().height;
    const ratio = 300 / ((height * max - height * min) / 2);

    const handleMouseMove = (e) => {
      if (cursorHintVisibility) {
        setTimeout(() => {
          setCursorHintVisibility(false);
        }, 1000);
      }
      x = Math.abs(center - e.clientX);
      delta = Math.floor(x - (height * min) / 2);

      const width = 400 + delta * ratio;

      const snappedWidth = snappedWidths.reduce(function (prev, curr) {
        return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
      });
      setSnappedWidth(snappedWidth);
      // if (snappedWidth !== snappedWidth.current) setSnappedWidth(snappedWidth);

      if (delta >= 0 && delta <= (height * max - height * min) / 2) {
        setCurrentWidth(width);
      } else if (delta < 0) {
        setCurrentWidth(400);
      } else if (delta > (height * max - height * min) / 2) {
        setCurrentWidth(700);
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

  useEffect(() => {
    if (isMobile) setGyroButtonVisibility("visible");
  }, [gyroButtonVisibility]);

  // Gyro
  function getAccel() {
    if (navigator.userAgent.match(/Android/i)) {
      setGyroPermissionGranted(true);
      // Android
      let delta;
      const ratio = 300 / 20;

      window.addEventListener("deviceorientation", (e) => {
        delta = Math.abs(e.gamma);

        if (delta > 2 && delta < 20) {
          const width = 400 + delta * ratio;

          const snappedWidth = snappedWidths.reduce(function (prev, curr) {
            return Math.abs(curr - width) < Math.abs(prev - width)
              ? curr
              : prev;
          });

          setSnappedWidth(snappedWidth);
          setCurrentWidth(width);
        } else if (delta < 2) {
          setCurrentWidth(400);
        } else if (delta > 20) {
          setCurrentWidth(700);
        }
      });
    } else {
      // IOS
      DeviceMotionEvent.requestPermission().then((response) => {
        if (response == "granted") {
          setGyroPermissionGranted(true);
          let delta;
          const ratio = 300 / 20;

          window.addEventListener("deviceorientation", (e) => {
            delta = Math.abs(e.gamma);

            if (delta > 2 && delta < 20) {
              const width = 400 + delta * ratio;

              const snappedWidth = snappedWidths.reduce(function (prev, curr) {
                return Math.abs(curr - width) < Math.abs(prev - width)
                  ? curr
                  : prev;
              });

              setSnappedWidth(snappedWidth);
              setCurrentWidth(width);
            } else if (delta < 2) {
              setCurrentWidth(400);
            } else if (delta > 20) {
              setCurrentWidth(700);
            }
          });
        }
      });
    }
  }

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
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.map((entry, i) => {
          if (entry.isIntersecting) {
            setCurrentSection(+entry.target.dataset.index);
            if (+entry.target.dataset.index === 2) {
              if (mainContainer.current) {
                setTimeout(() => {
                  mainContainer.current.style.scrollSnapType = "none";
                }, 500);
              }
            } else {
              if (mainContainer.current) {
                setTimeout(() => {
                  mainContainer.current.style.scrollSnapType = "y mandatory";
                }, 500);
              }
            }
          } else {
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const targets = document.querySelectorAll("section");
    targets.forEach((x) => observer.observe(x));
    setLoaded(true);
  }, []);

  const toggleDetails = () => {
    setOpenDetails(!openDetails);
  };

  return (
    <main
      ref={mainContainer}
      className={`${styles.main} ${TT_NEORIS.className} scroll-smooth`}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      </Head>
      <header className={styles.header}>
        <div className="flex items-center gap-x-4">
          <a href="https://overnice.com">
            <svg
              width="25"
              height="30"
              viewBox="0 0 25 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="logo fill-current"
                d="M12.4029 23.8945C10.2161 23.8945 9.6893 22.17 9.6893 15.039C9.6893 7.81474 10.2161 6.18346 12.4029 6.18346C14.5898 6.18346 15.1166 7.90796 15.1166 15.039C15.1166 22.17 14.5898 23.8945 12.4029 23.8945ZM12.4029 0.108887C1.46856 0.108887 0 7.51955 0 14.9458C0 23.1798 1.03757 30.0001 12.4029 30.0001C23.3373 30.0001 24.8059 22.4807 24.8059 15.0545C24.7899 6.82043 23.7683 0.108887 12.4029 0.108887Z"
              />
            </svg>
          </a>
          <h1 className={styles.title}>Squeezy Variable</h1>
        </div>

        <div className={`hidden sm:block ${styles.subtitle}`}>
          A squishable and squashable variable font
        </div>
        <Button
          onClick={() => document.getElementById("buy")?.scrollIntoView()}
          compact
          text={"Buy now"}
        />
      </header>

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
        {loaded && !isMobile && (
          <div>
            <button
              id="accelPermsButton"
              className={`${styles.accessButton} ${
                cursorHintVisibility
                  ? "opacity-100"
                  : "opacity-0 !translate-y-0"
              } transition-all duration-700 absolute px-5 py-2 text-lg flex items-center gap-4 rounded-full top-1/2 left-1/2 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 z-[100]`}
            >
              <div>
                <svg
                  width="25"
                  height="15"
                  viewBox="0 0 25 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    className={styles.arrowContainer}
                    clipPath="url(#clip0_279_299)"
                  >
                    <path d="M3 7.5H11" strokeWidth="2" />
                    <path d="M17 7.5H25" strokeWidth="2" />
                    <g className={styles.arrow}>
                      <rect width="14" height="15" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 1L3.83818 14L6.5 8L13 6.50676L1 1Z"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_279_299">
                      <rect width="25" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              Move your cursor to control the font width
            </button>
          </div>
        )}
      </section>

      <section
        id="try"
        data-index="1"
        className={`${[styles.editor, SQUEEZY.className].join(
          " "
        )} min-h-[50svh] md:min-h-[100svh]`}
        ref={editableSectionRef}
      >
        <p
          className={[styles.editableArea, SQUEEZY.className].join(" ")}
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

      {/* Payment area */}
      <section
        id="buy"
        data-index="3"
        className={`max-w-2xl px-4 mx-auto min-h-[100svh] flex flex-wrap content-center ${styles.prose}`}
      >
        {/* <div className="flex w-full">
          <h1 className={`small grow not-prose ${styles.left} ${styles.small} ${SQUEEZY.className}`} style={{"--delay": '0s'}} ref={headerRef}>
            Squeezy
          </h1>
          <h1 className={`small grow not-prose ${styles.right} ${styles.small} ${SQUEEZY.className}`} style={{"--delay": '0s'}} ref={headerRef}>
            Squeezy
          </h1>
        </div>
        <div className="flex w-full">
          <h1 className={`small grow not-prose ${styles.left} ${styles.small} ${SQUEEZY.className}`} style={{"--delay": '0.7s'}} ref={headerRef}>
            Squeezy
          </h1>
          <h1 className={`small grow not-prose ${styles.right} ${styles.small} ${SQUEEZY.className}`} style={{"--delay": '0.7s'}} ref={headerRef}>
            Squeezy
          </h1>
        </div>
        <div className="flex w-full">
          <h1 className={`small grow not-prose ${styles.left} ${styles.small} ${SQUEEZY.className}`} style={{"--delay": '0.2s'}} ref={headerRef}>
            Squeezy
          </h1>
          <h1 className={`small grow not-prose ${styles.right} ${styles.small} ${SQUEEZY.className}`} style={{"--delay": '0.2s'}} ref={headerRef}>
            Squeezy
          </h1>
        </div> */}
        <div className="my-10">
          <p className="mb-6 text-xl md:!text-2xl leading-[130%]">
            Fonts are evolving. Once rigid and available only in pre-defined
            strength and thickness, they now shift and bend, stretch and
            squeeze.
          </p>
          <p className="my-6 text-xl md:!text-2xl leading-[130%]">
            As a studio at the intersection of design and tech, a reactive,
            programmable font is right down our alley. So our founder, Julian,
            got right to work and did, what every designer should do at least
            once in their life: Creating a font.
          </p>
          <p className="mt-6 text-xl md:!text-2xl leading-[130%]">
            Try it, buy it or tell us why you should get it for free.
          </p>
        </div>

        <div className="flex w-full p-6 sm:p-10 flex-col justify-center rounded-2xl bg-[var(--foreground-shade-20)]">
          <div className="flex items-center gap-x-2 mb-4">
            <span className="text-[40px] leading-[100%]">€50</span>
            <span className="flex flex-col text-base leading-[110%]">
              desktop &<br />
              web licence
            </span>
          </div>
          <p className="opacity-80 !text-base !mt-0">
            Squeezy can be used for both desktop and web. Simple licensing:
            Personal and commercial use allowed, no pageview count.
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-x-10 mt-4 sm:mt-10">
            <ShopifyButton
              label={"Buy"}
              shopItemId={8815969796426}
              uniqueElementId={"woff2"}
            ></ShopifyButton>
          </div>
        </div>
      </section>

      <footer className={`relative flex-wrap ${styles.footer}`}>
        {/* <div style={{ width: 12 * themes.length + 4 * (themes.length - 1) }}></div> */}
        <div className="flex w-full items-center p-4 justify-between">
          <div className="flex  items-center gap-4 px-4 rounded-full backdrop:blur-[8px] py-1.5 bg-[var(--foreground-shade-20)]">
            <div className={`${styles.themeSwitch}`}>
              {/* style={{ width: 12 * themes.length + 4 * (themes.length - 1) }} */}
              {themes.map((thisTheme, index) => {
                return (
                  <button
                    key={index}
                    data-index={index}
                    className={`${styles.switch} ${thisTheme} ${
                      index === theme ? styles.active : ""
                    }`}
                    onClick={() => changeTheme(index)}
                  ></button>
                );
              })}
            </div>
            <div className="flex w-full relative items-center gap-4 isolate">
              <div
                // href="#info"
                onClick={(e) =>
                  document.getElementById("info").scrollIntoView()
                }
                className={`scroll-smooth cursor-pointer hover:opacity-80 transition-opacity ${
                  currentSection !== 0 ? "hidden sm:block" : ""
                } ${currentSection === 0 ? "opacity-100" : "opacity-60"}`}
              >
                Info
              </div>
              <div
                // href="#try"
                onClick={(e) => document.getElementById("try").scrollIntoView()}
                className={`scroll-smooth cursor-pointer hover:opacity-80 transition-opacity ${
                  currentSection !== 1 ? "hidden sm:block" : ""
                } ${currentSection === 1 ? "opacity-100" : "opacity-60"}`}
              >
                Try It
              </div>
              <div
                onClick={(e) =>
                  document.getElementById("grid").scrollIntoView()
                }
                className={`scroll-smooth cursor-pointer hover:opacity-80 transition-opacity ${
                  currentSection !== 2 ? "hidden sm:block" : ""
                } ${currentSection === 2 ? "opacity-100" : "opacity-60"}`}
              >
                Characters
              </div>
              <div
                onClick={(e) => document.getElementById("buy").scrollIntoView()}
                className={`scroll-smooth cursor-pointer hover:opacity-80 transition-opacity ${
                  currentSection !== 3 ? "hidden sm:block" : ""
                } ${currentSection === 3 ? "opacity-100" : "opacity-60"}`}
              >
                Info & Buy
              </div>
            </div>
          </div>
          <a
            href="https://overnice.com"
            className="hidden sm:block ml-auto rounded-full hover:scale-105 transition-transform text-[var(--background)] text-base md:text-lg py-1.5 px-4 bg-[var(--foreground)]"
          >
            Made by Overnice
          </a>
          <div
            onClick={toggleDetails}
            className="flex cursor-pointer  ml-auto sm:hidden rounded-full w-[39px] h-[39px] items-center justify-center bg-[color-mix(in_srgb,_var(--foreground-shade-20)_50%,_transparent)] hover:bg-[var(--foreground-shade-30)] transition-colors"
          >
            i
          </div>
        </div>
        <div
          className={`bg-[var(--foreground)] w-full transition-[max-height] ${
            openDetails ? "max-h-40" : "max-h-0"
          } h-fit overflow-hidden`}
        >
          <div className="p-6">
            <p className="text-[var(--background)] mb-4 text-lg">
              A squishable and squashable variable font
            </p>
            <a
              href="https://overnice.com"
              className="rounded-full hover:scale-105 transition-transform text-[var(--foreground)] text-base md:text-lg py-1.5 px-4 bg-[var(--background)]"
            >
              Made by Overnice
            </a>
          </div>
        </div>
      </footer>

      {gyroPermissionGranted === false && (
        <div
          className={`${styles.accessButtonContainer} inset-0 fixed z-[1000]`}
          style={{ visibility: gyroButtonVisibility }}
        >
          <button
            ref={gyroButton}
            id="accelPermsButton"
            className={`${styles.accessButton} fixed px-4 py-2 rounded-full top-1/2 left-1/2 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 z-[100]`}
            onClick={getAccel}
          >
            Activate Gyro Sensor
          </button>
        </div>
      )}
    </main>
  );
}
