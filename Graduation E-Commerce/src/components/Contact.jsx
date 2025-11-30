import { useState } from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Contact() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const messageText = formData.get('message');

        try {
            const response = await fetch('https://discord.com/api/webhooks/1444804570009178213/Fu0rn018vg3R5ZiYvVnJV5mWm2kLyun8esouKvUsgbGu5Q8U2PtCJB7zz2X5bh4XfDBi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [{
                        title: '📧 New Contact Form Submission',
                        color: 0xec4899,
                        fields: [
                            {
                                name: '👤 Name',
                                value: name,
                                inline: true
                            },
                            {
                                name: '📧 Email',
                                value: email,
                                inline: true
                            },
                            {
                                name: '💬 Message',
                                value: messageText
                            }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: 'E-Commerce Contact Form'
                        }
                    }]
                })
            });

            if (response.ok) {
                setMessage('Thank you for your message! We will get back to you soon.');
                e.target.reset();
            } else {
                setMessage('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessage('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="w-full" style={{ backgroundColor: "#4a0023" }}>
            {/* Header */}
            <div className="text-white py-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
                <p className="mt-2 text-gray-200 max-w-xl mx-auto">
                    Nihil aliquid unde perferendis, laborum alias vero repudiandae voluptates
                </p>
            </div>

            {/* CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
                <div className="grid md:grid-cols-2 gap-10">
                    
                    {/* LEFT – FORM BOX */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>

                        {message && (
                            <div className={`mb-4 p-3 rounded-lg ${message.includes('Thank you') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                <p className="text-sm">{message}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div>
                                <label className="block text-gray-700 mb-1">Your name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your name"
                                    required
                                    disabled={loading}
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 mb-1">Your Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your@email.com"
                                    required
                                    disabled={loading}
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-gray-700 mb-1">Your Message</label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    placeholder="Tell us about your fragrance needs ..."
                                    required
                                    disabled={loading}
                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 disabled:bg-gray-100"
                                ></textarea>
                            </div>

                            {/* Button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-pink-600 text-white py-3 rounded-xl font-medium hover:bg-pink-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT – INFO BOX */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <h3 className="text-2xl font-semibold mb-8">Contact Information</h3>

                        <div className="space-y-8">
                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="bg-pink-200 p-3 rounded-full text-pink-700">
                                    <FiPhone size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium">Phone</h4>
                                    <p className="text-gray-600">+1 (234) 567-8888</p>
                                    <p className="text-gray-500 text-sm">Mon–Fri: 9am–6pm</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="bg-pink-200 p-3 rounded-full text-pink-700">
                                    <FiMail size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium">Email</h4>
                                    <p className="text-gray-600">contact@perfume.com</p>
                                    <p className="text-gray-500">support@oerfume.com</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="bg-pink-200 p-3 rounded-full text-pink-700">
                                    <FiMapPin size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium">Our Boutique</h4>
                                    <p className="text-gray-600">123 Perfume Street</p>
                                    <p className="text-gray-500">Paris, France 75001</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <h4 className="text-xl font-semibold mt-10 mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-200 p-3 rounded-full text-pink-700 hover:bg-pink-300 transition">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-pink-200 p-3 rounded-full text-pink-700 hover:bg-pink-300 transition">
                                <FaFacebookF size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-pink-200 p-3 rounded-full text-pink-700 hover:bg-pink-300 transition">
                                <FaTwitter size={20} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Contact;