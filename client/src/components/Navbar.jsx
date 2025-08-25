import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, ChevronDown } from "lucide-react";
import Moodify_logo from "../assets/Moodify_logo3i.png";
import wavesgif from "../assets/waves55.gif";
import { useAuth } from "../AuthContext"; 
import { Menu, X } from "lucide-react";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRefDesktop = useRef(null);
  const profileRefMobile = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { session, signout } = useAuth();
  const user = session?.user;

  const getGradient = (letter) => {
  if (!letter) return "from-gray-400 to-gray-600";
  const l = letter.toUpperCase();
  if ("ABCDE".includes(l)) return "from-purple-500 to-indigo-500";
  if ("FGHIJ".includes(l)) return "from-pink-500 to-rose-500";
  if ("KLMNO".includes(l)) return "from-green-500 to-emerald-500";
  if ("PQRST".includes(l)) return "from-blue-500 to-cyan-500";
  if ("UVWXYZ".includes(l)) return "from-amber-500 to-orange-500";
  return "from-gray-400 to-gray-600";
  };

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const firstLetter = user?.name?.[0] || "U";

  
  useEffect(() => {
  const onDocClick = (e) => {
    if (
      profileRefDesktop.current &&
      !profileRefDesktop.current.contains(e.target) &&
      profileRefMobile.current &&
      !profileRefMobile.current.contains(e.target)
    ) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", onDocClick);
  return () => document.removeEventListener("mousedown", onDocClick);
}, []);

  const handleLogout = () => {
    signout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate("/account-selection");
  };

 
  const initial = (user?.name || user?.email || "U").trim().charAt(0).toUpperCase();


  return (
    
    <nav 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                 w-[95%] max-w-4xl 
                 rounded-full 
                 bg-slate-900/20 backdrop-blur-lg border border-slate-100/10 
                 px-6 py-3 flex items-center justify-between text-white"
    >
      {/* Logo */}
      <div className="text-xl font-bold -ml-2">
        <Link to="/" className="flex items-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          <img 
            src={Moodify_logo}  
            alt="Moodify Logo"
            className="h-8 w-14 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
          /> 
          Moodify
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6 text-sm">
        <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
        <Link to="/about" className="hover:text-purple-400 transition-colors">About</Link>
        <Link to="/how-it-works" className="hover:text-purple-400 transition-colors">How it works</Link>
        <Link to="/songs" className="hover:text-purple-400 transition-colors">Songs</Link>
        <Link to="/history" className="hover:text-purple-400 transition-colors">History</Link>
        
        {!user && (
          <Link
            to="/account-selection"
            className="hover:text-purple-400 transition-colors"
          >
            SignUp / SignIn
          </Link>
        )}

        {/* If logged in: show Profile button + dropdown */}
        {user && (
          <div className="relative ml-2" ref={profileRefDesktop}>
            <button
              type="button"
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center group"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full 
                                bg-gradient-to-r ${getGradient(initial)} 
                               text-white text-sm font-semibold shadow-md 
                                group-hover:scale-105 transition-transform`}>
                {initial}
              </span>
              {/* <ChevronDown className={`h-4 w-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} /> */}
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 
                           border border-white/10 shadow-xl px-4 pt-4 pb-2 z-50"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <UserCircle className="h-6 w-6 opacity-80" />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-300 truncate">{user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-2 inline-flex items-center gap-1 
                            text-red-500 hover:underline font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Hamburger Icon - mobile*/}
<div className="md:hidden flex items-center">
  {user && (
    <div className="relative" ref={profileRefMobile}>
    <button
              type="button"
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center group "
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full 
                                bg-gradient-to-r ${getGradient(initial)} 
                               text-white text-sm font-semibold shadow-md 
                                group-hover:scale-105 transition-transform`}>
                {initial}
              </span>
              {/* <ChevronDown className={`h-4 w-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} /> */}
            </button>
        
      {profileOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 
                     border border-white/10 shadow-xl px-4 pt-4 pb-2 z-50"
        >
          {/* User info */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <UserCircle className="h-6 w-6 opacity-80" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{user?.name || "User"}</div>
              <div className="text-xs text-gray-300 truncate">{user?.email}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-2 inline-flex items-center gap-1 
             text-red-500 hover:underline font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )}

  {/* Hamburger toggle */}
  <button
  onClick={() => setIsOpen(!isOpen)}
  className="focus:outline-none bg-transparent p-2 flex items-center justify-center h-11 w-11"
  aria-label="Toggle menu"
  aria-expanded={isOpen}
>
  {isOpen ? (
    <X className="w-9 h-9 text-white" />
  ) : (
    <Menu className="w-9 h-9 text-white" />
  )}
</button>

  {/* {/* <button 
    onClick={() => setIsOpen(!isOpen)} 
    className="focus:outline-none bg-transparent p-1 flex items-center justify-center h-10 w-10"
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    <div className="w-7 h-6 flex flex-col justify-between">
      <span className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
      <span className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
      <span className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
    </div>
  </button> */}
</div> 


      {/* Dropdown Menu - Appears below the new navbar */}
      {isOpen && (
        <div 
          ref={menuRef} 
          className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full
               rounded-2xl animate-[neonDrop_0.6s_ease-out]
               bg-slate-900/100 backdrop-blur-lg border border-slate-100/10
               flex flex-col items-center p-6 pt-6 pb-8 space-y-4 z-40
               max-h-[80vh] overflow-y-auto no-scrollbar overscroll-contain"
        >
          <img
            src={wavesgif}
            alt="Background waves"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none -z-10 rounded-2xl"
          />  
          
          {/* If logged in on mobile: show profile card + logout */}
          {/* {user ? (
            <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-left">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/60 text-white text-base font-semibold">
                  {initial}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{user?.name || "User"}</div>
                  <div className="text-xs text-gray-300 truncate">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 bg-purple-600/80 hover:bg-purple-600 transition font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null} */}

          {[
           { to: "/", label: "Home", cls: "stagger-1" },
           { to: "/about", label: "About", cls: "stagger-2" },
           { to: "/how-it-works", label: "How it works", cls: "stagger-3" },
           { to: "/songs", label: "Songs", cls: "stagger-4" },
           { to: "/history", label: "History", cls: "stagger-5" },
            // Only show SignUp/SignIn on mobile if NOT logged in
            ...(!user ? [{ to: "/account-selection", label: "SignUp / SignIn", cls: "stagger-signin" }] : []),
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`text-white hover:text-purple-400 transition-colors w-full text-center py-2 ${link.cls}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;


