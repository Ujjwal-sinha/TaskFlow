"use client"

import React from "react"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Navigation } from "@/components/custom/navigation"
import { HeroSection } from "@/components/custom/hero-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  Check,
  X,
  ChevronRight,
  Play,
  Users,
  Briefcase,
  Lock,
  Sparkles,
  Wallet,
  ArrowUpRight,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "Smart contract-based escrow ensures safe payments for both clients and freelancers.",
    color: "text-apple-green",
    bgColor: "bg-apple-green/10",
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Get paid immediately upon task completion with cryptocurrency transactions.",
    color: "text-apple-yellow",
    bgColor: "bg-apple-yellow/10",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with talent and opportunities from around the world without borders.",
    color: "text-apple-blue",
    bgColor: "bg-apple-blue/10",
  },
  {
    icon: Lock,
    title: "Privacy Protection",
    description: "Your data is encrypted and secure. We never share your information with third parties.",
    color: "text-apple-purple",
    bgColor: "bg-apple-purple/10",
  },
  {
    icon: Sparkles,
    title: "Talent Matching",
    description: "Our AI-powered system matches you with the perfect freelancers for your specific needs.",
    color: "text-apple-teal",
    bgColor: "bg-apple-teal/10",
  },
  {
    icon: Wallet,
    title: "Low Fees",
    description: "Just 5% platform fee, significantly lower than traditional freelancing platforms.",
    color: "text-apple-orange",
    bgColor: "bg-apple-orange/10",
  },
]

const steps = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Set up your profile and showcase your skills to potential clients.",
    icon: Users,
  },
  {
    step: 2,
    title: "Browse & Apply",
    description: "Find tasks that match your expertise and submit compelling proposals.",
    icon: Briefcase,
  },
  {
    step: 3,
    title: "Complete & Earn",
    description: "Deliver quality work and receive instant payments in cryptocurrency.",
    icon: Wallet,
  },
  {
    step: 4,
    title: "Build Reputation",
    description: "Earn reviews and build your reputation to attract more high-quality clients.",
    icon: Star,
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "TaskFlow has revolutionized how I work with clients. The secure payments and global reach have opened up so many opportunities. I've increased my income by 40% since joining!",
    location: "Singapore",
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "The platform is incredibly intuitive and the escrow system gives me confidence in every transaction. I've worked with clients from 12 different countries in just three months!",
    location: "Brazil",
  },
  {
    name: "Emily Watson",
    role: "Content Writer",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "I love the transparency and speed of payments. TaskFlow has become my go-to platform for freelance work. The client matching algorithm is surprisingly accurate!",
    location: "United Kingdom",
  },
  {
    name: "Raj Patel",
    role: "Blockchain Developer",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "As a blockchain developer, I appreciate that TaskFlow uses the technology it's built on. Smart contracts for payments means I get paid instantly when my work is approved.",
    location: "India",
  },
  {
    name: "Olivia Kim",
    role: "Digital Marketer",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "The quality of clients on TaskFlow is exceptional. I've built long-term relationships with several businesses that found me through the platform's matching system.",
    location: "South Korea",
  },
]

