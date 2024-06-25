// import React from 'react'
import { useState } from 'react'
import { Container, Title, Desc, CardContainer, ToggleButtonGroup, ToggleButton, Divider } from './ProjectsStyle'
import ProjectCard from '../Cards/ProjectCards'
import { projects } from '../../data/constants'
import Vortex from '../IntUI/vortex';

const Projects = ({ openModal, setOpenModal }) => {
  const [toggle, setToggle] = useState('all');
  return (
    <Container id="projects">
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden">

        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center md:px-10 py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">

            <Title>Projects</Title>
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            <Desc>
              I have worked on a wide range of projects. From Web Apps to DSA and Machine Learning. Here are some of my projects.
            </Desc>
          </p>
        </Vortex></div>

      <ToggleButtonGroup >
        {toggle === 'all' ?
          <ToggleButton active value="all" onClick={() => setToggle('all')}>All</ToggleButton>
          :
          <ToggleButton value="all" onClick={() => setToggle('all')}>All</ToggleButton>
        }
        <Divider />
        {toggle === 'web app' ?
          <ToggleButton active value="web app" onClick={() => setToggle('web app')}>WEB APP'S</ToggleButton>
          :
          <ToggleButton value="web app" onClick={() => setToggle('web app')}>WEB APP'S</ToggleButton>
        }
        <Divider />
        {toggle === 'dsa' ?
          <ToggleButton active value="android app" onClick={() => setToggle('dsa')}>DATA STRUCTURES AND ALGORITHMS</ToggleButton>
          :
          <ToggleButton value="dsa" onClick={() => setToggle('dsa')}>DATA STRUCTURES AND ALGORITHMS</ToggleButton>
        }
        <Divider />
        {toggle === 'machine learning' ?
          <ToggleButton active value="machine learning" onClick={() => setToggle('machine learning')}>MACHINE LEARNING</ToggleButton>
          :
          <ToggleButton value="machine learning" onClick={() => setToggle('machine learning')}>MACHINE LEARNING</ToggleButton>
        }
      </ToggleButtonGroup>
      <CardContainer>
        {toggle === 'all' && projects
          .map((project, id) => (
            <ProjectCard key={id} project={project} openModal={openModal} setOpenModal={setOpenModal} />
          ))}
        {projects
          .filter((item) => item.category === toggle)
          .map((project, id) => (
            <ProjectCard key={id} project={project} openModal={openModal} setOpenModal={setOpenModal} />
          ))}
      </CardContainer>
    </Container>
  )
}

export default Projects