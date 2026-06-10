import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSending(true);
    // Simulate network delay — replace with real API call when backend ready
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="pb-20">

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-[5%] w-[350px] h-[350px] rounded-full bg-primary-500/8 blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <MessageSquare size={13} />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-600 dark:from-primary-400 dark:to-indigo-500">
              Touch
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Have a question about a booking, a property listing, or want to partner with us? Our team typically responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left — Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            {[
              {
                icon: Mail,
                color: 'primary',
                label: 'Email Us',
                value: 'support@staywise.ai',
                sub: 'For booking help & general queries',
              },
              {
                icon: Phone,
                color: 'emerald',
                label: 'Call Us',
                value: '+91 98765 43210',
                sub: 'Mon–Fri, 9 AM – 7 PM IST',
              },
              {
                icon: MapPin,
                color: 'indigo',
                label: 'Our Office',
                value: 'Bengaluru, Karnataka',
                sub: 'India — Remote-first team',
              },
              {
                icon: Clock,
                color: 'amber',
                label: 'Response Time',
                value: '< 24 Hours',
                sub: 'We aim to reply same day',
              },
            ].map(({ icon: Icon, color, label, value, sub }) => (
              <div
                key={label}
                className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-start space-x-4 hover:shadow-premium dark:hover:shadow-premium-dark transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-${color}-100 dark:bg-${color}-950/50 text-${color}-500 flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-8">
            <div className="glass-card p-8 md:p-10 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium dark:shadow-premium-dark">
              {submitted ? (
                <div className="text-center py-12 space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Message Received!</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="premium-btn text-white font-semibold px-6 py-2.5 rounded-xl inline-flex items-center hover:scale-105 transition-transform"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send Us a Message</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Fill in the form below and we'll get back to you shortly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Booking issue / Partnership / General inquiry..."
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-800 dark:text-white placeholder-slate-400 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="premium-btn w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center disabled:opacity-60 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {sending ? (
                        <>
                          <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
