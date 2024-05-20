"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { isMobile } from "react-device-detect";
import styles from "./page.module.css";
import Grid from "./Grid/grid";
import ShopifyButton from './Shopify/ShopifyButton'
import BuyNow from './Shopify/BuyNow'

import localFont from 'next/font/local'
 
// Font files can be colocated inside of `pages`
const TT_NEORIS = localFont({ src: '../../public/fonts/TT_Neoris_Variable.woff2' })
const SQUEEZY = localFont({ src: '../../public/fonts/SqueezyVF.woff2' })

export default function Home() {
  const [currentLetter, setCurrentLetter] = useState("K");
  const [currentWidth, setCurrentWidth] = useState();
  const [snappedWidth, setSnappedWidth] = useState('400');
  const [renderedLetters, setRenderedLetters] = useState([currentLetter]);
  const [renderedLettersWidths, setRenderedLettersWidths] = useState([]);
  const [gyroPermissionGranted, setGyroPermissionGranted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [gyroButtonVisibility, setGyroButtonVisibility] = useState('hidden')
  const gyroButton = useRef()

  const themes = ["black", "red", "blue", "pink"];
  const [theme, setTheme] = useState(0);

  const changeTheme = (newTheme) => {
    if (theme === themes.length - 1) {
      setTheme(0);
    } else {
      setTheme(theme + 1);
    }

    if (newTheme === theme) {
      // console.log(theme);
      return;
    }
    // console.log(newTheme);
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

      if (snappedWidth !== snappedWidth.current) setSnappedWidth(snappedWidth);

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

  useEffect(() => {
    if (isMobile) setGyroButtonVisibility('visible')
  }, [gyroButtonVisibility])

  // Gyro
  function getAccel() {
    if (
      navigator.userAgent.match(/Android/i)
    ) {
      setGyroPermissionGranted(true);
      // Android
      let delta;
      const ratio = 300 / 30;
  
  
      window.addEventListener("deviceorientation", (e) => {
        delta = Math.abs(e.gamma);
  
        if (delta > 0 && delta < 30) {
          const width = 400 + delta * ratio;
  
          const snappedWidth = snappedWidths.reduce(function (prev, curr) {
            return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
          });
  
          setSnappedWidth(snappedWidth);
          setCurrentWidth(width);
        }
      });
    } else {
      // IOS
      DeviceMotionEvent.requestPermission().then((response) => {
        if (response == "granted") {
          setGyroPermissionGranted(true);
          let delta;
          const ratio = 300 / 30;
  
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
  }

  // RANDOM LETTERS
  useEffect(() => {
    const random = () => {
      return Math.floor(Math.random() * heroLetterSet.length);
    };

    setCurrentLetter(heroLetterSet[random()]);
    setRenderedLetters((v) => [...v, currentLetter]);
    setRenderedLettersWidths((v) => [...v, snappedWidth]);

    renderedLetters.length > 4 && renderedLetters.shift();
    renderedLettersWidths.length > 4 && renderedLettersWidths.shift();
  }, [snappedWidth]);

  // Update Theme on body
  useEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
        entries.map((entry, i) => {
          const main = document.querySelector('main')
          if (entry.isIntersecting) {
            setCurrentSection(+entry.target.dataset.index)
            console.log('enter',+entry.target.dataset.index)
            if (+entry.target.dataset.index === 2) {
              console.log(main)
              if (main) main.style.scrollSnapType = 'none'
            } else {

              if (main) main.style.scrollSnapType = 'y mandatory'
            }
          } else {

          }
        })
      },
      {
        threshold: 0.1
      }
    )
    const targets = document.querySelectorAll('section');
    targets.forEach(x => observer.observe(x))
  }, [])
  
  return (
    <main
      className={`${styles.main} ${TT_NEORIS.className}`}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      </Head>
      <header className={styles.header}>
        <div className="flex items-center gap-x-4">
          <a href="https://overnice.com">
            <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.4029 23.8945C10.2161 23.8945 9.6893 22.17 9.6893 15.039C9.6893 7.81474 10.2161 6.18346 12.4029 6.18346C14.5898 6.18346 15.1166 7.90796 15.1166 15.039C15.1166 22.17 14.5898 23.8945 12.4029 23.8945ZM12.4029 0.108887C1.46856 0.108887 0 7.51955 0 14.9458C0 23.1798 1.03757 30.0001 12.4029 30.0001C23.3373 30.0001 24.8059 22.4807 24.8059 15.0545C24.7899 6.82043 23.7683 0.108887 12.4029 0.108887Z"
              fill="#FEFEFE"/>
            </svg>
          </a>
          <h1 className={styles.title}>Squeezy VF</h1>
        </div>

        <div className={`hidden sm:block ${styles.subtitle}`}>A squishable and squashable variable font</div>

        <BuyNow label={"Buy now"} shopItemId={8815969796426} uniqueElementId={'woff'}></BuyNow>
      </header>

      <section data-index='0' className={styles.variableLines} ref={variableLinesSectionRef}>
        {/* Width Lines */}
        <p className={styles.width}>{snappedWidth}</p>
        {/* 
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
        </div> */}
        {/* ------ Letters ------ */}
        <div className={`${styles.letters} ${SQUEEZY.className}`}>
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


      <section data-index='1' className={[styles.editor, SQUEEZY.className].join(' ')} ref={editableSectionRef}>
        <p
          className={[styles.editableArea, SQUEEZY.className].join(' ')}
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
      <section data-index='3' className={`max-w-2xl px-4 mx-auto space-y-10 h-[100lvh] content-center ${styles.prose}`}>
          <h1 className={`grow not-prose ${styles.left} ${SQUEEZY.className}`} style={{"--delay": '0s'}} ref={headerRef}>Squeezy</h1>
          <p className="text-xl md:!text-3xl leading-[110%]">
          How would a variable font look like, that feels like it could be squished, extended and would still keep its shape?
          All characters keep their core while being extremely flexible.
          There’s likely a lot more to talk about, but maybe we just leave it at that.
          </p>
          {/* <h1 className={`grow ${styles.right}`} style={{"--delay": '0s'}} ref={headerRef}>Squeezy</h1> */}
        
        <div className='flex w-full p-6 sm:p-10 flex-col justify-center gap-y-6 sm:gap-y-10 rounded-2xl bg-[var(--foreground-shade-20)]'>
          <div className='flex flex-col items-start justify-center gap-y-2 sm:gap-y-4 self-stretch'>
            <div className="flex items-center gap-x-2">
              <span className='text-[40px]'>$50</span>
              <span className='flex flex-col text-base leading-[110%]'>per<br/>license</span>
            </div>
            <p className="opacity-60 !text-base !mt-0">
              Squeezy can be purchased for desktop and to be embedded on websites.
              Simple licensing: Personal and commercial use allowed, no pageview count.
            </p>
            <div className="flex items-center gap-x-6 sm:gap-x-10">
              <BuyNow label={"Desktop (.ttf)"} shopItemId={8825090572618} uniqueElementId={'ttf'}></BuyNow>
              <BuyNow label={"Web (.woff2)"} shopItemId={8825090572618} uniqueElementId={'woff'}></BuyNow>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        {gyroPermissionGranted === false && (
          <div>
            <button
              ref={gyroButton}
              id="accelPermsButton"
              className={styles.accessButton}
              style={{'visibility': gyroButtonVisibility}}
              onClick={getAccel}
            >
              Activate Gyro Sensor
            </button>
          </div>
        )}
        <div
            className={styles.themeSwitch}
            style={{ width: 12 * themes.length + 4 * (themes.length - 1) }}
          >
            {themes.map((thisTheme, index) => {
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
          <div className={`hidden sm:block ${currentSection === 0 ? styles.active : styles.inactive}`}>Info</div>
          <div className={`hidden sm:block ${currentSection === 1 ? styles.active : styles.inactive}`}>Try It</div>
          <div className={`hidden sm:block ${currentSection === 2 ? styles.active : styles.inactive}`}>Characters</div>
          <div className={`hidden sm:block ${currentSection === 3 ? styles.active : styles.inactive}`}>Info & Buy</div>
      </footer>
    </main>
  );
}
