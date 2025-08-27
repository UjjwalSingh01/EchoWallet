import { useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import hero from "../assets/hero.jpeg";
import graph from "../assets/graph.png";
import group from "../assets/group.webp";
import transaction from "../assets/transaction1.jpg";
import { Box, Container } from "@mui/system";
import { useNavigate } from "react-router-dom";

export type DesktopType = {
  className?: string;
};

const Desktop = ({ className = "" }) => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-in");
          } else {
            entry.target.classList.remove("slide-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <main className={`w-full bg-darkslateblue flex flex-col items-center py-16 px-6 ${className}`} ref={(el) => { if (el) sectionsRef.current[0] = el as HTMLDivElement; }}>
      <div className="w-[90%] flex flex-col justify-center items-center">
        <header className="w-full py-6 flex justify-between items-center px-6 text-lavenderblush text-2xl font-outfit">
          <b className="font-roboto text-[44px] font-bold text-white">EchoWallet</b>
          <nav className="flex gap-8 text-white">
            <a href="#about" className="font-roboto text-[26px] font-bold no-underline text-white">About</a>
            <a href="#features" className="font-roboto text-[26px] font-bold no-underline text-white">Features</a>
            <a href="#contact" className="font-roboto text-[26px] font-bold no-underline text-white">Contact</a>
          </nav>
        </header>

        <section id="about" className="w-full flex flex-col items-center gap-10 my-10" >
          <div className="relative w-full h-[650px] overflow-hidden rounded-lg">
            <img 
              src={hero} 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-6 space-y-6 bg-gradient-to-r from-black/60 to-transparent">
              <b className="text-white font-roboto-flex text-[40px] lg:text-[54px] inline-block">
                Innovative <br />
                Financial <br />
                Management
              </b>
              <p className="text-white font-roboto text-[20px] lg:text-[26px]">
                Seamless and intuitive experience in <br />
                managing finances, tracking expenditures, <br />
                and making transactions.
              </p>
              <div className="flex mt-5 gap-4">
                <Button onClick={() => navigate('/register')} variant="contained" sx={{ borderRadius: 10, bgcolor:"#2BC9F4", paddingRight: 5, paddingLeft: 5 }}>
                  Get Started
                </Button>
                <Button variant="contained" sx={{ borderRadius: 10, bgcolor:"#2BC9F4", fontFamily: 'Roboto', paddingRight: 5, paddingLeft: 5, fontSize: 15 }}>
                  Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="flex-col w-[90%] text-snow justify-center items-center font-noto-sans-math text-xl">
          <div className="flex items-center justify-center mb-12">
            <hr style={{ border: 'none', borderTop: '1px solid white', width: '50%' }} />
            <p className="text-white font-otomanopee-one text-[50px] font-bold px-10">Features</p>
            <hr style={{ border: 'none', borderTop: '1px solid white', width: '50%' }} />
          </div>  

          <div className="flex flex-col items-center justify-center md:flex-row gap-6 section" ref={(el) => sectionsRef.current[1] = el!}>
            <img src={graph} alt="Graph" className="w-1/2 h-auto lg:w-[600px] lg:h-[300px] rounded-lg" />
            <p className="text-[15px] lg:text-[22px] font-noto-sans-math text-center md:w-1/2">
                Visualize your spending habits with a dynamic dashboard that graphically represents your monthly expenditures.
                Easily track where your money is going and make informed financial decisions.
            </p>
          </div>


          <div className="flex flex-col my-14 items-center justify-center md:flex-row-reverse gap-4 section" ref={(el) => sectionsRef.current[2] = el!}>
            <img src={group} alt="Group" className="w-1/2 h-auto lg:w-[600px] lg:h-[300px] rounded-lg" />
            <p className="md:w-1/2 text-[15px] lg:text-[22px] font-noto-sans-math text-center">
              Effortlessly manage shared expenses by creating groups with your friends and splitting payments. Easily add
              friends to the group, assign costs, and settle up without any hassle, keeping finances clear and organized.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center md:flex-row gap-4 section" ref={(el) => sectionsRef.current[3] = el!}>
            <img src={transaction} alt="Transaction" className=" w-1/2 h-auto lg:w-[600px] lg:h-[300px] rounded-lg" />
            <p className="md:w-1/2 text-[15px] lg:text-[22px] font-noto-sans-math text-center">
              Make transactions seamlessly and keep a comprehensive record of your financial activities at your fingertips.
              Easily search, review, and analyze your spending patterns.
            </p>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid white', width: '100%', marginTop: 50, marginBottom: 50 }} />

        <footer id="contact" className="bg-[#0d1b42] py-12 w-[90%]">
          <Container className="text-center text-gray-400">
            <p className="text-white mb-4 font-rounded-mplus-1c text-[26px]">EchoWallet</p>
            <Button onClick={() => navigate('/register')} variant="contained" sx={{ borderRadius: 10, bgcolor:"#2BC9F4", paddingRight: 5, paddingLeft: 5 }}>
              Get Started
            </Button>
            <Box className="flex justify-center gap-8 my-6">
              <a href="#about" className="text-inherit no-underline">About</a>
              <a href='#features' className="text-inherit no-underline">Features</a>
              <a href='#contact' className="text-inherit no-underline">Contact</a>
              <a className="text-inherit no-underline">Support</a>
              <a className="text-inherit no-underline">Reviews</a>
            </Box>
            <Typography variant="body2" className="text-gray-400">
              © All Rights Reserved EchoWallet 2024
            </Typography>
          </Container>
        </footer>
      </div>
    </main>
  );
};

export default Desktop;
