import React from 'react';
import { Instagram, Facebook, Youtube, Github, Mail, Phone, MapPin, Heart, Music } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/moodify', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/moodify', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com/moodify', label: 'YouTube' },
    { icon: Github, href: 'https://github.com/moodify', label: 'GitHub' },
  ];

  const contactDetails = [
    { icon: MapPin, text: '123 Melody Lane, Music City, 403709' },
    { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: Mail, text: 'contact@moodify.com', href: 'mailto:contact@moodify.com' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-gray-300 font-sans relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-7">
          
          {/* Brand Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {/* <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div> */}
              <h3 className="text-xl font-bold text-white py-2">Moodify</h3>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              "Where your emotions meet their perfect melody." Playlists curated for every mood and moment.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for music lovers</span>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white py-2 px-7">Contact Us</h4>
            <ul className="space-y-2">
              {contactDetails.map((detail, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <detail.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  {detail.href ? (
                    <a href={detail.href} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                      {detail.text}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">{detail.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white py-2">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-purple-400 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Join our community and stay updated with the latest playlists.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-2 sm:space-y-0">
          <p>&copy; {year} Moodify. All Rights Reserved.</p>
          <p>Crafting musical experiences since 2023</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-purple-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-purple-400">Terms</a>
            <a href="#cookies" className="hover:text-purple-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;