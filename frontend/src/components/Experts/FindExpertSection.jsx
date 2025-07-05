import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import useFetchData from "./../../hooks/useFetchData";
import { BASE_URL } from "./../../config";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const FindExpertSection = () => {
  const { data: experts, loading, error } = useFetchData(`${BASE_URL}/experts`);

  return (
    <div className="py-[30px] px-5">
      {loading && <Loader />}
      {error && <Error message={error} />}
      {!loading && !error && (
        <div className="overflow-x-auto flex gap-4">
          {experts.map(expert => (
            <div key={expert._id} className="flex-shrink-0 w-[150px] h-[200px]">
              <img
                src={expert.photo}
                alt={expert.name}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-[30px]">
        <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Find an Expert</h2>
        <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
          Our department is built up of world-class experts, with unmatched nationwide services.
        </p>
        <Link
          to='/experts'
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
        >
          <BsArrowRight className="group-hover:text-black w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default FindExpertSection;
