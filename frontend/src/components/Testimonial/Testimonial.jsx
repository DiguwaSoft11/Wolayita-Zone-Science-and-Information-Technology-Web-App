import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css'; // Import the swiper-bundle.min.css file
import { HiStar } from 'react-icons/hi';
import SwiperCore, { Pagination } from 'swiper/core';
import { testimonials } from './../../assets/data/testimonials'; // Import testimonials

SwiperCore.use([Pagination]);

// Import avatars
import maleAvatar1 from '../../assets/images/avatars/male/1.png';
import maleAvatar2 from '../../assets/images/avatars/male/2.png';
import maleAvatar3 from '../../assets/images/avatars/male/3.png';
import maleAvatar4 from '../../assets/images/avatars/male/4.png';
import maleAvatar5 from '../../assets/images/avatars/male/5.png';

import femaleAvatar1 from '../../assets/images/avatars/female/1.png';
import femaleAvatar2 from '../../assets/images/avatars/female/2.png';
import femaleAvatar3 from '../../assets/images/avatars/female/3.png';
import femaleAvatar4 from '../../assets/images/avatars/female/4.png';
import femaleAvatar5 from '../../assets/images/avatars/female/5.png';

const maleAvatars = [maleAvatar1, maleAvatar2, maleAvatar3, maleAvatar4, maleAvatar5];
const femaleAvatars = [femaleAvatar1, femaleAvatar2, femaleAvatar3, femaleAvatar4, femaleAvatar5];

const getRandomAvatar = (gender) => {
  const avatars = gender === "male" ? maleAvatars : femaleAvatars;
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

const Testimonial = () => {
  const [avatarUrls, setAvatarUrls] = useState({});

  useEffect(() => {
    // Generate random avatars for all testimonials once on component mount
    const urls = testimonials.reduce((acc, testimonial) => {
      acc[testimonial.name] = getRandomAvatar(testimonial.gender);
      return acc;
    }, {});
    setAvatarUrls(urls);
  }, []);

  return (
    <div className='mt-[30px] lg:mt-[55px]'>
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: true }} // Ensure dynamic bullets
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="py-[30px] px-5 rounded-3">
              <div className="flex items-center gap-[13px]">
                <img
                  src={avatarUrls[testimonial.name]}
                  alt={testimonial.name}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="text-yellowColor w-[18px] h-5" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[16px] leading-7 mt-4 text-textColor font-[400]">
                {testimonial.feedback}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
