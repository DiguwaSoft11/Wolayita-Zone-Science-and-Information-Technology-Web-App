import React from "react";
import { services } from './../../assets/data/services';
import ServiceCard from "./ServiceCard";

const ServiceList = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[5px] mt-[30px] lg:mt-[55px]">
            {services.map((item, index) => (
                <div className="flex flex-col h-full">
                    <ServiceCard item={item} index={index} key={index} />
                </div>
            ))}
        </div>
    );
};

export default ServiceList;
