
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/0bc61b1a189a23051110fdfdddaf4ca4.png" 
                alt="DML Logistics" 
                className="w-24 h-24 object-contain font-bold"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted logistics partner delivering excellence across the globe. Fast, reliable, and secure shipping solutions for businesses of all sizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link to="/freight" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Air Cargo Services
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Global Trade Solutions
                </Link>
              </li>
              <li>
                <Link to="/warehousing" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Smart Warehousing
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Supply Chain Management
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Track Package
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Latest Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 DML Logistics. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
