import { useEffect, useState } from "react";
import Banner from "./Banner";
import NewArrivals from "./NewArrivals";
import Discount from "./Discount";
import Shop from "./Shop";
import Annocument from "./Annocument";
import Wrapper from "./Wrapper";
import Loading from "../ui/Loading";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full">
        <Banner />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="space-y-8 sm:space-y-12">
          <div className="py-4 sm:py-6">
            <NewArrivals />
          </div>

          <div className="sm:py-6">
            <Discount />
          </div>

          <div className="sm:py-6">
            <Shop />
          </div>

          <div className="sm:py-6">
            <Annocument />
          </div>

          <div className="sm:py-6">
            <Wrapper />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}