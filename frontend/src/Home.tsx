import React from "react";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
            {/* Header */}
            <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="HealthConnect Logo" className="w-10 h-10" />
                    <span className="text-2xl font-bold text-blue-700 tracking-tight">HealthConnect</span>
                </div>
                <nav className="hidden md:flex gap-8 text-blue-700 font-semibold">
                    <button onClick={() => navigate('/onboarding')} className="hover:text-blue-900 transition">Onboarding</button>
                    <button onClick={() => navigate('/dashboard')} className="hover:text-blue-900 transition">Dashboard</button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-center flex-1 py-12 px-4 gap-10">
                <div className="flex-1 max-w-xl text-center md:text-left">
                    <h1 className="text-5xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow">Empowering Your Health Journey</h1>
                    <p className="text-xl text-gray-700 mb-6">Connect with a supportive community, access expert advice, and use AI-powered tools to take charge of your health and wellness.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition"
                            onClick={() => navigate("/onboarding")}
                        >
                            Get Started
                        </button>
                        <button
                            className="bg-gray-200 hover:bg-gray-300 text-blue-700 font-semibold px-8 py-3 rounded-lg text-lg shadow transition border border-blue-200"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                        alt="Health Community"
                        className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 px-4 bg-white/80">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex gap-4 items-start">
                        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Connect" className="w-14 h-14" />
                        <div>
                            <h3 className="text-xl font-bold text-blue-700 mb-1">Connect & Share</h3>
                            <p className="text-gray-600">Find patients with similar journeys, share experiences, and build a support network.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774301.png" alt="Doctors" className="w-14 h-14" />
                        <div>
                            <h3 className="text-xl font-bold text-blue-700 mb-1">Expert Guidance</h3>
                            <p className="text-gray-600">Consult with top doctors and get answers to your health questions.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774302.png" alt="AI" className="w-14 h-14" />
                        <div>
                            <h3 className="text-xl font-bold text-blue-700 mb-1">AI-Powered Insights</h3>
                            <p className="text-gray-600">Receive personalized recommendations and track your progress with smart tools.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774303.png" alt="Community" className="w-14 h-14" />
                        <div>
                            <h3 className="text-xl font-bold text-blue-700 mb-1">Community & Resources</h3>
                            <p className="text-gray-600">Access educational resources and join communities for ongoing support.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Banner */}
            <section className="py-10 px-4 bg-gradient-to-r from-blue-100 to-purple-100 text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">Ready to start your journey?</h2>
                <p className="text-lg text-gray-700 mb-6">Join HealthConnect and take the first step towards a healthier, more connected life.</p>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-lg text-lg shadow transition"
                    onClick={() => navigate("/onboarding")}
                >
                    Start Onboarding
                </button>
            </section>

            {/* Footer */}
            <footer className="w-full bg-white py-6 mt-auto shadow-inner">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-2">
                    <div className="flex items-center gap-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Logo" className="w-7 h-7" />
                        <span className="text-blue-700 font-bold">HealthConnect</span>
                    </div>
                    <div className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} HealthConnect. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
