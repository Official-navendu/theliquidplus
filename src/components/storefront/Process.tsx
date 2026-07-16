'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const steps = [
  {
    num: '01',
    name: 'Safe Prep Wash',
    desc: 'Remove heavy mud and loose surface grit with high-foaming pH-neutral shampoo and safe wash mitts.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800',
  },
  {
    num: '02',
    name: 'Paint Polish & Correction',
    desc: 'Machine polish to paint defects, swirl scratches, oxidation, and optimize surface reflection clarity.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800',
  },
  {
    num: '03',
    name: 'Ceramic Nano Protect',
    desc: 'Apply premium liquid glass ceramic seal to bind paint layers molecularly against harsh contaminants.',
    image: '/spray-bottles.png',
  },
  {
    num: '04',
    name: 'Maintain & Boost Gloss',
    desc: 'Conduct routine safe washing and application of high-slickness detailer spray formulas.',
    image: '/microfiber-1.png',
  },
];

export function Process() {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <section className="py-14 bg-[#FF4D00] text-black border-b border-black/5 relative overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Text and 4 Process Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <span className="text-[8px] tracking-[0.25em] text-black/70 uppercase font-black block">
                METHODICAL PRECISION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-black leading-tight">
                OUR DETAILED <span className="text-white">PROCESS</span>
              </h2>
              <div className="w-10 h-[1.5px] bg-black mt-1" />
              <p className="text-[11px] text-black font-semibold leading-relaxed max-w-md pt-1">
                We follow a strict, lab-tested detailing workflow to bring paintwork back to a flawless mirror finish.
              </p>
            </div>

            {/* Vertical Cards list */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div
                    key={step.num}
                    onMouseEnter={() => setActiveStep(index)}
                    className={`group p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 cursor-pointer bg-white border-black ${
                      isActive
                        ? 'shadow-lg translate-x-1.5 -translate-y-0.5'
                        : 'hover:border-black hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Orange Circle with number */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-num text-xs font-black transition-all ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-[#FF4D00] text-white group-hover:bg-black group-hover:text-white'
                    }`}>
                      {step.num}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold tracking-wider uppercase text-black">
                        {step.name}
                      </h3>
                      <p className="text-xs text-[#333333] font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Large Dynamic Premium Image with Slide/Fade animation (400ms) */}
          <div className="lg:col-span-6 h-[400px] sm:h-[500px] w-full relative rounded-3xl overflow-hidden border border-black bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={steps[activeStep].image}
                  alt={steps[activeStep].name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
export default Process;
