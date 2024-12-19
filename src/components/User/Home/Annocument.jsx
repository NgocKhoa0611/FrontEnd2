const Annocument = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[30%]">
            <img 
              src="./images/banner-1.png" 
              className="w-full h-[340px] object-cover rounded-lg shadow-md" 
              alt="Promotional Banner 1"
            />
          </div>
          <div className="w-full md:w-[68%]">
            <img 
              src="./images/banner-2.png" 
              className="w-full h-[340px] object-cover rounded-lg shadow-md" 
              alt="Promotional Banner 2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Annocument;