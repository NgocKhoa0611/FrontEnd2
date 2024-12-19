const Wrapper = () => {
  const data = [
    {
      cover: <i className="fa-solid fa-truck-fast"></i>,
      title: "Giao Hàng Toàn Cầu",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
    {
      cover: <i className="fa-solid fa-id-card"></i>,
      title: "Thanh Toán An Toàn",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
    {
      cover: <i className="fa-solid fa-shield"></i>,
      title: "Mua Sắm Tự Tin",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
    {
      cover: <i className="fa-solid fa-headset"></i>,
      title: "Hỗ Trợ 24/7",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((val, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
                  {val.cover}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{val.title}</h3>
              <p className="text-gray-600 text-sm">{val.decs}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wrapper;