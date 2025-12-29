# 🚀 ** Kompletan Full Stack Enterprise Setup **

## 1. ** Glavna App s Routing **

    ```tsx
// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './routes/LandingPage';
import { MvpStudio } from './components/MvpStudio';
import { InvestorsRoute } from './routes/InvestorsRoute';
import { DocsRoute } from './routes/DocsRoute';
import { KernelPlayground } from './routes/KernelPlayground';
import { Navigation } from './components/ui/Navigation';
import { Footer } from './components/ui/Footer';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Lazy load heavy components
const LazyMvpStudio = React.lazy(() => import('./components/MvpStudio'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navigation />
        
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/studio" 
                element={<LazyMvpStudio />} 
              />
              <Route 
                path="/investors" 
                element={<InvestorsRoute />} 
              />
              <Route 
                path="/docs" 
                element={<DocsRoute />} 
              />
              <Route 
                path="/kernel" 
                element={<KernelPlayground />} 
              />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

## 2. ** Navigation Component **

    ```tsx
// src/components/ui/Navigation.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', external: false },
    { path: '/studio', label: 'Studio', external: false },
    { path: '/docs', label: 'Docs', external: false },
    { path: '/investors', label: 'Investors', external: false },
    { path: '/kernel', label: 'Kernel', external: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FD</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FormatDisc
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px - 3 py - 2 text - sm font - medium transition - colors ${
    location.pathname === item.path
        ? 'text-blue-400 border-b-2 border-blue-400'
        : 'text-slate-300 hover:text-white'
} `}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/investors"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px - 3 py - 2 text - base font - medium rounded - md ${
    location.pathname === item.path
        ? 'text-blue-400 bg-slate-800'
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
} `}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/investors"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md mt-4"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
```

## 3. ** Landing Page - Glavna komponenta **

    ```tsx
// src/routes/LandingPage.tsx
import React, { useEffect } from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { JourneyTimeline } from '../components/landing/JourneyTimeline';
import { ArchitectureVisualization } from '../components/landing/ArchitectureVisualization';
import { ComplianceDemoSection } from '../components/landing/ComplianceDemoSection';
import { ProblemSolutionComparison } from '../components/landing/ProblemSolutionComparison';
import { FounderStorySection } from '../components/landing/FounderStorySection';
import { CtaGrid } from '../components/landing/CtaGrid';
import { MetricsSection } from '../components/landing/MetricsSection';

export function LandingPage() {
  useEffect(() => {
    // SEO Meta Tags
   FormatDisc — Determin document.title = 'istic AI Governance for the EU AI Act Era';
    
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'SlavkoKernel: Infrastructure layer for auditable AI. Transform any AI system into a regulator-ready, compliant solution aligned with EU AI Act requirements.';
    document.head.appendChild(metaDescription);

    const keywords = document.createElement('meta');
    keywords.name = 'keywords';
    keywords.content = 'AI governance, EU AI Act, deterministic AI, audit trail, compliance, machine learning, enterprise AI';
    document.head.appendChild(keywords);

    return () => {
      document.head.removeChild(metaDescription);
      document.head.removeChild(keywords);
    };
  }, []);

  return (
    <div className="pt-16">
      <HeroSection />
      <JourneyTimeline />
      <ArchitectureVisualization />
      <ComplianceDemoSection />
      <ProblemSolutionComparison />
      <FounderStorySection />
      <MetricsSection />
      <CtaGrid />
    </div>
  );
}
```

## 4. ** Hero Section **

    ```tsx