const pricingPlans = [
  {
    name: "Freelancer",
    description: "Perfect for independent professionals",
    price: "Free",
    features: [
      "Create professional profile",
      "Apply to unlimited tasks",
      "Secure payment protection",
      "Basic analytics",
      "5% platform fee on earnings",
    ],
    notIncluded: ["Priority support", "Featured profile", "Custom branding"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro Freelancer",
    description: "For serious freelance professionals",
    price: "$15",
    period: "per month",
    features: [
      "Everything in Freelancer",
      "Featured profile placement",
      "Early access to new tasks",
      "Advanced analytics",
      "3% platform fee on earnings",
      "Priority support",
    ],
    notIncluded: ["Custom branding"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Agency",
    description: "For teams and growing agencies",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Pro Freelancer",
      "Team collaboration tools",
      "Custom branding",
      "Client CRM tools",
      "API access",
      "2% platform fee on earnings",
      "Dedicated account manager",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "How does TaskFlow's escrow payment system work?",
    answer:
      "Our escrow system uses smart contracts on the XDC blockchain. When a client hires you, they deposit funds into an escrow smart contract. Once you complete the work and the client approves it, the funds are automatically released to your wallet. This ensures security for both parties without lengthy waiting periods.",
  },
  {
    question: "What are the fees for using TaskFlow?",
    answer:
      "TaskFlow charges a 5% fee on all transactions for freelancers on the basic plan. Pro freelancers pay 3%, and agencies pay 2%. There are no hidden fees, and clients don't pay any additional platform fees. All fees are transparently shown before you accept any job.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "You can withdraw your earnings directly to your XDC wallet at any time. There's no minimum withdrawal amount, and transactions typically complete within minutes. You can also convert your XDC to other cryptocurrencies or fiat currencies through our integrated exchange partners.",
  },
  {
    question: "Is my personal information secure on TaskFlow?",
    answer:
      "Yes, we take security very seriously. Your personal information is encrypted and stored securely. We use industry-standard security protocols and regular security audits to ensure your data remains protected. We never share your information with third parties without your explicit consent.",
  },
  {
    question: "How does TaskFlow match freelancers with clients?",
    answer:
      "Our AI-powered matching system analyzes your skills, experience, portfolio, and past performance to match you with relevant tasks. The system also considers your preferences, availability, and rates to ensure the best possible match for both you and the client.",
  },
  {
    question: "Can I use TaskFlow if I'm not familiar with cryptocurrency?",
    answer:
      "TaskFlow is designed to be user-friendly even if you're new to cryptocurrency. We provide simple guides to help you set up your wallet, and our interface makes it easy to manage your earnings without needing to understand the technical aspects of blockchain technology.",
  },
]

const comparisonFeatures = [
  "Platform Fee",
  "Payment Speed",
  "Global Access",
  "Payment Security",
  "Client Quality",
  "Dispute Resolution",
]

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const testimonialRef = useRef(null)
  const isTestimonialInView = useInView(testimonialRef, { once: false, amount: 0.2 })
  const featuresRef = useRef(null)
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const howItWorksRef = useRef(null)
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 })
  const pricingRef = useRef(null)
  const isPricingInView = useInView(pricingRef, { once: true, amount: 0.2 })

  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-apple-blue to-apple-purple hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="mr-2">Get Started</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-border/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-lg font-medium text-muted-foreground">Trusted by 10,000+ freelancers worldwide</p>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70">
            {["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"].map((company) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <div className="h-8 w-32 bg-muted rounded-md flex items-center justify-center font-semibold text-muted-foreground">
                  {company}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-blue/10 text-apple-blue border-apple-blue/20 rounded-full">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need for Successful Freelancing
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the future of freelancing with our cutting-edge Web3 platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-apple hover:shadow-apple-lg transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent via-transparent group-hover:from-apple-blue/5 group-hover:via-apple-purple/5 group-hover:to-transparent transition-all duration-700"></div>
                  <CardContent className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.bgColor} ${feature.color}`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/marketplace">
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-purple/10 text-apple-purple border-apple-purple/20 rounded-full">
              See it in action
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Watch TaskFlow in Action</h2>
            <p className="text-lg text-muted-foreground">
              See how our platform makes freelancing easier, safer, and more profitable
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-apple-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/20 to-apple-purple/20 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <Button
                  size="lg"
                  className="rounded-full h-20 w-20 bg-white text-apple-blue hover:scale-110 transition-all duration-300"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-bold mb-2">TaskFlow Platform Tour</h3>
              <p className="text-sm text-white/80">See how to find work, complete tasks, and get paid instantly</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-green/10 text-apple-green border-apple-green/20 rounded-full">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How TaskFlow Works</h2>
            <p className="text-lg text-muted-foreground">Get started in four simple steps</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-16 md:space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={isHowItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 md:px-8">
                    <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-apple-lg transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent via-transparent group-hover:from-apple-blue/5 group-hover:via-apple-purple/5 group-hover:to-transparent transition-all duration-700"></div>
                      <CardContent className="p-8">
                        <div className="flex items-center mb-6">
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full bg-apple-blue/10 text-apple-blue text-lg font-bold mr-4`}
                          >
                            {step.step}
                          </div>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <div className="flex items-start mb-6">
                          <div className="mr-4 mt-1">
                            <step.icon className="h-6 w-6 text-apple-blue" />
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                        <Button variant="ghost" className="group/btn">
                          Learn more{" "}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-apple-blue border-4 border-background relative z-10">
                    <div className="absolute -inset-2 bg-apple-blue/20 rounded-full animate-ping opacity-75"></div>
                  </div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-orange/10 text-apple-orange border-apple-orange/20 rounded-full">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">TaskFlow vs. Traditional Platforms</h2>
            <p className="text-lg text-muted-foreground">See how we compare to traditional freelancing platforms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <div className="min-w-[768px]">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center">
                  <div className="bg-apple-blue/10 rounded-t-lg p-4">
                    <h3 className="font-bold text-xl text-apple-blue">TaskFlow</h3>
                    <p className="text-sm text-muted-foreground">Web3 Freelancing</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="bg-muted rounded-t-lg p-4">
                    <h3 className="font-bold text-xl">Traditional</h3>
                    <p className="text-sm text-muted-foreground">Freelance Platforms</p>
                  </div>
                </div>

                {comparisonFeatures.map((feature, index) => (
                  <React.Fragment key={feature}>
                    <div
                      className={`col-span-1 p-4 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/50"
                      } flex items-center font-medium`}
                    >
                      {feature}
                    </div>
                    <div
                      className={`col-span-1 p-4 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/50"
                      } text-center flex items-center justify-center`}
                    >
                      {(() => {
                        switch (feature) {
                          case "Platform Fee":
                            return <span className="text-apple-green font-semibold">Only 5%</span>
                          case "Payment Speed":
                            return <span className="text-apple-green font-semibold">Instant</span>
                          case "Global Access":
                            return <Check className="h-5 w-5 text-apple-green" />
                          case "Payment Security":
                            return <span className="text-apple-green font-semibold">Smart Contracts</span>
                          case "Client Quality":
                            return <span className="text-apple-green font-semibold">Verified Web3 Clients</span>
                          case "Dispute Resolution":
                            return <span className="text-apple-green font-semibold">Decentralized</span>
                          default:
                            return <Check className="h-5 w-5 text-apple-green" />
                        }
                      })()}
                    </div>
                    <div
                      className={`col-span-1 p-4 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/50"
                      } text-center flex items-center justify-center`}
                    >
                      {(() => {
                        switch (feature) {
                          case "Platform Fee":
                            return <span className="text-muted-foreground">20% or more</span>
                          case "Payment Speed":
                            return <span className="text-muted-foreground">3-14 days</span>
                          case "Global Access":
                            return <Check className="h-5 w-5 text-muted-foreground" />
                          case "Payment Security":
                            return <span className="text-muted-foreground">Traditional Escrow</span>
                          case "Client Quality":
                            return <span className="text-muted-foreground">Mixed</span>
                          case "Dispute Resolution":
                            return <span className="text-muted-foreground">Platform Controlled</span>
                          default:
                            return <X className="h-5 w-5 text-muted-foreground" />
                        }
                      })()}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialRef} className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-teal/10 text-apple-teal border-apple-teal/20 rounded-full">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">Join thousands of satisfied freelancers and clients</p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>

            <div className="flex overflow-x-auto space-x-6 pb-8 px-4 scrollbar-hide snap-x snap-mandatory">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isTestimonialInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="min-w-[350px] max-w-[350px] snap-center"
                >
                  <Card className="h-full border-0 shadow-apple bg-card/50 backdrop-blur-sm hover:shadow-apple-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                        </div>
                      </div>
                      <Quote className="h-8 w-8 text-apple-blue mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-apple-yellow text-apple-yellow" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[0, 1, 2].map((dot) => (
              <Button
                key={dot}
                variant="outline"
                size="icon"
                className={`rounded-full ${dot === 0 ? "bg-apple-blue text-white" : ""}`}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
              </Button>
            ))}
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-blue/10 text-apple-blue border-apple-blue/20 rounded-full">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">Choose the plan that's right for your freelancing career</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full border-0 ${
                    plan.popular
                      ? "shadow-apple-lg bg-gradient-to-b from-apple-blue/10 to-apple-purple/5"
                      : "shadow-apple bg-card/50"
                  } backdrop-blur-sm relative overflow-hidden`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-apple-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                    </div>

                    <Separator className="my-6" />

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-apple-green mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-start text-muted-foreground">
                          <X className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-apple-blue hover:bg-apple-blue/90"
                          : "bg-muted-foreground/10 text-foreground hover:bg-muted-foreground/20"
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-apple-purple/10 text-apple-purple border-apple-purple/20 rounded-full">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about TaskFlow and how it works</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-apple-blue to-apple-purple">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Stay Updated with TaskFlow
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Subscribe to our newsletter for the latest features, tips, and opportunities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                placeholder="Enter your email"
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
              />
              <Button size="lg" variant="secondary" className="shrink-0">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-white/60 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to Transform Your Freelance Career?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of freelancers already using TaskFlow to find better clients, secure payments, and grow
              their business.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-apple-blue hover:bg-apple-blue/90">
                <Link href="/login">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-apple-blue to-apple-purple">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TaskFlow</span>
              </div>
              <p className="text-muted-foreground max-w-md mb-4">
                The decentralized platform connecting talented freelancers with clients worldwide. Secure, transparent,
                and built for the future.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "github", "linkedin"].map((social) => (
                  <Button key={social} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <span className="sr-only">{social}</span>
                    <div className="h-4 w-4 bg-muted rounded-full"></div>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/marketplace" className="hover:text-foreground">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/post-task" className="hover:text-foreground">
                    Post Task
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 TaskFlow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}