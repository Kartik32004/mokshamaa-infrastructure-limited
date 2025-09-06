"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Target, Users, Building, Award, MapPin, Heart, Lightbulb, Shield } from "lucide-react"

export function VisionSection() {
  return (
    <section id="vision" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex items-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2 bg-amber-100 text-amber-800 border-amber-200">
                Our Vision
              </Badge>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight">
              हमारा दृष्टिकोण
            </h2>
          </div>

          {/* Main Vision Statement */}
          <Card className="max-w-4xl mx-auto border-amber-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <blockquote className="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed text-center">
                "विश्व के एक भी जैन को खुद का घर और नौकरी-धंधा के बिना नहीं रहना चाहिए।"
              </blockquote>
              <p className="text-xl text-gray-600 mt-6 text-center font-medium">
                "No Jain in the world should live without their own home and livelihood."
              </p>
            </CardContent>
          </Card>

          {/* Vision Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 border-amber-200 bg-white/90">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Housing for All</h3>
                <div className="text-4xl font-bold text-amber-600 mb-2">10,000+</div>
                <p className="text-gray-600">Homes Delivered Across India</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-amber-200 bg-white/90">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Community Reach</h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
                <p className="text-gray-600">Communities Served Nationwide</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-amber-200 bg-white/90">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Vision 2030</h3>
                <div className="text-4xl font-bold text-red-600 mb-2">100%</div>
                <p className="text-gray-600">Jain Families with Homes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MissionSection() {
  return (
    <section id="mission" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
                Our Mission
              </Badge>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              हमारा मिशन
            </h2>
          </div>

          {/* Mission Statement */}
          <Card className="max-w-5xl mx-auto border-blue-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <blockquote className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed text-center mb-6">
                "मोक्षमा इन्फ्रास्ट्रक्चर प्राइवेट लिमिटेड — पिछले 6 सालों से भारत के गाँव-गाँव में जैनों की जरूरियत को समझकर उनको पूरा करने
                का प्रयत्न कर रही है।"
              </blockquote>
              <p className="text-lg text-gray-600 text-center font-medium">
                "Mokshamaa Infrastructure Private Limited has been striving for the past 6 years to understand and
                fulfill the needs of Jains in every village of India."
              </p>
            </CardContent>
          </Card>

          {/* Mission Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-blue-200 bg-white/90 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">6+</div>
                <div className="text-sm text-gray-600">Years of Service</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-white/90 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">28</div>
                <div className="text-sm text-gray-600">States Covered</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-white/90 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">180+</div>
                <div className="text-sm text-gray-600">Universities</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-white/90 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </CardContent>
            </Card>
          </div>

          {/* Core Services */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Our Core Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Religious Infrastructure", desc: "Temples, Upashrays, and Sacred Spaces" },
                { icon: Building, title: "Residential Solutions", desc: "Jain-friendly Housing Communities" },
                { icon: Lightbulb, title: "Commercial Spaces", desc: "Business Centers and Markets" },
                { icon: Award, title: "Educational Services", desc: "Schools and University Admissions" },
                { icon: Heart, title: "Medical Facilities", desc: "Healthcare with Jain Values" },
                { icon: Users, title: "Social Centers", desc: "Community Halls and Events" },
              ].map((service, index) => (
                <Card
                  key={service.title}
                  className="group hover:shadow-xl transition-all duration-300 border-blue-200 bg-white/90"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{service.title}</h4>
                    <p className="text-sm text-gray-600">{service.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutUsSection() {
  return (
    <section id="about-us" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex items-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2 bg-green-100 text-green-800 border-green-200">
                About Us
              </Badge>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Mokshamaa Infrastructure Limited
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Dedicated to serving the Jain community across India with comprehensive infrastructure solutions for over
              6 years.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Company Story */}
            <Card className="text-left border-green-200 shadow-xl bg-white/90">
              <CardContent className="p-10 space-y-6">
                <h3 className="font-serif text-3xl font-bold text-gray-800">Our Story</h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Mokshamaa Infrastructure Limited was founded with a singular vision: to ensure that no Jain in the
                    world lives without their own home and sustainable livelihood. For over six years, we have been
                    working tirelessly across India's villages and cities.
                  </p>
                  <p>
                    Our comprehensive approach encompasses religious infrastructure, residential solutions, commercial
                    spaces, educational services, medical facilities, and social centers. We specialize in creating
                    tailored solutions that honor Jain values.
                  </p>
                  <p>
                    From establishing Jain temples and upashrays to developing residential complexes with Jain-friendly
                    amenities, we bridge the gap between tradition and contemporary living.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-white/90 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2">28</div>
                  <div className="text-sm text-gray-600">States & UTs Covered</div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-white/90 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">10,000+</div>
                  <div className="text-sm text-gray-600">Families Served</div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-white/90 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">6+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-white/90 hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-cyan-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Communities</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 shadow-xl">
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-3">Registered Office</h4>
                  <p className="text-gray-600">
                    Mokshamaa Infrastructure Limited
                    <br />
                    Serving Jain Communities
                    <br />
                    Across India Since 2018
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-3">Founded</h4>
                  <p className="text-gray-600">
                    2018
                    <br />
                    6+ Years of Dedicated Service
                    <br />
                    to Jain Communities
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-3">Leadership</h4>
                  <p className="text-gray-600">
                    Experienced Team of
                    <br />
                    Infrastructure Professionals
                    <br />
                    and Community Leaders
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
