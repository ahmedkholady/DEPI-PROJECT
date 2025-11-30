import hero from "../assets/hero.jpg";
import product from "../assets/product.jpg";
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import product4 from "../assets/product4.jpg";

function Categories() {
    const categories = [
        {
            id: 1,
            title: "Men's Collection",
            img: product, 
        },
        {
            id: 2,
            title: "Women's Collection",
            img: product1,
        },
        {
            id: 3,
            title: "Luxury Editions",
            img: product2,
        },
        {
            id: 4,
            title: "Unisex Editions",
            img: product3,
        },
        {
            id: 5,
            title: "Arabic Oud",
            img: product4,
        },
        {
            id: 6,
            title: "Gift Packages",
            img: hero,
        },
    ];

    return (
        <section id="categories" className="py-16 px-4 max-w-7xl mx-auto">
            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-900">
                    Explore Our Fragrance Collections
                </h2>
                <p className="text-gray-600 mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div 
                        key={cat.id}
                        onClick={() => {
                            const productsSection = document.getElementById('products');
                            if (productsSection) {
                                productsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer"
                    >
                        {/* Image */}
                        <img
                            src={cat.img}
                            alt={cat.title}
                            className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-500"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

                        {/* Text */}
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">{cat.title}</h3>
                            <p className="text-sm opacity-90">
                                amet consectetur adipisicing elit.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Categories;