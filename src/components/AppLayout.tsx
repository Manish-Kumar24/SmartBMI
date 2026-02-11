import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, Menu, X, ArrowDown, Activity, Shield, Zap, ChevronUp, Mail, MapPin, Phone, Github, Twitter, Linkedin } from 'lucide-react';
import BMICalculator from './BMICalculator';
import BMIInfoSection from './BMIInfoSection';
import BMIChart from './BMIChart';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errors.email = 'Invalid email address';
    if (!contactForm.message.trim()) errors.message = 'Message is required';

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const navLinks = [
    { label: 'Calculator', id: 'calculator' },
    { label: 'BMI Chart', id: 'chart' },
    { label: 'About BMI', id: 'about' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans">
      {/* ===== NAVIGATION ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/30 border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <button onClick={scrollToTop} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200/50 group-hover:shadow-teal-300/60 transition-shadow duration-300">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-800 tracking-tight">BMI</span>
                <span className="text-lg font-black text-teal-500 tracking-tight">Check</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollToSection('calculator')}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-teal-200/50 hover:shadow-teal-300/60 transition-all duration-300 active:scale-[0.97]"
              >
                Check Your BMI
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="bg-white border-t border-slate-100 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('calculator')}
              className="w-full mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg"
            >
              Check Your BMI
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-50 rounded-full opacity-20 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Heart className="w-4 h-4" />
              Free Health Assessment Tool
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Know Your{' '}
              <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                Body Mass Index
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-900">
              Calculate your BMI instantly with our precision calculator. Get personalized health insights, understand your weight category, and receive expert recommendations — all in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <button
                onClick={() => scrollToSection('calculator')}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-teal-200/50 hover:shadow-2xl hover:shadow-teal-300/50 transition-all duration-300 flex items-center justify-center gap-2 text-lg active:scale-[0.97]"
              >
                Calculate Your BMI
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-lg active:scale-[0.97]"
              >
                Learn About BMI
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
              {[
                { value: '100%', label: 'Free to Use' },
                { value: 'Instant', label: 'Results' },
                { value: 'WHO', label: 'Standards' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-black text-slate-800">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="py-8 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Instant Calculation',
                description: 'Get your BMI result in seconds with our optimized calculator',
                gradient: 'from-amber-400 to-orange-500',
                shadow: 'shadow-amber-200',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Privacy First',
                description: 'Your data stays on your device. No information is stored or shared',
                gradient: 'from-blue-400 to-indigo-500',
                shadow: 'shadow-blue-200',
              },
              {
                icon: <Heart className="w-5 h-5" />,
                title: 'Health Insights',
                description: 'Receive personalized recommendations based on your BMI category',
                gradient: 'from-rose-400 to-pink-500',
                shadow: 'shadow-rose-200',
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-lg flex items-center justify-center text-white flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{feature.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BMI CALCULATOR SECTION ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              Health Calculator
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              BMI Calculator
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Enter your weight in kilograms and your height in feet and inches to calculate your Body Mass Index and get a comprehensive health assessment.
            </p>
          </div>

          <BMICalculator />
        </div>
      </section>

      {/* ===== BMI CHART SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BMIChart />
        </div>
      </section>

      {/* ===== ABOUT BMI / INFO SECTION ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BMIInfoSection />
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-sm font-medium mb-4">
              <Mail className="w-4 h-4" />
              Get in Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              Contact Us
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Have questions about BMI or health assessments? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Reach Out to Us</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'support@bmicheck.com', color: 'text-teal-500 bg-teal-50' },
                    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+1 (555) 123-4567', color: 'text-blue-500 bg-blue-50' },
                    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'San Francisco, CA', color: 'text-rose-500 bg-rose-50' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Health Disclaimer</h3>
                <p className="text-teal-100 text-sm leading-relaxed">
                  This BMI calculator is provided for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              {contactSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => {
                        setContactForm(prev => ({ ...prev, name: e.target.value }));
                        if (contactErrors.name) setContactErrors(prev => ({ ...prev, name: '' }));
                      }}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                        contactErrors.name ? 'border-red-300' : 'border-slate-200 hover:border-slate-300 focus:border-teal-400'
                      }`}
                    />
                    {contactErrors.name && <p className="text-red-500 text-xs mt-1">{contactErrors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => {
                        setContactForm(prev => ({ ...prev, email: e.target.value }));
                        if (contactErrors.email) setContactErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                        contactErrors.email ? 'border-red-300' : 'border-slate-200 hover:border-slate-300 focus:border-teal-400'
                      }`}
                    />
                    {contactErrors.email && <p className="text-red-500 text-xs mt-1">{contactErrors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => {
                        setContactForm(prev => ({ ...prev, message: e.target.value }));
                        if (contactErrors.message) setContactErrors(prev => ({ ...prev, message: '' }));
                      }}
                      placeholder="How can we help you?"
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-none ${
                        contactErrors.message ? 'border-red-300' : 'border-slate-200 hover:border-slate-300 focus:border-teal-400'
                      }`}
                    />
                    {contactErrors.message && <p className="text-red-500 text-xs mt-1">{contactErrors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight">BMI</span>
                  <span className="text-lg font-black text-teal-400 tracking-tight">Check</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                A free, privacy-first BMI calculator providing instant health assessments based on WHO standards. Your health journey starts here.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                  { icon: <Github className="w-4 h-4" />, label: 'GitHub' },
                  { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                ].map((social, i) => (
                  <button
                    key={i}
                    onClick={() => alert(`Opening ${social.label} page`)}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-slate-400 hover:text-teal-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  'WHO BMI Guidelines',
                  'Healthy Eating Guide',
                  'Exercise Recommendations',
                  'Mental Health Resources',
                  'Sleep Hygiene Tips',
                ].map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => alert(`Opening: ${item}`)}
                      className="text-slate-400 hover:text-teal-400 text-sm transition-colors duration-200"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-3">Get health tips and updates delivered to your inbox.</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs text-center sm:text-left">
              &copy; {new Date().getFullYear()} BMICheck. All rights reserved. This tool is for educational purposes only.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map((item, i) => (
                <button
                  key={i}
                  onClick={() => alert(`Opening: ${item}`)}
                  className="text-slate-500 hover:text-teal-400 text-xs transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ===== SCROLL TO TOP ===== */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl shadow-teal-300/30 flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

// Newsletter form sub-component
const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  if (submitted) {
    return (
      <div className="bg-teal-900/50 rounded-xl p-3 text-center">
        <p className="text-teal-400 text-sm font-medium">Subscribed successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold transition-colors duration-200 flex-shrink-0"
        >
          Join
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </form>
  );
};

export default AppLayout;
