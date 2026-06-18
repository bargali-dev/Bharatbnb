import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaDribbble,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-gray-900 mt-20 border-t">
      <div className="max-w-[1500px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-5xl">
        {/* CONTACT */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">Contact</h3>
          <p className="text-sm mb-3">
            43 MG Road, Bangalore, Karnataka 560001, India
          </p>
          <ul className="space-y-2 text-sm">
            <li>+91 87678 32511</li>
            <li>+91 96570 50812</li>
            <li>infosarthakpremiumestates.com</li>
          </ul>
        </div>

        {/* SOURCES */}
        <div className="gap-10 px-12 ">
          <h3 className="text-white text-xl font-semibold mb-4">Sources</h3>
          <div className="flex gap-10">
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Services</li>
              <li className="hover:text-white cursor-pointer">Vision</li>
              <li className="hover:text-white cursor-pointer">Mission</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
              <li className="hover:text-white cursor-pointer">Privacy</li>
            </ul>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Partners</li>
              <li className="hover:text-white cursor-pointer">Business</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">Creative</li>
            </ul>
          </div>
        </div>

        {/* LINKS + SOCIAL */}
        <div className="gap-10 px-18">
          <h3 className="text-white text-xl font-semibold mb-4">Links</h3>
          <ul className="space-y-2 text-sm mb-12 mr-40">
            <li className="hover:text-gray-900 cursor-pointer transition">
              Our Vision
            </li>
            <li className="hover:text-gray-900 cursor-pointer transition">
              About Us
            </li>
            <li className="hover:text-gray-900 cursor-pointer transition">
              Contact Us
            </li>
          </ul>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 text-xl ">
            <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />
            <FaTwitter className="cursor-pointer hover:text-blue-400 transition" />
            <FaFacebook className="cursor-pointer hover:text-blue-600 transition" />
            <FaLinkedin className="cursor-pointer hover:text-blue-500 transition" />
            <FaPinterest className="cursor-pointer hover:text-red-500 transition" />
            <FaDribbble className="cursor-pointer hover:text-pink-400 transition" />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 text-center py-6 text-sm">
        <p>
          © {new Date().getFullYear()} All Rights Reserved — Built with passion
          by {"Bharatbnb "}
          <span className="text-white font-medium">
            Sarthak Premium Bharatbnb
          </span>
        </p>

        <p className="mt-2 mr-40 text-gray-500">
          Your Trusted Bharatbnb Partner
        </p>
      </div>
    </footer>
  );
};

export default Footer;
