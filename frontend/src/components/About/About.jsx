import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import aboutImg from "../../assets/images/about.png";
import aboutCardImg from "../../assets/images/about-card.png";
import aboutImg2 from "../../assets/images/about2.png";
import aboutCardImg2 from "../../assets/images/about-card2.png";
import aboutImg3 from "../../assets/images/about3.png";
import aboutCardImg3 from "../../assets/images/about-card3.png";

const About = () => {
    const [currentImg, setCurrentImg] = useState(aboutImg);
    const [currentCardImg, setCurrentCardImg] = useState(aboutCardImg);

    useEffect(() => {
        const images = [aboutImg, aboutImg2, aboutImg3];
        const cardImages = [aboutCardImg, aboutCardImg2, aboutCardImg3];

        let imgIndex = 0;

        const interval = setInterval(() => {
            imgIndex = (imgIndex + 1) % images.length;
            setCurrentImg(images[imgIndex]);
            setCurrentCardImg(cardImages[imgIndex]);
        }, 2000); // Change every 2 seconds

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    return (
        <section>
            <div className="container">
                <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
                    
                    {/* about content */}
                    <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2">
                        <h2 className="heading">Proud to be empowering Digital Ethiopia 2025</h2>
                        
                        {/* Image Container for Mobile */}
                        <div className="block lg:hidden my-6 text-center">
                            <div className="relative inline-block">
                                <img src={currentImg} alt="" className="w-3/4 mx-auto" />
                                <div className="absolute z-20 bottom-0 w-[200px] md:w-[250px] left-1/2 transform -translate-x-1/2">
                                    <img src={currentCardImg} alt="" />
                                </div>
                            </div>
                        </div>

                         
                        <p className="text_para mt-[30px] text-justify">
                        We have made significant strides as a nation since beginning our digital transformation journey. 
                        Digital Ethiopia 2025 empowers us to thrive in the digital economy, necessitating support for innovators 
                        and the creation of digital enablers. Today's mid-term review allows us to assess our challenges and celebrate 
                        the remarkable milestones we've reached in a short span.
                        </p>
                        <Link to="/">
                            <button className="btn">Learn More</button>
                        </Link>
                    </div>

                    {/* about img for larger screens */}
                    <div className="relative w-3/4 lg:w-1/2 xl:w-[430px] z-10 order-2 lg:order-1 hidden lg:block">
                        <img src={currentImg} alt="" />
                        <div className="absolute z-20 bottom-4 w-[200px] md:w-[250px] mx-auto left-1/2 transform -translate-x-1/2 lg:ml-[350px] lg:left-auto lg:transform-none">
                            <img src={currentCardImg} alt="" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
