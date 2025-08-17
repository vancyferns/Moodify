import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { UserCircle, LogOut } from "lucide-react";
import Moodify_logo from "../assets/Moodify_logo3i.png";
import wavesgif from "../assets/waves22.gif";

const SESSION_KEY = "moodify_auth"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);       // hamburger menu
  const [menuOpen, setMenuOpen] = useState(false);   // profile dropdown
  const [showToast, setShowToast] = useState(false); // logout toast

  const desktopRef = useRef(null);
  const mobileRef  = useRef(null);

  const navigate = useNavigate();
  const { session, setSession } = useAuth();

  useEffect(() => {
    if (!session) {
      const stored = localStorage.getItem(SESSION_KEY) || localStorage.getItem("session"); // legacy
      if (stored) {
        try { setSession(JSON.parse(stored)); } catch {}
      }
    }
  }, [session, setSession]);

  useEffect(() => {
    function onClickOutside(e) {
      const inDesktop = desktopRef.current?.contains(e.target);
      const inMobile  = mobileRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const displayName =
    session?.user?.name ||
    session?.user?.fullName ||
    (session?.user?.email ? session.user.email.split("@")[0] : "User");

  const email = session?.user?.email || "";

  const handleLogout = (e) => {
    e?.stopPropagation?.(); 
    if (!window.confirm("Are you sure you want to logout?")) return;

    
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("session"); 
    localStorage.removeItem("token");

    setSession(null);
    setMenuOpen(false);
    setIsOpen(false);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);

    navigate("/signin", { replace: true });
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/songs", label: "Songs" },
    { to: "/history", label: "History" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-6 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to="/" className="flex items-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          <img src={Moodify_logo} alt="Moodify Logo" className="h-8 w-14 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
          Moodify
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-8 text-sm">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="hover:text-purple-400">
            {l.label}
          </Link>
        ))}

        {!session ? (
          <Link to="/account" className="hover:text-purple-400">SignUp / SignIn</Link>
        ) : (
          <div className="relative" ref={desktopRef}>
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="hover:opacity-90"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {displayName?.charAt(0)?.toUpperCase()}
              </div>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-3 w-64 bg-[#111426] border border-white/10 rounded-2xl shadow-xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <UserCircle className="w-9 h-9" />
                  <div>
                    <div className="font-semibold">{displayName}</div>
                    <div className="text-xs text-gray-300">{email}</div>
                  </div>
                </div>
                <div className="pt-3 flex flex-col gap-2">
                  <button onClick={handleLogout} className="mt-1 inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-400">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:hidden flex items-center gap-3">
        {session && (
          <div className="relative" ref={mobileRef}>
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="hover:opacity-90"
              aria-label="Open profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {displayName?.charAt(0)?.toUpperCase()}
              </div>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-3 w-64 bg-[#111426] border border-white/10 rounded-2xl shadow-xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <UserCircle className="w-9 h-9" />
                  <div>
                    <div className="font-semibold">{displayName}</div>
                    <div className="text-xs text-gray-300">{email}</div>
                  </div>
                </div>
                <div className="pt-3 flex flex-col gap-2">
                  <button onClick={handleLogout} className="mt-1 inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-400">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen((s) => !s)}
          className="focus:outline-none bg-transparent p-0 flex items-center justify-center"
          style={{ height: "2.5rem", width: "2.5rem" }}
          aria-label="Open menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-21.5 left-0 w-full h-[calc(100vh-64px)]
                        bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#2a2a40]
                        shadow-lg shadow-purple-900/40 flex flex-col items-center pt-16 pb-8 space-y-8
                        text-xl font-semibold z-40 max-h-[540px] overflow-y-auto">
          <img src={wavesgif} alt="Background waves" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />



          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="inline-block px-6 py-2 rounded-full 
                         bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 
                         text-transparent bg-clip-text font-extrabold tracking-wide
                         hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 
                         hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40
                         transition-all duration-300 ease-out relative z-10"
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link
              to="/account"
              onClick={() => setIsOpen(false)}
              className="inline-block px-6 py-2 rounded-full 
                         bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 
                         text-transparent bg-clip-text font-extrabold tracking-wide
                         hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 
                         hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40
                         transition-all duration-300 ease-out relative z-10"
            >
              SignUp / SignIn
            </Link>
          )}
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur border border-white/15 text-white px-4 py-2 rounded-xl shadow-lg">
          Logged out successfully
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Moodify_logo from "../assets/Moodify_logo3i.png";
// import wavesgif from "../assets/waves22.gif";
// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-6 py-4 flex items-center justify-between text-white">
//       {/* Logo */}
//       <div className="text-xl font-bold">
//         <Link to="/" className="flex items-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
//           <img src={Moodify_logo}  
//           alt="Moodify Logo"
//           className="h-8 w-14 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
//           /> 
//           Moodify
//         </Link>
//       </div>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex space-x-8 text-sm">
//         <Link to="/" className="hover:text-purple-400">Home</Link>
//         <Link to="/about" className="hover:text-purple-400">About</Link>
//         <Link to="/how-it-works" className="hover:text-purple-400">How it works</Link>
//         <Link to="/songs" className="hover:text-purple-400">Songs</Link>
//         <Link to="/history" className="hover:text-purple-400">History</Link>
         
//         <Link to="/account" className="hover:text-purple-400">SignUp / SignIn</Link> 
//       </div>

//      {/* Hamburger Icon*/}
//       <div className="md:hidden flex items-center">
//         <button 
//           onClick={() => setIsOpen(!isOpen)} 
//           className="focus:outline-none  bg-transparent p-0 flex items-center justify-center"
//           style={{ height: '2.5rem' , width: "2.5rem"}}
//         >
//           <div className="w-6 h-5 flex flex-col justify-between">
//             <span 
//               className={`block h-0.5 w-full bg-white transition-all duration-300 ${
//                 isOpen ? 'rotate-45 translate-y-2' : ''
//               }`}
//             ></span>
//             <span 
//               className={`block h-0.5 w-full bg-white transition-all duration-300 ${
//                 isOpen ? 'opacity-0' : 'opacity-100'
//               }`}
//             ></span>
//             <span 
//               className={`block h-0.5 w-full bg-white transition-all duration-300 ${
//                 isOpen ? '-rotate-45 -translate-y-2' : ''
//               }`}
//             ></span>
//           </div>
//         </button>
//       </div>


//       {/*Dropdown Menu */}
//       {isOpen && (
//           //  <div className="relative min-h-screen text-white bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center p-6 overflow-hidden">
          

//           <div className="absolute top-21.5 left-0 w-full h-[calc(100vh-64px)] 
//           bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#2a2a40] 
//           shadow-lg shadow-purple-900/40
//           flex flex-col items-center pt-16 pb-8 space-y-8 text-xl font-semibold z-40 
//           max-h-[540px] overflow-y-auto"
//           >
//                  <img
//                           src={wavesgif}
//                            alt="Background waves"
//                           className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
//                   /> 
// {[
//     { to: "/", label: "Home" },
//     { to: "/about", label: "About" },
//     { to: "/how-it-works", label: "How it works" },
//     { to: "/songs", label: "Songs" },
//     { to: "/history", label: "History" },
//     { to: "/account", label: "SignUp / SignIn" }
//   ].map((link, i) => (
//     <Link
//       key={i}
//       to={link.to}
//       onClick={() => setIsOpen(false)}           
//             className="inline-block px-6 py-2 rounded-full 
//              bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 
//              text-transparent bg-clip-text font-extrabold tracking-wide
//              hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 
//              hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40
//              transition-all duration-300 ease-out"
//     >
//       {link.label}
//     </Link>
//   ))}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
