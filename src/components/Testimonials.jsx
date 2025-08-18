import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';

const testimonials = [
  {
    text: "Omkar has an exceptional grasp of AI and machine learning concepts. He built an intelligent model for us that not only solved our problem but also opened new opportunities for automation.",
    name: "Rajesh Kumar",
    title: "Lead Data Scientist, TechNova",
    avatar: "avatar-placeholder.png",
  },
  {
    text: "I was impressed by Omkar's ability to quickly learn and apply cutting-edge generative AI techniques. His project delivery was not just technically sound but also innovative.",
    name: "Ananya Gupta",
    title: "AI Research Fellow, DeepAI Labs",
    avatar: "avatar-placeholder.png",
  },
  {
    text: "Omkar combines software development skills with deep AI knowledge. He built a seamless ML pipeline for us, and the performance improvement was beyond expectations.",
    name: "Michael Chen",
    title: "CTO, VisionX Solutions",
    avatar: "avatar-placeholder.png",
  },
  {
    text: "What sets Omkar apart is his curiosity and drive. He doesn't just code; he experiments, iterates, and refines until the solution is truly impactful.",
    name: "Sophia Martinez",
    title: "Product Manager, InnovateHub",
    avatar: "avatar-placeholder.png",
  },
  {
    text: "Omkar's work on computer vision was game-changing for our prototype. His ability to bridge theory and practical implementation is rare in a student.",
    name: "Arjun Mehta",
    title: "Founder, PixelTech",
    avatar: "avatar-placeholder.png",
  },
  {
    text: "Omkar is highly motivated and detail-oriented. His contribution to our AI hackathon project demonstrated both technical excellence and strong teamwork.",
    name: "Emily Johnson",
    title: "Hackathon Mentor, CodePath",
    avatar: "avatar-placeholder.png",
  },
];

const TestimonialCard = ({ index, text, name, title, avatar }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full"
  >
    <p className="text-white font-black text-[48px]">"</p>
    <div className="mt-1">
      <p className="text-white tracking-wider text-[18px]">{text}</p>
      <div className="mt-7 flex justify-between items-center gap-1">
        <div className="flex-1 flex flex-col">
          <p className="text-white font-medium text-[16px]">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="mt-1 text-secondary text-[12px]">{title}</p>
        </div>
        <img
          src={avatar}
          alt={`feedback-by-${name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  return (
    <div className="mt-12 bg-black-100 rounded-[20px]">
      <div className={`${styles.padding} bg-tertiary rounded-2xl min-h-[300px]`}>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        </motion.div>
      </div>
      <div className={`${styles.paddingX} -mt-20 pb-14 flex flex-wrap gap-7`}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name}
            index={index}
            {...testimonial}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Testimonials, "");
