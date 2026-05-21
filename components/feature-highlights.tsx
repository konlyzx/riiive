import React from "react";

const features = [
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M480 896q-84 0-157.5-31.5T195 781q-54-54-85.5-127.5T78 496q0-84 31.5-157.5T195 211t127.5-85.5T480 94q84 0 157.5 31.5T765 211t85.5 127.5T882 496q0 59-15.5 113T822 712l-58-58q21-42 31.5-88T806 496q0-138-96-235t-230-97q-138 0-235 97t-97 235q0 138 97 235t235 97q46 0 90-12t84-33l58 58q-44 27-96 42.5T480 896Zm280 80-42-42 72-72H670v-60h120l-72-72 42-42 152 152-152 152ZM380 696l-96-96-72 72-56-56 128-128 96 96 176-176 56 56-328 232Z"/>
      </svg>
    ),
    title: "Instant Analysis",
    description: "Get results in seconds. No waiting, no fluff — just fast, honest feedback on your portfolio.",
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M160 896V456l320-280 320 280v440H560V696H400v200H160Zm60-60h120V636h280v200h120V489L480 241 220 489v347Zm260-310Z"/>
      </svg>
    ),
    title: "Multi-dimensional Scoring",
    description: "Performance, accessibility, design, content, and responsiveness — scored in one shot.",
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M480 976q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-155.5t86-127Q252 239 325 207.5T480 176q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880 576q0 82-31.5 155t-86 127.5q-54.5 52.5-127 84T480 976Zm0-60q142 0 241-99t99-241q0-142-99-241t-241-99q-142 0-241 99t-99 241q0 142 99 241t241 99Zm0-340Zm-30 220v-120q-50-11-85-44.5T317 556l58-24q17 45 53.5 71.5T510 630q42 0 70-22t28-58q0-35-21-55.5T513 454q-67-22-102.5-57T375 306q0-55 35.5-92.5T496 176v-60h30v60q44 6 77 31t49 65l-56 23q-13-32-37.5-51T496 225q-40 0-66 20.5T404 301q0 31 22.5 51t75.5 41q68 22 105 58.5t37 99.5q0 58-38.5 96.5T510 695v61h-60Z"/>
      </svg>
    ),
    title: "AI Roasts",
    description: "Funny but constructive criticism that actually makes you want to improve.",
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M480 576q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM160 896v-94q0-38 19-65t49-41q67-30 128.5-45T480 636q62 0 123 15.5T731 696q31 14 50 41t19 65v94H160Zm60-60h520v-34q0-16-9.5-31T707 750q-64-31-117-42.5T480 696q-57 0-111 11.5T252 750q-14 7-23 22t-9 30v34Zm260-420Zm0 360Z"/>
      </svg>
    ),
    title: "Recruiter Perspective",
    description: "See your portfolio through the eyes of hiring managers. Know what they see first.",
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M480 976q-33 0-56.5-23.5T400 896h160q0 33-23.5 56.5T480 976Zm-160-140v-60h320v60H320Zm10-120q-69-41-109.5-110T180 446q0-125 87.5-212.5T480 146q125 0 212.5 87.5T780 446q0 80-40.5 149T630 716H330Zm24-60h252q45-31 69.5-80t24.5-110q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 61 24.5 110T354 656Zm126 0Z"/>
      </svg>
    ),
    title: "Actionable Feedback",
    description: "No vague advice. Specific improvements you can make today to stand out.",
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M360 976v-60h481V236H360v-60h481q24 0 42 18t18 42v680q0 24-18 42t-42 18H360Zm-84-160-43-43 147-147H80v-60h300L233 419l43-43 220 220-220 220Z"/>
      </svg>
    ),
    title: "Template Recommendations",
    description: "Get suggestions tailored to your needs, style, and target industry.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="w-full bg-black py-24 px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span
            className="text-xs font-medium tracking-widest uppercase text-[#838383] mb-4 block"
            style={{ fontFamily: "Roboto, -apple-system, sans-serif" }}
          >
            Why Riiive
          </span>
          <h2
            className="text-4xl md:text-5xl font-[650] leading-[1.2] tracking-tight mb-4"
            style={{
              background: "linear-gradient(97deg, rgb(255,255,255) 43%, rgb(150,150,150) 110%) text",
              WebkitTextFillColor: "transparent",
              fontFamily: '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif',
            }}
          >
            Brutally honest feedback<br className="hidden md:block" /> that actually helps.
          </h2>
          <p
            className="text-lg font-light text-[#838383] leading-relaxed"
            style={{ fontFamily: "Roboto, -apple-system, sans-serif" }}
          >
            AI-powered analysis built for designers, developers and creatives who want to land their next opportunity.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#0a0a0a] p-10 flex flex-col gap-6 hover:bg-white/[0.03] transition-colors duration-300 cursor-default group"
            >
              <div className="text-[#505050] group-hover:text-white transition-colors duration-300">
                {feature.svg}
              </div>
              <div>
                <h3
                  className="text-base font-semibold text-white mb-2 tracking-tight"
                  style={{ fontFamily: "Roboto, -apple-system, sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm font-light text-[#838383] leading-relaxed"
                  style={{ fontFamily: "Roboto, -apple-system, sans-serif" }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