// src/components/landing/HeroSection.tsx
import React from 'react';
import { ArrowRight, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${ Math.random() * 100 }% `,
              top: `${ Math.random() * 100 }% `,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Founder Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-6 py-3 mb-8"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">MG</span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-white font-medium">8 months</span> • 
            <span className="text-white font-medium ml-1">3,000+ hours</span> • 
            <span className="text-white font-medium ml-1">300+ projects</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Deterministic AI Governance
          </span>
          <br />
          <span className="text-white">for the EU AI Act Era</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          SlavkoKernel transforms any AI system into a{' '}
          <span className="text-blue-400 font-semibold">regulator-ready</span>,{' '}
          <span className="text-purple-400 font-semibold">reproducible</span>, and{' '}
          <span className="text-pink-400 font-semibold">compliant</span> solution
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <a
            href="/studio"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>Explore the Studio</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/docs"
            className="group bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Technical Whitepaper</span>
          </a>

          <a
            href="/investors"
            className="group text-slate-400 hover:text-white px-6 py-4 text-lg font-semibold transition-all flex items-center space-x-2"
          >
            <span>Investor Data Room</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Key Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-white font-semibold mb-2">EU AI Act Compliant</h3>
            <p className="text-slate-400 text-sm">Full traceability and auditability</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="text-white font-semibold mb-2">100% Reproducible</h3>
            <p className="text-slate-400 text-sm">Deterministic execution guarantees</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Zero Disruption</h3>
            <p className="text-slate-400 text-sm">Works with existing AI workflows</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

## 5. ** Compliance Demo Section **

    ```tsx
// src/components/landing/ComplianceDemoSection.tsx
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';

// Lazy load the MvpStudio component
const MvpStudio = React.lazy(() => import('../MvpStudio'));
const DemoSkeleton = () => (
  <div className="h-96 bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading Compliance Demo...</div>
  </div>
);

export function ComplianceDemoSection() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Deterministic AI Governance
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See how SlavkoKernel transforms any AI workflow into a regulator-ready process
            with complete execution lineage and reproducibility guarantees.
          </p>
        </motion.div>

        {/* Demo Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Demo App */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl"
            >
              <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-slate-300 text-sm">SlavkoKernel Compliance Studio</span>
                </div>
              </div>
              <Suspense fallback={<DemoSkeleton />}>
                <MvpStudio 
                  complianceMode={true}
                  showLineageTrace={true}
                  showDeterminismProof={true}
                  compactMode={true}
                />
              </Suspense>
            </motion.div>
          </div>

          {/* Compliance Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Compliance Artifacts</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Immutable Audit Trail</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Deterministic Execution Proof</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">EU AI Act Alignment Report</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Reproducibility Certificate</span>
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-400 text-xs font-bold">1</span>
                  </div>
                  <span>Input data is captured with cryptographic hashing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">2</span>
                  </div>
                  <span>AI model executes in deterministic environment</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-pink-400 text-xs font-bold">3</span>
                  </div>
                  <span>Complete lineage is logged and chained</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-400 text-xs font-bold">4</span>
                  </div>
                  <span>Compliance artifacts are automatically generated</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-3">Ready to Transform Your AI?</h3>
              <p className="text-slate-300 text-sm mb-4">
                See how SlavkoKernel can make your AI systems regulator-ready.
              </p>
              <a
                href="/studio"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Full Studio</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 6. ** Investors Route **

    ```tsx
// src/routes/InvestorsRoute.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Download, Mail, Phone } from 'lucide-react';

export function InvestorsRoute() {
  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Investor{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Data Room
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Access technical deep-dive, market analysis, and complete investment materials
            for FormatDisc — the infrastructure layer for EU AI Act compliance.
          </p>
        </motion.div>

        {/* Data Room Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 mb-16"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Complete Investment Package</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Download our comprehensive investor materials including technical architecture,
              market analysis, financial projections, and founder background.
            </p>
            <a
              href="https://formatdisc.hr/investors-download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <span>Access Data Room</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">The Opportunity</h3>
            <ul className="text-slate-300 space-y-2">
              <li>• €35M compliance fines mandate solution</li>
              <li>• 40,000+ enterprises need compliance</li>
              <li>• $30B+ AI governance market</li>
              <li>• EU AI Act enforcement begins 2025</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Our Solution</h3>
            <ul className="text-slate-300 space-y-2">
              <li>• Infrastructure-level approach</li>
              <li>• Zero model replacement</li>
              <li>• Deterministic execution layer</li>
              <li>• Regulatory alignment built-in</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Ask & Use of Funds</h3>
            <ul className="text-slate-300 space-y-2">
              <li>• €750k seed for 18-month runway</li>
              <li>• 70% Engineering & Product</li>
              <li>• 20% Go-to-Market & Pilots</li>
              <li>• 10% Operations & Legal</li>
            </ul>
          </motion.div>
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-slate-800 rounded-xl border border-slate-700 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Let's Build the Future of Trusted AI</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a
              href="mailto:mladen@formatdisc.hr"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>mladen@formatdisc.hr</span>
            </a>
            <a
              href="tel:+385915421014"
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>+385 91 542 1014</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

## 7. ** Other Routes(skraćeno) **

    ```tsx
// src/routes/DocsRoute.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';

export function DocsRoute() {
  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Technical{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Deep dive into SlavkoKernel architecture, implementation guides, and compliance frameworks.
          </p>
        </motion.div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <FileText className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Technical Whitepaper</h3>
            <p className="text-slate-300 mb-4">
              Complete technical architecture and compliance framework documentation.
            </p>
            <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <ExternalLink className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">API Documentation</h3>
            <p className="text-slate-300 mb-4">
              Complete API reference and integration guides for SlavkoKernel.
            </p>
            <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
              <span>View Docs</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <FileText className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Compliance Guide</h3>
            <p className="text-slate-300 mb-4">
              Step-by-step guide for achieving EU AI Act compliance with SlavkoKernel.
            </p>
            <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download Guide</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

## 8. ** Updated Vite Config **

    ```ts
// vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'router': ['react-router-dom'],
              'animations': ['framer-motion'],
              'studio': ['./src/components/MvpStudio.tsx'],
              'landing': [
                './src/routes/LandingPage.tsx',
                './src/components/landing/*.tsx'
              ]
            }
          }
        }
      }
    };
});
```

## 9. ** Loading Spinner **

    ```tsx
// src/components/ui/LoadingSpinner.tsx
import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
```

## 10. ** Footer **

    ```tsx
// src/components/ui/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FD</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FormatDisc
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Deterministic AI governance for the EU AI Act era. Making enterprise AI transparent, 
              reproducible, and regulator-ready.
            </p>
            <p className="text-slate-500 text-sm">
              © 2025 FormatDisc. All Rights Reserved.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/studio" className="text-slate-400 hover:text-white transition-colors">Studio</Link></li>
              <li><Link to="/kernel" className="text-slate-400 hover:text-white transition-colors">Kernel</Link></li>
              <li><Link to="/docs" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/investors" className="text-slate-400 hover:text-white transition-colors">Investors</Link></li>
              <li><a href="mailto:mladen@formatdisc.hr" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

## 11. ** Package.json dependencies **

    ```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^6.8.0",
    "framer-motion": "^11.3.19",
    "lucide-react": "^0.554.0",
    "@google/genai": "^1.30.0"
  }
}
```

    ** Ovo je kompletan enterprise setup - copy - paste kod koji je production ready! ** 🚀