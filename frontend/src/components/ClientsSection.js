import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaChartLine, FaUsers, FaEye } from "react-icons/fa";

const ClientsSection = ({ clients }) => {
  return (
    <section id="clients" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Success Stories
          </h2>
          <p className="text-xl text-gray-300">
            Real results from real businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <FaInstagram className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{client.display_name}</h3>
                  <p className="text-blue-400">{client.period}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">{client.description}</p>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {client.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-400">{metric.metric_name}</div>
                    {metric.description && (
                      <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Testimonial */}
              {client.testimonial && (
                <div className="bg-gray-700 p-6 rounded-lg border-l-4 border-blue-400">
                  <p className="text-gray-300 italic mb-2">"{client.testimonial}"</p>
                  <p className="text-blue-400 font-semibold">- {client.testimonial_author}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Additional showcased work section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Past Projects Showcase
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BTrave Holiday */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-2">BTrave Holiday</h4>
              <p className="text-gray-300 mb-4">
                <strong className="text-blue-400">KPI:</strong> Promote travel packages through engaging video content.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  Created compelling video content that increased engagement and booking inquiries for travel packages.
                </p>
              </div>
            </div>
            
            {/* Inbranded */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-2">Inbranded</h4>
              <p className="text-gray-300 mb-4">
                <strong className="text-blue-400">KPI:</strong> Create captions and promotional videos to boost brand visibility.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  Developed strategic caption writing and video content that enhanced brand recognition and audience engagement.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;