
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://static.readdy.ai/image/20ad1bc5945550ba19ba043b533d395f/0bc61b1a189a23051110fdfdddaf4ca4.png" 
              alt="DML Logo" 
              className="w-20 h-20 font-bold"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Services
            </Link>
            <Link to="/track" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Tracking
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth/signin" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Sign In
            </Link>
            <Link to="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl text-gray-700`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                Home
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                Services
              </Link>
              <Link to="/track" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                Tracking
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                Contact
              </Link>
              
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <Link to="/auth/signin" className="block text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium">
                  Sign In
                </Link>
                <Link to="/auth/signup" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center cursor-pointer font-medium">
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;