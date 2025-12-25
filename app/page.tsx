"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 z-40 pt-12 ">
            {/* Profile Image */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800/20 rounded-full blur-2xl"></div>
                <img
                  src="/myphoto.PNG"
                  alt="Mohamed Yassine Hemissi"
                  className="relative w-48 h-48 rounded-full object-cover border-4 border-white dark:border-slate-950"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Mohamed Yassine Hemissi
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                CS Graduate & AI Engineering Student
              </p>

              {/* Social Links */}
              <div className="flex gap-3 justify-center flex-wrap">
                <a
                  href="https://github.com/yassinehemissi"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium"
                  target="_blank"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href="mailto:hemissiyassine@gmail.com "
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/mohamed-yassine-hemissi/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium"
                  target="_blank"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
            {/* Education */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Experience
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    SWE - Freelance
                    <span className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      {" "}
                      (15+ Clients)
                    </span>
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Mar 2022 - Now
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    Intern - Artify
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Feb 2024 - Aug 2025
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    Intern - Sagemcom
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Jul 2023 - Aug 2023
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    Co-Founder - Bubble Fest
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    2022 (Freelance)
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    Co-Founder - Declamatory
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    2022 - 2023
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Education
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    Eng/Masters - Artificial Intelligence
                  </h4>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    ESPRIT
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    2024 - Now
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    Bachelor - Computer Science
                  </h4>

                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Faculty of Science - Tunis
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    2021-2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 max-w-2xl  md:py-12">
          {/* Welcome Section */}
          <section className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-balance">
              Adventus tuus nobis gratus est.
              <p className=" italic font-light text-slate-600 dark:text-slate-400 mb-6 text-base">
                Your arrival is welcome to us.
              </p>
            </h1>

            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                I&apos;m a computer science graduate and{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  AI Engineering student
                </span>
                , working at the intersection of software engineering machine
                learning, data science, and real-world systems.
              </p>

              <p>
                My work focuses on building data-driven and AI-powered
                platforms, ranging from predictive models in health and
                environmental domains to scalable web systems and APIs. I care
                deeply about transforming raw data into clear insight, decision
                support, and usable tools.
              </p>

              <p>
                I&apos;ve worked extensively with Python, JavaScript/TypeScript,
                SQL, and modern ML frameworks, and I enjoy designing systems
                that balance theoretical soundness with practical
                constraints—whether that&apos;s statistical rigor, performance,
                or deployment reality.
              </p>

              {/* Quote/Highlight Section */}
              <div className="border-l-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/20 p-6 my-8 italic text-slate-700 dark:text-slate-300">
                I actively follow and study AI research, with a strong interest
                in deepening my understanding of modern architectures,
                optimization methods, and applied AI systems, and I aim to
                pursue more advanced research and hands-on experimentation in
                this direction.
              </div>

              <p>
                Alongside engineering and research, I&apos;m an entrepreneurship
                enthusiast, constantly exploring marketing strategies, product
                positioning, and business ideas. I enjoy thinking about how
                technology becomes valuable products, not just correct systems.
              </p>

              <p>
                Beyond work, I enjoy exploring across disciplines — from
                training at the gym and playing tennis to music, where I
                previously hosted and organized music events.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
