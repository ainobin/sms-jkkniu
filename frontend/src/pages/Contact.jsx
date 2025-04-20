import { Mail, Phone, MapPin, Globe, Clock, ExternalLink } from "lucide-react";

const Contact = () => {
    return (
        <div className="mt-28 min-h-screen bg-white/40">

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Contact Information Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-[#008337] py-4 px-6">
                            <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <MapPin className="text-[#008337] w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">JKKNIU Register Office, JKKNIU</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Mail className="text-[#008337] w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <a href="mailto:store@jkkniu.edu.bd" className="font-medium text-[#008337] hover:underline">
                                        store@jkkniu.edu.bd
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Phone className="text-[#008337] w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <a href="tel:+8801234567890" className="font-medium text-[#008337] hover:underline">
                                        +880 1234 567 890
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Globe className="text-[#008337] w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Website</p>
                                    <a
                                        href="https://jkkniu.edu.bd/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-[#008337] hover:underline"
                                    >
                                        jkkniu.edu.bd
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Clock className="text-[#008337] w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Office Hours</p>
                                    <p className="font-medium">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-full bg-gray-100 relative">
                            <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('/api/placeholder/600/400')` }}></div>
                            <div className="relative h-full flex items-center justify-center p-6">
                                <div className="bg-white/90 p-6 rounded-xl shadow-md text-center">
                                    <MapPin className="w-10 h-10 mx-auto mb-4 text-[#008337]" />
                                    <h3 className="text-xl font-semibold mb-2">Campus Location</h3>
                                    <p className="text-gray-600 mb-4">Visit us at our main campus location</p>
                                    <a
                                        href="https://maps.app.goo.gl/C8noUPLZbiuCPhAG6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#008337] text-white px-4 py-2 rounded-lg hover:bg-[#006e2e] transition"
                                    >
                                        <span>View on Google Maps</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-10 bg-gradient-to-r from-[#008337] to-[#005c24] rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">Our Development Team</h3>
                                <p className="text-green-100">
                                    Learn about the developers behind this project and reach out for technical support.
                                </p>
                            </div>
                            <a
                                href="/developers"
                                className="inline-flex items-center bg-white text-[#008337] font-medium px-6 py-3 rounded-lg hover:bg-green-50 transition shadow-sm"
                            >
                                Meet the Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;