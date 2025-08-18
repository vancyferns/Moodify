import React from 'react';
import { Instagram, Facebook, Youtube, Github, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  // 1. Add a 'colorClass' to each link for dynamic styling
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram', colorClass: 'instagram' },
    { icon: Facebook, href: '#', label: 'Facebook', colorClass: 'facebook' },
    { icon: Youtube, href: '#', label: 'YouTube', colorClass: 'youtube' },
    { icon: Github, href: '#', label: 'GitHub', colorClass: 'github' },
  ];

  const contactDetails = [
    { icon: MapPin, text: '123 Melody Lane, Music City, 403709' },
    { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: Mail, text: 'contact@moodify.com', href: 'mailto:contact@moodify.com' },
  ];

  return (
    <footer className="bg-[#0f0f1a] text-gray-300 font-sans relative">
      <div className="container mx-auto px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Moodify</h3>
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
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white px-4">Contact Us</h4>
            <ul className="space-y-3">
              {contactDetails.map((detail, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <detail.icon className="w-5 h-5 text-purple-400 flex-shrink-0" />
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

          {/* Follow Us Section with New Animated Icons */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white px-2">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // 2. This is the main container for each icon
                  className="group relative"
                >
                  {/* 3. The colored circle that animates on hover */}
                  <div
                    className={`icon-${link.colorClass} w-12 h-12 bg-white rounded-full flex items-center justify-center 
                                transition-all duration-300 ease-in-out
                                relative overflow-hidden z-0
                                before:content-[''] before:absolute before:bottom-0 before:left-0 
                                before:w-full before:h-0 before:rounded-full before:-z-10
                                before:transition-all before:duration-300 group-hover:before:h-full`}
                  >
                    {/* 4. The Icon itself */}
                    <link.icon className="w-6 h-6 text-black transition-colors duration-300 group-hover:text-white z-10" />
                  </div>
                  {/* 5. The Tooltip that appears on hover */}
                  <span
                    className={`tooltip-${link.colorClass} absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 
                               text-white text-xs rounded-md 
                               scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out whitespace-nowrap`}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-2 sm:space-y-0">
          <p>&copy; {year} Moodify. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-purple-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-purple-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;