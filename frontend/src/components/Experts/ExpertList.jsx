import React from 'react';
import ExpertCard from "./ExpertCard";
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
//import {expertss} from './../../assets/data/experts';
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const ExpertsList = () => {
    const { data: experts, loading, error } = useFetchData(`${BASE_URL}/experts`);

    // Ensure experts is an array before mapping
    // const validExperts = Array.isArray(experts) ? expertss : [];

    return (
        <>
            {loading && <Loader />}
            {error && <Error message={error} />} {/*&& validExperts.length > 0*/}
            {!loading && !error  && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
                    {experts.map(expert => (
                        <ExpertCard key={expert._id} expert={expert} />
                    ))}
                </div>
            )}
        </>
    );
};

export default ExpertsList;
