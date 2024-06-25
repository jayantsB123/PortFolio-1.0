// import React from "react";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styled from "styled-components";
import { experiences } from "../../data/constants";
import ExperienceCard from "../Cards/ExperienceCard";
import { Vortex } from "../IntUI/vortex.tsx";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-contnet: center;
  margin-top: 50px;
  position: rlative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1600px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Experience = () => {
  return (
    <Container id="Experience">
      <Wrapper>
        
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden">

<Vortex
  backgroundColor="black"
  className="flex items-center flex-col justify-center md:px-10 py-4 w-full h-full"
>
  <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
    <Title>Experience</Title>
  </h2>
  <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
    <Desc>Innovative Software Engineer with a Passion for Collaboration:
      Crafting Solutions, Building Teams, and Transforming Ideas into
      Exceptional Projects
    </Desc>
  </p>
</Vortex></div>

        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </Wrapper>
    </Container>
  );
};

export default Experience;