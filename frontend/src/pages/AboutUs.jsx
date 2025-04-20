const AboutUs = () => {
    return (
      <div className="min-h-screen mt-20 bg-white/50 px-6 py-12 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="bg-white border-l-4 border-green-600 p-6 rounded-lg shadow-lg transform transition duration-300 hover:shadow-xl">
            <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
              About This Web App
            </h1>
            <p className="text-lg leading-7 text-gray-700">
              This web application is designed to streamline and digitize the
              <span className="font-semibold text-amber-500">
                {" "}
                Store Management System{" "}
              </span>
              of
              <span className="font-semibold text-teal-600">
                {" "}
                Jatiya Kabi Kazi Nazrul Islam University
              </span>
              . It replaces the traditional manual processes with a smarter,
              faster, and more reliable digital solution.
            </p>
          </div>
  
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-t-4 border-blue-500 p-6 rounded-lg shadow-md transform transition duration-300 hover:shadow-xl hover:translate-y-1">
              <div className="flex items-center mb-3">
                <div className="bg-teal-100 p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Purpose</h2>
              </div>
              <p className="text-gray-600 leading-7">
                The app provides efficient control over inventory, purchase records,
                product listings, and store-related activities. It enables
                university staff to manage and track inventory, issue items, and
                maintain records with ease and accuracy.
              </p>
            </div>
  
            <div className="bg-white border-t-4 border-rose-500 p-6 rounded-lg shadow-md transform transition duration-300 hover:shadow-xl hover:translate-y-1">
              <div className="flex items-center mb-3">
                <div className="bg-rose-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Problems It Solves</h2>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Eliminates paperwork and manual data handling
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prevents misplacement or duplication of inventory
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Improves transparency and accountability
                </li>
              </ul>
            </div>
          </div>
  
          {/* Key Features Section */}
          <div className="bg-white border-l-4 border-amber-500 p-6 rounded-lg shadow-md transform transition duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Key Features</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium text-gray-700">Digital Inventory Tracking</span>
                </div>
                <p className="text-sm text-gray-600">Complete digital transformation of inventory management</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Role Management</span>
                </div>
                <p className="text-sm text-gray-600">Admin and user role-based access control</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Approval System</span>
                </div>
                <p className="text-sm text-gray-600">Streamlined request and approval workflow</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="font-medium text-gray-700">Dashboard Analytics</span>
                </div>
                <p className="text-sm text-gray-600">Interactive dashboard with real-time statistics</p>
              </div>
            </div>
          </div>
  
          {/* Support Footer */}
          <div className="bg-indigo-50 border-t-4 border-indigo-500 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold text-indigo-700">Facing any issues?</span> We're here to help!
              </p>
            </div>
            <a
              href="/developers"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition transform hover:scale-105"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUs;