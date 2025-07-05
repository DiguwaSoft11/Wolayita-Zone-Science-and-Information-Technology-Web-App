import convertTime from "../../utils/convertTime";
import { BASE_URL } from "./../../config";
import { token } from "./../../config";
import { toast } from "react-toastify";

const SidePanel = ({expertId, ticketPrice, timeSlots}) => {

  const bookingHandler = async () => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${expertId}`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message + " Please try again");
      }

      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">Book appointment</h2>
      <h2 className="mt-[10px] text-[26px] leading-9 text-headingColor font-[700] text-center">and</h2>
      <h2 className="mt-[10px] text-[26px] leading-9 text-headingColor font-[700] text-center">Recive ID on Email</h2>
      <div className="mt-[30px] flex items-center justify-between">
        <p className="text_para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} Birr
        </span>
      </div>
      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-heading Color">
          Available Time Slots:
        </p>
        <ul className="mt-3">
          {timeSlots?.map((item, index) =>
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
              </p>
            </li>
          )}


        </ul>
      </div>

      <button onClick={bookingHandler} className="btn px-2 w-full rounded-md">Book Appointment</button>
    </div>
  );
};

export default SidePanel;
