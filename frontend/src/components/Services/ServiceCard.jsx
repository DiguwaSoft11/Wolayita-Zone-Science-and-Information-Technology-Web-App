import React, { useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Loader from "../Loader/Loading"; // Import the loader

const ServiceCard = ({ item, index }) => {
    const { name, vid, bgColor, textColor } = item;
    const [loading, setLoading] = useState(true); // State for loader

    const handleVideoLoad = () => {
        setLoading(false); // Hide loader when video is loaded
    };

    return (
        <div className="flex-grow py-[30px] px-3 lg:px-5 flex flex-col justify-between">
            <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
                {name}
            </h2>
            
            <div className="py-[30px] px-5">
                <div className="flex items-center justify-center">
                    {loading && <Loader />} {/* Display loader while loading */}
                    <video
                    src={vid}
                    className={`w-full h-[200px] ${loading ? 'hidden' : ''}`} // Hide video while loading
                    autoPlay
                    loop
                    muted
                    onLoadedData={handleVideoLoad} // Trigger video load event
                    />
                </div>
            </div>


            <div className="flex items-center justify-between mt-[30px]">
                <Link
                    to="/experts"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none">
                    <BsArrowRight className="group-hover:text-black w-6 h-5" />
                </Link>
                <span
                    className="w-[44px] h-[44px] flex items-center justify-center text-[18px] leading-[30px] font-[600]"
                    style={{
                        background: `${bgColor}`,
                        color: `${textColor}`,
                        borderRadius: "6px 0 0 6px",
                    }}
                >
                    {index + 1}
                </span>
            </div>
        </div>
    );
};

export default ServiceCard;
