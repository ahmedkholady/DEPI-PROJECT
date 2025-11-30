import { FiPercent, FiGift, FiClock } from "react-icons/fi";

function Offers() {
    const offers = [
        {
            id: 1,
            title: "Hot Summer Sale",
            description: "Up to 30% off on our summer perfume collection",
            endDate: "2026-08-31",
            code: "SUMMER30",
            color: "bg-yellow-200",
            border: "border-yellow-600",
            icon: <FiPercent size={22} />,
        },
        {
            id: 2,
            title: "Free Perfume Offer",
            description:
                "Get a free perfume when you buy two products from our luxury brands",
            endDate: "2026-09-15",
            code: "FREEPERFUME",
            color: "bg-purple-200",
            border: "border-purple-600",
            icon: <FiGift size={22} />,
        },
        {
            id: 3,
            title: "New launch Discount",
            description: "20% off on our newly launched perfumes",
            endDate: "2026-07-30",
            code: "NEW20",
            color: "bg-pink-200",
            border: "border-pink-600",
            icon: <FiPercent size={22} />,
        },
    ];

    return (
        <section id="offers" className="py-16 px-4 max-w-7xl mx-auto">
            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-900">
                    Special Offers
                </h2>
                <p className="text-gray-600 mt-2">
                    Take advantage of these limited-time offers
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className={`${offer.color} rounded-2xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105`}
                    >
                        {/* Icon */}
                        <div className="flex justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {offer.title}
                            </h3>

                            <div className="bg-white text-black p-2 rounded-full shadow">
                                {offer.icon}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 mt-3">{offer.description}</p>

                        {/* End Date */}
                        <div className="flex items-center mt-4 text-gray-800 font-medium">
                            <FiClock className="mr-2" />
                            Ends on {offer.endDate}
                        </div>

                        {/* Input */}
                        <div className="mt-5">
                            <label className="text-gray-700 text-sm">Use Code</label>
                            <input
                                type="text"
                                value={offer.code}
                                readOnly
                                className="w-full px-3 py-2 bg-white rounded-xl border border-gray-300 mt-1 font-bold text-gray-700"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(offer.code);
                                alert(`Promo code "${offer.code}" copied to clipboard!`);
                            }}
                            className={`w-full mt-5 py-2 rounded-xl font-medium text-gray-800 border ${offer.border} hover:bg-white transition`}
                        >
                            Claim Offer
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Offers;