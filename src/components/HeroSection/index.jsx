// import HeroBgAnimation from '../HeroBgAnimation'
import { HeroContainer, HeroBg, HeroLeftContainer, HeroInnerContainer, TextLoop, Title, Span, SubTitle, ResumeButton, HeroRightContainer } from './HeroStyle'

import Typewriter from 'typewriter-effect';
import { Bio } from '../../data/constants';
import GlobeDemo from '../IntUI/gglobe';


const HeroSection = () => {
    return (

        <div id="about">
            <HeroContainer>
                {/* <HeroBg>  </HeroBg> */}
                <HeroInnerContainer >
                    <HeroLeftContainer id="Left">
                        <Title>
                            <TextLoop>
                                <Span>
                                    <Typewriter
                                        options={{
                                            strings: Bio.languages,
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                </Span>
                            </TextLoop>I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                                {Bio.name}
                            </span></Title>

                        <SubTitle>{Bio.description}</SubTitle>
                        <ResumeButton href={Bio.resume} target='display'>Check Resume</ResumeButton>
                    </HeroLeftContainer>

                    <HeroRightContainer>
                        <GlobeDemo />
                    </HeroRightContainer>

                </HeroInnerContainer>

            </HeroContainer>
        </div>
    )
}

export default HeroSection