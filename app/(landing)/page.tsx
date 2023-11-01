  "use client"
  import { LandingNavbar } from "@/components/landing-navbar";
  import { LandingHero } from "@/components/landing-hero";
  import { LandingContent } from "@/components/landing-content";
  import { Parallax, ParallaxLayer } from '@react-spring/parallax'
  import InstructionCard from '@/components/ui/instructionCard';
  import InstructionImage from "@/components/ui/instructionImage";
  import img2 from '@/public/img2.jpg'
  import img1 from '@/public/img1.jpg'
  import robot from '@/public/robot.jpg'
  



  const LandingPage = () => {
    
    return ( 
      <div>
        <Parallax 
          pages={4}
          >
          <ParallaxLayer 
          speed={1}
          factor={7}
          style={{backgroundImage:`url(${img2.src})`, backgroundSize:'cover' }}
          >
            <LandingNavbar />
            <LandingHero/>
          </ParallaxLayer>
          <ParallaxLayer 
            offset={1}
            speed={0.5}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black with 70% opacity */
              display:'grid',
              gridTemplateColumns:'50% 50%',
              gridTemplateRows:'50% 50%',
              zIndex:'1'
            }}
            >
              <InstructionCard title="  AI-Powered Image Generation"
                description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
              />
              <InstructionImage backgroundImage={robot.src} gridColumn="2 / 3" gridRow="1 / 3"/>

          </ParallaxLayer>
          <ParallaxLayer offset={2}
           style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black with 70% opacity */
            display:'grid',
            gridTemplateColumns:'50% 50%',
            gridTemplateRows:'50% 50%',
            zIndex:'1'}}
            speed={0.5}
         >
              <InstructionImage backgroundImage={robot.src} gridColumn="1 / 2" gridRow="1 / 3"/>
              <InstructionCard title="  AI-Powered Image Generation"
                description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
              />
            
          </ParallaxLayer>
          <ParallaxLayer offset={3}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black with 70% opacity */
                          display:'grid',
                          gridTemplateColumns:'50% 50%',
                          gridTemplateRows:'50% 50%',
                          zIndex:'1'}}
              speed={0.5}
          >
             <InstructionCard title="  AI-Powered Image Generation"
                description=" Unleash Your Imagination with AI! Enter a prompt, and watch as our cutting-edge AI models craft high-quality images tailored to your creativity. From dreamlike landscapes to unique artworks, let your ideas come to life with just a few words."
              />
              <InstructionImage backgroundImage={robot.src} gridColumn="2 / 3" gridRow="1 / 3"/>

          </ParallaxLayer>
        </Parallax>
      </div>
    );
  }
  
  export default LandingPage;
