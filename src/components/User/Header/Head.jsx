
const Head = () => {
  return (
    <section className="bg-[#0f3460] text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-start items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <i className="fa fa-phone text-sm"></i>
            <span className="text-sm">+88012 3456 7894</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-envelope text-sm"></i>
            <span className="text-sm">fashionverse3@gmail.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Head;