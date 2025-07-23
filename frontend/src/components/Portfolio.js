import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FaChartLine, 
  FaUsers, 
  FaRocket, 
  FaEnvelope, 
  FaInstagram, 
  FaLinkedin, 
  FaTwitter 
} from "react-icons/fa";
import HeroSection from "./HeroSection";
import ClientsSection from "./ClientsSection";
import ContactSection from "./ContactSection";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [clientsResponse, statsResponse] = await Promise.all([
        axios.get(`${API}/portfolio/clients`),
        axios.get(`${API}/portfolio/stats`)
      ]);
      
      setClients(clientsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroller Animation
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      const scrollerContent = scroller.innerHTML;
      scroller.innerHTML += scrollerContent; // Duplicate for seamless scrolling

      const handleMouseEnter = () => (scroller.style.animationPlayState = "paused");
      const handleMouseLeave = () => (scroller.style.animationPlayState = "running");

      scroller.addEventListener("mouseenter", handleMouseEnter);
      scroller.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        scroller.removeEventListener("mouseenter", handleMouseEnter);
        scroller.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // Video Hover Interaction
  const handleVideoHover = (video) => {
    video.addEventListener("mouseenter", () => video.pause());
    video.addEventListener("mouseleave", () => video.play());
  };

  useEffect(() => {
    const videos = document.querySelectorAll(".project-video");
    videos.forEach((video) => handleVideoHover(video));

    const playVideos = () => {
      videos.forEach((video) => {
        video
          .play()
          .catch((error) => {
            console.log("Autoplay failed:", error);
            const fallback = video.nextElementSibling;
            if (fallback && fallback.tagName === "IMG") {
              video.style.display = "none";
              fallback.style.display = "block";
            }
          });
      });
    };

    document.addEventListener("click", playVideos);
    document.addEventListener("touchstart", playVideos);
    playVideos();

    return () => {
      document.removeEventListener("click", playVideos);
      document.removeEventListener("touchstart", playVideos);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <HeroSection stats={stats} />
      
      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-300">
              Proven strategies that deliver real results
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gray-700 p-8 rounded-lg text-center"
            >
              <FaChartLine className="text-5xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Data-Driven Strategies</h3>
              <p className="text-gray-300">
                We use analytics to optimize your social media campaigns and maximize ROI.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-700 p-8 rounded-lg text-center"
            >
              <FaUsers className="text-5xl text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Audience Engagement</h3>
              <p className="text-gray-300">
                Boost interaction and build a loyal community around your brand.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gray-700 p-8 rounded-lg text-center"
            >
              <FaRocket className="text-5xl text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Rapid Growth</h3>
              <p className="text-gray-300">
                See measurable results in as little as 2 months with our proven methods.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-16 bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">What Our Clients Say</h2>
          <div className="flex flex-col md:flex-row justify-around px-4">
            <div className="testimonial mb-6 md:mb-0">
              <p className="italic text-gray-300">"Tomiwa helped us increase our reach from 77 to 4.4k in just 2 months!"</p>
              <p className="mt-2 font-semibold text-white">- CoreMars Team</p>
            </div>
            <div className="testimonial">
              <p className="italic text-gray-300">"Our social media presence went from 0 to 10k reach. Highly recommended!"</p>
              <p className="mt-2 font-semibold text-white">- Bosah Oak Roe</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Image Scroller Section */}
      <section className="image-scroller py-16 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Our Work</h2>
          <div className="scroller-container overflow-hidden">
            <div ref={scrollerRef} className="scroller whitespace-nowrap animate-scroll" style={{ animationDuration: "20s" }}>
              <div className="scroller-item inline-block mx-4">
                <img src="/coremars page.jpg" alt="CoreMars page" className="w-64 h-64 object-cover rounded-lg" />
                <p className="text-center mt-2 text-white">CoreMars - Social Media Growth</p>
              </div>
              <div className="scroller-item inline-block mx-4">
                <img src="/coremars analysis.jpg" alt="CoreMars Screenshot 2" className="w-64 h-64 object-cover rounded-lg" />
                <p className="text-center mt-2 text-white">CoreMars - Engagement Boost</p>
              </div>
              <div className="scroller-item inline-block mx-4">
                <img src="/bosah page.jpg" alt="Bosah Oak Roe Screenshot 1" className="w-64 h-64 object-cover rounded-lg" />
                <p className="text-center mt-2 text-white">Bosah Oak Roe - Follower Growth</p>
              </div>
              <div className="scroller-item inline-block mx-4">
                <img src="/bosah analysis .jpg" alt="Bosah Oak Roe Screenshot 2" className="w-64 h-64 object-cover rounded-lg" />
                <p className="text-center mt-2 text-white">Bosah Oak Roe - Campaign Success</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Past Projects Section */}
      <section className="past-projects py-16 bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Past Projects</h2>
          <div className="projects-container flex flex-col md:flex-row justify-around px-4">
            <div className="project-item mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold text-white mb-2">BTrave Holiday</h3>
              <p className="mb-4 text-gray-300"><strong>KPI:</strong> Promote travel packages through engaging video content.</p>
              <div className="video-wrapper flex space-x-4 justify-center">
                <video className="project-video w-64 h-36 object-cover rounded-lg" playsInline muted loop>
                  <source src="/fifa1.mp4" type="video/mp4" />
                  <source src="/fifa1.webm" type="video/webm" />
                  <img src="/fifa1-fallback.jpg" alt="Fifa1 Fallback" className="w-64 h-36 object-cover rounded-lg hidden" />
                </video>
                <video className="project-video w-64 h-36 object-cover rounded-lg" playsInline muted loop>
                  <source src="/fifa2.mp4" type="video/mp4" />
                  <source src="/fifa2.webm" type="video/webm" />
                  <img src="/fifa2-fallback.jpg" alt="Fifa2 Fallback" className="w-64 h-36 object-cover rounded-lg hidden" />
                </video>
              </div>
            </div>
            <div className="project-item">
              <h3 className="text-2xl font-semibold text-white mb-2">Inbranded</h3>
              <p className="mb-4 text-gray-300"><strong>KPI:</strong> Create captions and promotional videos to boost brand visibility.</p>
              <div className="video-wrapper flex space-x-4 justify-center">
                <video className="project-video w-64 h-36 object-cover rounded-lg" playsInline muted loop>
                  <source src="/inb1.mp4" type="video/mp4" />
                  <source src="/inb1.webm" type="video/webm" />
                  <img src="/inb1-fallback.jpg" alt="Inb1 Fallback" className="w-64 h-36 object-cover rounded-lg hidden" />
                </video>
                <video className="project-video w-64 h-36 object-cover rounded-lg" playsInline muted loop>
                  <source src="/inb2.mp4" type="video/mp4" />
                  <source src="/inb2.webm" type="video/webm" />
                  <img src="/inb2-fallback.jpg" alt="Inb2 Fallback" className="w-64 h-36 object-cover rounded-lg hidden" />
                </video>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <ClientsSection clients={clients} />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Tomiwa Babatunde</h3>
              <p className="text-gray-400">Social Media Marketing Expert</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Tomiwa Babatunde. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;