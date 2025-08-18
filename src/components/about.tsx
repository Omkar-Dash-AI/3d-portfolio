import { Tilt } from "react-tilt";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { SERVICES } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

type ServiceCardProps = {
  index: number;
  title: string;
  icon: string;
  isGenAI?: boolean;
};

// Service Card
const ServiceCard = ({ index, title, icon }: ServiceCardProps) => {
  return (
    <Tilt
      options={{
        max: 45,
        scale: 1,
        speed: 450,
      }}
      className="xs:w-[250px] w-full"
    >
      <motion.div
        whileHover={{ scale: 1.08, boxShadow: "0 0 30px #00ffd0" }}
        variants={{
          hidden: { x: -100, y: 0, opacity: 0 },
          show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              type: "spring" as const,
              delay: 0.5 * index,
              duration: 0.75,
              ease: "easeOut"
            }
          }
        }}
        className={`w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card relative ${title === "Gen AI Developer" ? "genai-glow" : ""}`}
      >
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">
            {title}
            {title === "Gen AI Developer" && (
              <span className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xs animate-pulse shadow-lg border border-white/20">
                LIVE
              </span>
            )}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

// About
export const About = () => {
  // Typewriter effect for intro
  const fullText = "Highly motivated and multi-driven software developer with hands-on experience in building dynamic, responsive web applications. Passionate about AI, machine learning, and computer vision. Proficient in both front-end and back-end development, with a strong ability to deliver clean, efficient, and maintainable code. Strong foundation in machine learning, deep learning, and generative AI, with practical experience in designing, developing, and deploying intelligent models for real-world applications. Quick to adapt to emerging technologies and committed to delivering impactful solutions. Enthusiastic about exploring new skills and applying innovative ideas to drive continuous improvement.";
  const [typedText, setTypedText] = useState("");
  const idxRef = useRef(0);
  useEffect(() => {
    setTypedText("");
    idxRef.current = 0;
    const interval = setInterval(() => {
      if (idxRef.current < fullText.length) {
        setTypedText((prev) => prev + (fullText[idxRef.current] || ""));
        idxRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 8);
    return () => clearInterval(interval);
  }, []);
  return (
    <SectionWrapper idName="about">
      <div className="relative overflow-visible rounded-2xl">
        {/* Introduction Overview Box - deep blue/sky blue */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            variants={{
              hidden: { y: 50, opacity: 0 },
              show: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring" as const,
                  duration: 1,
                  delay: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900 via-sky-500 to-blue-400 shadow-xl rounded-2xl p-12 mb-8"
          >
            <p className={styles.sectionSubText}>Introduction</p>
            <h2 className={styles.sectionHeadText}>Overview.</h2>
            <motion.p
              variants={{
                hidden: { x: 0, y: 0, opacity: 0 },
                show: {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.1,
                    duration: 1,
                    ease: "easeOut"
                  }
                }
              }}
              className="mt-8 text-black text-[19px] max-w-3xl leading-[34px] min-h-[140px] px-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {typedText}
              <span className="animate-blink text-white">|</span>
            </motion.p>
          </motion.div>
          {/* Service Card */}
          <div className="mt-10 flex flex-row gap-10 justify-center items-center">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} index={i} {...service} />
            ))}
          </div>
        </div>
        {/* Floating bubbles/particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-30 animate-float"
              style={{
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
