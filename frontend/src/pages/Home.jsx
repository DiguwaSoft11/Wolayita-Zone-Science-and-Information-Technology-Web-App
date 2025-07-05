import React from 'react';
import { useState, useEffect } from "react";
import Testimonial from '../components/Testimonial/Testimonial';
import icon02 from '../assets/images/icon02.gif'; 
import faqImg from "../assets/images/faq-img.png";
import FaqList from "../components/Faq/FaqList";
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import About from "../components/About/About";
import ServiceList from '../components/Services/ServiceList';
import ExpertList from "../components/Experts/ExpertList";
import NewsInfoSection from './NewsInfoSection';

import useFetchData from '../hooks/useFetchData'; 
import { BASE_URL } from '../config'; 
import Loader from "../components/Loader/Loading";
import Error from "../components/Error/Error";





const Home = () => {

  const handleVideoLoad = () => {
    setLoading(false); // Hide loader when video is loaded
  };

  const { data: experts, loading, error } = useFetchData(`${BASE_URL}/experts`);


  // Load the Facebook SDK
    {/*window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: 'v14.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));*/}


  return (
    <>
      {/* hero section */}
      <section className="hero_section pt-[50px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
            
            {/* hero content */}
            <div>
              <div className="lg:w-[700px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                  We help to create solutions across every corner.
                </h1>
                <p className="text_para text-justify">Welcome to the Wolaita Zone Science and Technology Department, 
                where we bring cutting-edge technology to every corner of our community. 
                Our platform is designed to connect users across woredas, kebeles, and beyond with expert advice, 
                maintenance support, and tailored solutions through seamless digital channels. Whether you're managing complex machinery or 
                tackling everyday tech challenges, our video consultations and virtual chats ensure that help is always within reach.
                 Empowering communities and driving innovation,
                 we are committed to delivering solutions that reach everyone, everywhere.</p>
                <button className="btn">Request an Appointment</button>
              </div>
              
              {/* The opposite of lg:hidden in Tailwind CSS, which hides an element on larger 
              screens (lg and above), is hidden lg:block. This hides the element on small 
              screens and only displays it on larger screens.*/}

              {/* Mobile view: video before counter */}
              <div className="block lg:hidden mt-[30px]">
                
                
                {/*<div>
                  <video className="w-[90%] rounded-lg" autoPlay loop muted>
                    <source src={heroImg01} type="video/mp4" />
                  </video>
                </div>*/}

                
                <div className="py-[30px] px-5">
                  <div className="flex items-center justify-center">
                    {loading && <Loader />} {/* Display loader while loading */}
                    
                    <video
                    src="https://res.cloudinary.com/dnsnj1z1g/video/upload/v1729761011/heroimg01_360p_laftlw.mp4"
                    className={`w-full h-[200px] ${loading ? 'hidden' : ''}`} // Hide video while loading
                    autoPlay
                    loop
                    muted
                    onLoadedData={handleVideoLoad} // Trigger video load event
                    />
                  </div>
                </div>

                {/* Hero counter for mobile */}
                <div className="mt-[30px] flex flex-col gap-5">
                  <div>
                    <h2 className="text-[36px] leading-[56px] font-[700] text-headingColor">
                      20+
                    </h2>
                    <span className="w-[100px] h-2 rounded-full block mt-[-14px]" style={{ backgroundColor: '#fde68a' }}></span>
                    <p className="text_para">Years of Experience</p>
                  </div>
                  <div>
                    <h2 className="text-[36px] leading-[56px] font-[700] text-headingColor">
                      8+
                    </h2>
                    <span className="w-[100px] h-2 rounded-full block mt-[-14px]" style={{ backgroundColor: '#fde68a' }}></span>
                    <p className="text_para">Field of Expertise</p>
                  </div>
                  <div>
                    <h2 className="text-[36px] leading-[56px] font-[700] text-headingColor">
                      100%
                    </h2>
                    <span className="w-[100px] h-2 rounded-full block mt-[-14px]" style={{ backgroundColor: '#fde68a' }}></span>
                    <p className="text_para">Client Satisfaction!</p>
                  </div>
                </div>
              </div>

              {/* Desktop view: original layout */}
              {/*hero counter*/}
              <div className="hidden lg:block">
                <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      20+
                    </h2>
                    <span className="w-[100px] h-2 rounded-full block mt-[-14px]" style={{ backgroundColor: '#fde68a' }}></span>
                    <p className="text_para">Years of Experience</p>
                  </div>
                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      8+
                    </h2>
                    <span className="w-[100px] h-2 rounded-full block mt-[-14px]" style={{ backgroundColor: '#fde68a' }}></span>
                    <p className="text_para">Field of Experties</p>
                  </div>
                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      100%
                    </h2>
                    <span className="w-[100px] h-2 rounded-full block mt-[-14px]" style={{ backgroundColor: '#fde68a' }}></span>
                    <p className="text_para">client sutsfuction!</p>
                  </div>
                </div>
              </div>
            </div>

            {/*hero content*/}
            
              
                {/*<div>
                  <video className="w-[90%] rounded-lg" autoPlay loop muted>
                    <source src={heroImg01} type="video/mp4" />
                  </video>
                </div>*/}


                {/* Desktop view */}
                <div className="hidden lg:block">
                  <div className="flex gap-[30px] justify-end">
                    {loading && <Loader />} {/* Display loader while loading */}
                    <div className="w-[90%] rounded-lg">
                      <video 
                      src="https://res.cloudinary.com/dnsnj1z1g/video/upload/v1729761011/heroimg01_360p_laftlw.mp4"
                      className={`w-[500px] h-[200px] ${loading ? 'hidden' : ''}`} // Hide video while loading
                      autoPlay
                      loop
                      muted
                      onLoadedData={handleVideoLoad} // Trigger video load event
                      />

                    </div>
                    
                  </div>
                </div>


          </div>
        </div>
      </section>
  

      {/* hero section end*/}
      < section >
        <div className="container">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center"> Providing the best tech based services
            </h2>
            <p className="text_para text-center">
              World-standard services for everyone. Our department offers unmatched, expert services.
            </p>
          </div> 
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5">
              {loading && <Loader />}
              {error && <Error message={error} />}
              <div className="w-full h-[200px] overflow-hidden relative">
                <div className="absolute inset-0 whitespace-nowrap animate-scroll">
                  {experts && experts.length > 0 ? (
                    experts.map((expert) => (
                      <div key={expert._id} className="inline-block mx-2">
                        <img
                          src={expert.photo} // Use the correct field name for the photo
                          alt={expert.name}
                          className="w-[150px] h-[200px] rounded-lg object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No experts available at the moment.</p>
                  )}
                </div>
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Find an Expert</h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Our department is built up of world-class experts, with unmatched nationwide services.
                </p>
                <Link
                  to='/experts'
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover: text-black w-6 h-5" />
                </Link>
              </div>
            </div>


            <div className="py-[30px] px-5">

              <div className="flex items-center justify-center w-[100%] "><img src={icon02} alt="" /></div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Find a Location</h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Get expert services from our department in person, we will accept you with hospitality.
                </p>
                <Link
                  to='/experts'
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover: text-black w-6 h-5" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                {loading && <Loader />} {/* Display loader while loading */}
                <video
                src="https://res.cloudinary.com/dnsnj1z1g/video/upload/v1729760999/book_appointment_720p_wgthkd.mp4"
                className={`w-full h-[200px] ${loading ? 'hidden' : ''}`} // Hide video while loading
                autoPlay
                loop
                muted
                onLoadedData={handleVideoLoad} // Trigger video load event
                />
              </div>
              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Book Appointment</h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Book for virtual video and chat schedule. World-standard services await you anytime, anywhere.
                </p>
                <Link
                  to='/experts'
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover: text-black w-6 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* on V1.2 img changed to vids this is orginal of V1.0 */}

          {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center w-[100%] "><img src={icon01} alt="" /></div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Find an Expert</h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                Our department is built up of world class experts, with unmatched nation wide services.
                </p>
                <Link to='/experts' className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none">
                  <BsArrowRight className="group-hover: text-black w-6 h-5" />
                </Link>
              </div>
            </div>
            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center"><img src={icon02} alt="" /></div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Find a Location</h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                 Get expert services from our department in person, we will accept you in hospitality .
                </p>
                <Link to='/experts' className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none">
                  <BsArrowRight className="group-hover: text-black w-6 h-5" />
                </Link>
              </div>
            </div>
            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center"><img src={icon03} alt="" /></div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Book Appointment</h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                Book for virtual video and chat schedule,  World-standard services  are waiting for you any time any where
                </p>
                <Link to='/experts' className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none">
                  <BsArrowRight className="group-hover: text-black w-6 h-5" />
                </Link>
              </div>
            </div>
              </div>*/}
        </div>
      </section >

      {/* About Section start */}

      <About/>

      {/* About Section start */}

      {/*services section*/}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our expert and technical services</h2>
            <p className="text_para text-center">
            World-standard services for everyone. Our department offers unmatched, expert services.
            </p>
          </div>
          <ServiceList/>
        </div>
      </section>
      {/* services section end */}

      {/* News_Info Section section */}
      
      <NewsInfoSection />

      {/* News_Info Section section end */}

      {/* our great Experts */}
      {/*<section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our Great Experts</h2>
            <p className="text_para text-center">
            World-standard services for everyone. Our department offers unmatched, expert services.
            </p>
          </div>
          <ExpertList/>
        </div>
      </section>*/}
      {/* our great Experts end */}
      
      {/* faq section */}
      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 hidden md:block">
              <img src={faqImg} alt="" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="heading">
                Most asked questions by customers
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>
      {/* faq section end */}

      {/* testimonial */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our customers say</h2>
            <p className="text_para text-center">
            World-standard services for everyone. Our department offers unmatched, expert services.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>

  );
};

export default Home;
