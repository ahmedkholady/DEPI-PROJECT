import productImage from "../assets/product.jpg";

function About() {
    return (
        <section id="about" className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Image Section */}
            <div className="relative">
                <img
                    src={productImage}
                    alt="Perfume Bottle"
                    className="w-full h-[380px] md:h-[420px] object-cover rounded-3xl shadow-lg"
                />

                {/* Overlay text */}
                <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold drop-shadow-md">Since 2010</h3>
                    <p className="text-sm drop-shadow-md mt-1">
                        Lorem ipsum dolor sit amet consectetur
                    </p>
                </div>
            </div>

            {/* Text Section */}
            <div>
                <h2 className="text-3xl font-bold text-amber-900">About Us</h2>
                <p className="text-gray-600 mt-4 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia eveniet
                    totam, quos nesciunt explicabo doloribus necessitatibus rerum. Ut et quam
                    sapiente? Numquam sit eligendi natus. Tenetur maxime quasi aut eveniet?
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="border rounded-2xl p-4 shadow-sm bg-white">
                        <h3 className="text-rose-600 font-bold text-xl">500+</h3>
                        <p className="text-gray-700 text-sm mt-1">Unique fragrances</p>
                    </div>

                    <div className="border rounded-2xl p-4 shadow-sm bg-white">
                        <h3 className="text-rose-600 font-bold text-xl">50+</h3>
                        <p className="text-gray-700 text-sm mt-1">Countries worldwide</p>
                    </div>

                    <div className="border rounded-2xl p-4 shadow-sm bg-white">
                        <h3 className="text-rose-600 font-bold text-xl">100%</h3>
                        <p className="text-gray-700 text-sm mt-1">Customer satisfaction</p>
                    </div>

                    <div className="border rounded-2xl p-4 shadow-sm bg-white">
                        <h3 className="text-rose-600 font-bold text-xl">24/7</h3>
                        <p className="text-gray-700 text-sm mt-1">Customer support</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;