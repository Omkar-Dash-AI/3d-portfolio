

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import Banner from "./components/banner";
import Footer from "./components/footer";
import ProjectsRouter from "./projects";
import ChatbotComponent from "./components/chatbot";


// App
const App = () => {
  const [hide, setHide] = useState(true);

  return (
    <BrowserRouter>
      <Banner hide={hide} setHide={setHide} />
      <Routes>
        <Route path="/projects/*" element={<ProjectsRouter />} />
        <Route path="*" element={
          <div className="relative z-0 bg-primary">
            <div className="bg-primary bg-cover bg-no-repeat bg-center">
              <Navbar hide={hide} />
              <Hero />
            </div>
            <About />
            <Experience />
            <Tech />
            <Works />
            <Feedbacks />

            {/* Contact */}
            <div className="relative z-0">
              <Contact />
              <StarsCanvas />
            </div>
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
              <ChatbotComponent />
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
