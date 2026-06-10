import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Zap, Brain, Globe, Star, ArrowRight, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-0 pb-20">

      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-[30%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[130px]" />
          <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400">
            <Sparkles size={13} className="animate-pulse" />
            <span>AI-First Hotel Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Built to Redefine<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-600 dark:from-primary-400 dark:to-indigo-500">
              How You Stay
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            StayWise.ai combines the power of Google Gemini AI with a beautifully crafted booking experience to help you discover, compare, and secure the world's finest stays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/search-results"
              className="premium-btn text-white font-semibold px-7 py-3 rounded-xl inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              Explore Hotels <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              to="/contact"
              className="border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-7 py-3 rounded-xl inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Personalized Travel Intelligence, At Every Step
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We started StayWise.ai with a simple belief: finding the right hotel shouldn't feel like guesswork. Traditional booking platforms overwhelm you with choices. We flip that experience by letting AI do the heavy lifting — surfacing stays that actually match your style, budget, and purpose.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our SmartStay Recommender engine is powered by Google Gemini, trained to analyze your booking history, preferred amenities, and travel patterns to generate genuinely useful, hyper-personalized recommendations.
            </p>
            <ul className="space-y-3">
              {[
                'Zero guesswork — AI-curated hotel matches',
                'Real-time dynamic pricing calendars',
                'Razorpay-secured checkout in minutes',
                'PDF invoice delivered to your inbox',
              ].map((item) => (
                <li key={item} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle size={16} className="text-primary-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: Brain, color: 'primary', label: 'SmartStay Recommender', desc: 'Gemini-powered AI that learns your travel preferences and surfaces the best matches.' },
              { icon: Shield, color: 'emerald', label: 'Secure Payments', desc: 'All transactions protected by Razorpay with 256-bit SSL encryption and UPI support.' },
              { icon: Zap, color: 'amber', label: 'Dynamic Pricing', desc: 'Hotels adapt room rates for peak seasons so you always see fair, transparent pricing.' },
              { icon: Globe, color: 'indigo', label: 'Curated Properties', desc: 'Hand-verified hotel listings with verified ratings, real images, and detailed amenities.' },
            ].map(({ icon: Icon, color, label, desc }) => (
              <div
                key={label}
                className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3 hover:shadow-premium dark:hover:shadow-premium-dark transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl bg-${color}-100 dark:bg-${color}-950/50 text-${color}-500 flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-primary-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '500+', label: 'Curated Properties' },
              { number: '50K+', label: 'Happy Guests' },
              { number: '4.9★', label: 'Average Rating' },
              { number: '99.9%', label: 'Uptime SLA' },
            ].map(({ number, label }) => (
              <div key={label} className="space-y-2">
                <p className="text-4xl md:text-5xl font-extrabold">{number}</p>
                <p className="text-primary-100 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SmartStay Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">The Engine</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            How SmartStay Recommender Works
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400">
            Our AI recommendation engine is not a generic filter — it's a personalized intelligence layer built on top of Google Gemini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Profile Analysis',
              desc: 'When you sign in, SmartStay ingests your booking history, search patterns, preferred locations, and amenity interests.',
            },
            {
              step: '02',
              title: 'Gemini Inference',
              desc: 'The data is formatted into a structured prompt and sent to the Gemini 2.0 Flash model, which reasons over the hotel catalogue to identify best-fit matches.',
            },
            {
              step: '03',
              title: 'Personalized Results',
              desc: 'You see ranked recommendations with clear AI-generated reasons — why each hotel was chosen for you specifically.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="glass-card p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-4 relative overflow-hidden">
              <span className="absolute top-5 right-6 text-6xl font-black text-slate-100 dark:text-slate-800/60 select-none">{step}</span>
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-500 flex items-center justify-center font-bold text-sm">
                {step}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="glass-card p-10 md:p-16 rounded-3xl border border-primary-500/10 dark:border-primary-400/5 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20" />
          <Sparkles size={36} className="text-primary-500 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Experience StayWise.ai?
          </h2>
          <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400">
            Sign up free and let SmartStay find your perfect stay in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="premium-btn text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              Get Started Free <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              to="/search-results"
              className="border border-primary-500/30 text-primary-600 dark:text-primary-400 font-semibold px-8 py-3.5 rounded-xl inline-flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
            >
              Browse Hotels
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
