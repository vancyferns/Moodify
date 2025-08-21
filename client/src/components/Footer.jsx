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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-7">
          
          {/* Brand Section */}
<div className="space-y-4 flex flex-col items-center sm:items-start">
  <div className="flex items-center justify-center sm:justify-start space-x-2">
    <h3 className="text-2xl font-bold text-white">Moodify</h3>
  </div>
  <p className="text-sm text-gray-400 max-w-sm text-center sm:text-left">
    "Where your emotions meet their perfect melody."<br/>Playlists curated for every mood and moment.
  </p>
  <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-gray-500">
    <span>Made with</span>
    <Heart className="w-4 h-4 text-red-400 fill-current" />
    <span>for music lovers</span>
  </div>
</div>

          {/* Contact Us Section */}
          <div className="order-2 md:order-none space-y-4 text-sm sm:text-base text-center md:text-left">
            <h4 className="text-center md:text-left sm:text-lg font-semibold text-white py-2">Contact Us</h4>
            <ul className="space-y-2 inline-block text-left">
              {contactDetails.map((detail, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <detail.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  {detail.href ? (
                    <a href={detail.href} className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 transition-colors">
                      {detail.text}
                    </a>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400">{detail.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
<div className="order-3 md:order-none flex flex-col items-center md:items-end space-y-6 text-center md:text-right">
  <h4 className="text-xl font-semibold text-white">Follow Us</h4>
  <div className="flex justify-center md:justify-end gap-3 md:mt-4 mt-2">
    {socialLinks.map((link, index) => (
      <a
        key={index}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.label}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-purple-400 transition-all duration-300 transform hover:scale-110"
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
        <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-center md:justify-between items-center text-xs text-gray-500 space-y-2 sm:space-y-0">
          <p className="text-center md:text-left">&copy; {year} Moodify. All Rights Reserved.</p>
          <p className="text-center md:text-left ">Crafting musical experiences since 2023</p>
          <div className="flex justify-center md:justify-end gap-3 sm:gap-4">
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








// import React from 'react';
// import '../index.css';
// import { Instagram, Facebook, Youtube, Github, Mail, Phone, MapPin, Heart, Music } from 'lucide-react';

// const Footer = () => {
//   const year = new Date().getFullYear();

//   const socialLinks = [
//     { icon: Instagram, href: 'https://instagram.com/moodify', label: 'Instagram' },
//     { icon: Facebook, href: 'https://facebook.com/moodify', label: 'Facebook' },
//     { icon: Youtube, href: 'https://youtube.com/moodify', label: 'YouTube' },
//     { icon: Github, href: 'https://github.com/moodify', label: 'GitHub' },
//   ];

//   const contactDetails = [
//     { icon: MapPin, text: '123 Melody Lane, Music City, 403709' },
//     { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
//     { icon: Mail, text: 'contact@moodify.com', href: 'mailto:contact@moodify.com' },
//   ];

//   return (
//     <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-gray-300 font-sans relative overflow-hidden">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">          
          
//           {/* Brand Section */}
//           <div className="space-y-4 flex flex-col lg:text-left justify-between">
//             <div className="flex items-center justify-center sm:justify-start space-x-2">
//               {/* <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <Music className="w-4 h-4 text-white" />
//               </div> */}
//             <h3 className="text-2xl lg:text-left font-bold text-white ">Moodify</h3>
//             </div>
//              <p className=" text-sm lg:text-left text-gray-400 max-w-sm lg:mt-2 ">
//              "Where your emotions meet their perfect melody."
//              <br />
//              &nbsp;Playlists curated for every mood and moment.
//            </p>
             
          
//              <div className="flex lg:items-left lg:text-left  justify-center md:justify-start space-x-2 text-xs text-gray-500 sm:mt-4">
//               <span>&nbsp;Made with</span>
//               <Heart className="w-4 h-4 text-red-400 fill-current" />
//               <span>for music lovers</span>
//             </div>
//           </div>

//           {/* Contact Us Section */}
//           <div className="space-y-4 flex flex-col justify-between">
//         <h3 className="text-xl font-semibold text-white mb-2 md:mb-4">Contact Us</h3>
//         <ul className="space-y-3 mx-auto max-w-min">
//           {contactDetails.map((detail, index) => (
//             <li key={index} className="flex items-center justify-start space-x-4">
//               <detail.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
//               {detail.href ? (
//                 <a href={detail.href} className="text-sm text-gray-400 hover:text-purple-400 transition-colors whitespace-nowrap">
//                   {detail.text}
//                 </a>
//               ) : (
//                 <span className="text-sm text-gray-400 whitespace-nowrap">
//                   {detail.text}
//                 </span>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

        //   {/* Follow Us Section */}
        //   <div className="space-y-4 flex flex-col lg:text-right justify-between">
        //     <h3 className="text-xl font-semibold text-white mb-2 md:mb-4">Follow Us</h3>
        //     <div className="flex justify-center lg:justify-end sm:justify-start pt-2 gap-3">
        //       {socialLinks.map((link, index) => (
        //         <a
        //           key={index}
        //           href={link.href}
        //           target="_blank"
        //           rel="noopener noreferrer"
        //           aria-label={link.label}
        //           className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-purple-400 transition-all duration-300 transform hover:scale-110"
        //         >
        //           <link.icon className="w-4 h-4" />
        //         </a>
        //       ))}
        //     </div>
        //     <p className="text-xs text-gray-500 lg:text-right md:text-left lg:pt-2">
        //       Join our community and stay updated with the latest playlists.
        //     </p>
        //   </div>
        // </div>

//         {/* Bottom Bar */}
//         <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-4 sm:space-y-0">
  
//   <div className="flex gap-4 order-1">
//     <a href="#privacy" className="hover:text-purple-400">Privacy Policy</a>
//     <a href="#terms" className="hover:text-purple-400">Terms</a>
//     <a href="#cookies" className="hover:text-purple-400">Cookies</a>
//   </div>
  
//   <p className="order-2 text-center">&copy; {year} Moodify. All Rights Reserved.</p>
  
//   <p className="order-3 text-right">Crafting musical experiences since 2023</p>
// </div>
//    </div>
//   </footer>
//   );
// };

// export default Footer;