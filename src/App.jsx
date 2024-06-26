import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme, lightTheme } from './utils/Themes.js';
import Navbar from "./components/Navbar";
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Experience from "./components/Experience";
import Education from "./components/Education";
import ProjectDetails from "./components/ProjectDetails";
import styled from "styled-components";
import StarsCanvas from "./components/IntUI/StarBackground.tsx";

const Body = styled.div`
  background-color: #030014;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 12; /* Ensure content is above the stars canvas */
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [openModal, setOpenModal] = useState({ state: false, project: null });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Navbar />
        <Body>
          <StarsCanvas />
          <ContentWrapper>
            <HeroSection />
            <Skills />
            <Experience />
            <Projects openModal={openModal} setOpenModal={setOpenModal} />
            <Education />
            <Contact />
            <Footer />
            {openModal.state && (
              <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
            )}
          </ContentWrapper>
        </Body>
      </Router>
    </ThemeProvider>
  );
}

export default App;
