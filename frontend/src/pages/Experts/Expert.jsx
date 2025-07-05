import { useState, useEffect } from "react";
import ExpertCard from "./../../components/Experts/ExpertCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
//import {expertss} from './../../assets/data/experts';
 

const Experts = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");

  const handleSearch = () => {
    setQuery(query.trim());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);

    return () => clearTimeout(timeout);
  }, [query]);

  const { data: experts, loading, error } = useFetchData(`${BASE_URL}/experts?query=${debounceQuery}`);
  const { data: approvedExperts, loading: approvedLoading, error: approvedError } = useFetchData(`${BASE_URL}/experts?isApproved=approved`);

  return (
    <>
      <section className="">{/*className="bg-[#fff9ea]"*/}
        <div className="container text-center">
          <h2 className="heading">Find an Expert</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search expert by name or speciality"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn mt-0 rounded-[0px] rounded-r-md" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>
      

     

      <section>
        <div className="container">
          {loading && <Loading />}
          {error && <Error errMessage={error} />}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {/*expertss.map(expert => (
                <ExpertCard key={expert._id} expert={expert} />
              ))*/}



              {approvedExperts.map(expert => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our customers say</h2>
            <p className="text_para text-center">
            World-standard services for everyone. Our deparment offers unmatched, expert services.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};



export default Experts;
