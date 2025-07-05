import React, { useState, useEffect } from 'react';
import featureImg1 from '../assets/news/1.jpeg';
import featureImg2 from '../assets/news/2.jpeg';
import featureImg3 from '../assets/news/3.jpeg';
import featureImg4 from '../assets/news/4.jpeg';
import featureImg5 from '../assets/news/5.jpeg';
import featureImg6 from '../assets/news/6.jpeg';
import videoIcon from "../assets/images/video-icon.png";

const NewsInfoSection = () => {
  const images = [featureImg1, featureImg2, featureImg3, featureImg4, featureImg5, featureImg6];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const dayOfWeek = currentTime.toLocaleString("en-US", { weekday: "short" });
  const dayOfMonth = currentTime.getDate();
  const formattedTime = currentTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <section className="container flex items-start justify-between flex-col lg:flex-row">
    {/* Left Side Content */}
    <div className="relative xl:w-[670px] mb-[50px] lg:mb-0">
        <h2 className="heading">Get virtual Consultations anytime.</h2>
        <ul className="pl-4">
        <li className="text_para">1. Schedule the appointment directly.</li>
        <li className="text_para">2. Search for your expert here.</li>
        <li className="text_para">3. Use the scheduling tool for appointments.</li>
        </ul>

        {/* Date and Time Container */}
        <div className="w-[150px] lg:w-[248px] bg-white mt-5 lg:mt-10 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px] shadow-md">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-[6px] lg:gap-3">
            <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">
                {dayOfWeek}, {dayOfMonth}
            </p>
            <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]">
                {formattedTime}
            </p>
            </div>
            <span className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]">
            <img src={videoIcon} alt="video icon" />
            </span>
        </div>
        <div className="bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[800] mt-2 lg:mt-4 rounded-full">
            Start live consultation now!
        </div>
        <div className="bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[12px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[800] mt-2 lg:mt-4 rounded-full">
            Get latest news!
        </div>
        </div>
    </div>

    {/* Right Side Image Carousel */}
    <div className="relative xl:w-[770px] mt-[50px] lg:mt-0">
    <h2 className="heading mb-8">Get latest news!</h2>
    <img src={images[currentImageIndex]} className="w-full sm:w-5/6 md:w-3/4" alt="News carousel" />
    <button onClick={handlePrev} className="absolute top-1/2 left-0">◀</button>
    <button onClick={handleNext} className="absolute top-1/2 right-0">▶</button>
    </div>
    </section>

  );
};

export default NewsInfoSection;
