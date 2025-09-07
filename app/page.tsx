"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LocationFilter, type LocationSelection } from "@/components/location-filter"
import { CategorySelector } from "@/components/category-selector"
import { VisionSection, MissionSection, AboutUsSection } from "@/components/vision-mission-sections"
import { InquiryForm } from "@/components/inquiry-form"
import { FileText } from "lucide-react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Text3D, Center } from "@react-three/drei"
import * as THREE from "three"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// 3D Globe Component
function Globe({ onAnimationComplete, isMobile }: { onAnimationComplete: () => void; isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [animationPhase, setAnimationPhase] = useState(0) // 0: rotate, 1: zoom to India, 2: complete
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      "/assets/3d/texture_earth.jpg",
      (texture) => {
        setEarthTexture(texture)
      },
      undefined,
      (error) => {
        console.log("[v0] Earth texture failed to load, using fallback color")
        // Fallback to a blue-green color if texture fails
      },
    )
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    if (animationPhase === 0) {
      meshRef.current.rotation.y += isMobile ? 0.003 : 0.005

      // After 3 seconds, start zoom animation to India
      if (state.clock.elapsedTime > 3) {
        setAnimationPhase(1)
      }
    } else if (animationPhase === 1) {
      // Zoom to India phase
      const progress = Math.min((state.clock.elapsedTime - 3) / 2, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      // Rotate to show India (approximately 77°E longitude, 20°N latitude)
      const targetRotationY = -1.34 // Approximately 77 degrees in radians
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        easeProgress * 0.02,
      )

      // Scale up slightly to focus on India
      const scale = THREE.MathUtils.lerp(1, 1.3, easeProgress)
      meshRef.current.scale.setScalar(scale)

      if (progress >= 1) {
        setAnimationPhase(2)
        onAnimationComplete()
      }
    }
  })

  return (
    <Sphere ref={meshRef} args={[2, isMobile ? 32 : 64, isMobile ? 32 : 64]}>
      <meshStandardMaterial
        map={earthTexture}
        color={earthTexture ? "#ffffff" : "#4ade80"}
        roughness={0.8}
        metalness={0.1}
      />
    </Sphere>
  )
}

// 3D Mokshamaa Logo Component
function MokshamaaLogo({ show, isMobile }: { show: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 500)
    }
  }, [show])

  useFrame(() => {
    if (!groupRef.current || !visible) return

    // Emerge from India's position on the globe (front-center after rotation)
    const targetY = visible ? 3.5 : 0 // Emerge upward from the globe
    const targetZ = visible ? 2 : 0 // Come forward from the globe surface

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.03)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.03)

    // Add gentle floating animation
    if (visible) {
      groupRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.1
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={isMobile ? 0.25 : 0.4}
          height={0.15}
          curveSegments={isMobile ? 6 : 12}
        >
          MOKSHAMAA
          <meshStandardMaterial
            color="#d97706"
            metalness={0.8}
            roughness={0.2}
            emissive="#d97706"
            emissiveIntensity={0.2}
          />
        </Text3D>
      </Center>
    </group>
  )
}

// Hero Section Component with Video Animation
function HeroSection() {
  const [animationPhase, setAnimationPhase] = useState(0) // 0: video, 1: logo animation, 2: content
  const [showContent, setShowContent] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  const handleVideoEnd = () => {
    setAnimationPhase(1)
    setTimeout(() => {
      setAnimationPhase(2)
      setShowContent(true)
    }, 2000)
  }

  return (
    <section className="relative h-screen bg-gradient-to-b from-background to-muted overflow-hidden">
      {/* Video Animation */}
      {animationPhase === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/istockphoto-1456412730-640_adpp_is.mp4_1757221870114-npAZC9W8xoCAoGJnnzoHvJorXhWvUE.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      )}

      {/* Logo Animation */}
      {animationPhase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
          <div
            ref={logoRef}
            className={`transform transition-all duration-2000 ease-out ${
              animationPhase >= 1 ? "translate-z-0 scale-100 opacity-100" : "translate-z-[-100px] scale-50 opacity-0"
            }`}
            style={{
              transform: animationPhase >= 1 ? "translateZ(0) scale(1)" : "translateZ(-100px) scale(0.5)",
              animation: animationPhase >= 1 ? "logoEmerge 2s ease-out forwards" : "none",
            }}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pYTRYhbQSLFBFjd47Ala9PcKvvLDEs.png"
              alt="Mokshamaa Infrastructure Limited"
              className={`${isMobile ? "h-32 w-auto" : "h-48 w-auto"} drop-shadow-2xl`}
            />
          </div>
        </div>
      )}

      {/* Content Overlay */}
      {showContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-20 bg-gradient-to-t from-background/90 to-transparent">
          <div className="text-center space-y-4 md:space-y-6 animate-fade-in-up px-4">
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-foreground text-balance">
                MOKSHAMAA CITY
              </h1>
              <p className="text-base md:text-xl text-muted-foreground text-pretty">Mokshamaa Infrastructure Limited</p>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-4 mt-6 md:mt-8 max-w-sm md:max-w-none mx-auto">
              {["Home", "Vision", "Mission", "About Us"].map((tab) => (
                <Button
                  key={tab}
                  variant={tab === "Home" ? "default" : "outline"}
                  size={isMobile ? "default" : "lg"}
                  className="min-w-20 md:min-w-24 text-sm md:text-base"
                  onClick={() => {
                    const element = document.getElementById(tab.toLowerCase().replace(" ", "-"))
                    element?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Company Logo in Corner (only show after animation) */}
      {showContent && (
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pYTRYhbQSLFBFjd47Ala9PcKvvLDEs.png"
            alt="Mokshamaa Infrastructure Limited"
            className="h-12 md:h-16 w-auto"
            loading="eager"
          />
        </div>
      )}

      <style jsx>{`
        @keyframes logoEmerge {
          0% {
            transform: translateZ(-100px) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateZ(-50px) scale(0.75);
            opacity: 0.7;
          }
          100% {
            transform: translateZ(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </section>
  )
}

// Main Page Component
export default function HomePage() {
  const [locationSelection, setLocationSelection] = useState<LocationSelection>({
    state: "",
    city: "",
    areas: [],
  })
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const isMobile = useIsMobile()

  // Load selection from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const state = params.get("state") || ""
    const city = params.get("city") || ""
    const areas = params.get("areas")?.split(",").filter(Boolean) || []

    setLocationSelection({ state, city, areas })
  }, [])

  const handleCategoryChange = (category: string, subcategory: string, options: any) => {
    console.log("Category selection:", { category, subcategory, options })
    setSelectedCategory(category)
  }

  const handleInquirySubmit = (formData: any) => {
    console.log("Inquiry submitted:", formData)
    // In a real app, this would send data to the backend
    setShowInquiryForm(false)
  }

  return (
    <main className="min-h-screen">
      <HeroSection />

      <section id="home" className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-balance">Home - Service Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base text-pretty leading-relaxed">
              Select your location and explore our comprehensive services across Religious, Residential, Commercial,
              Education, Medical, and Social categories.
            </p>
          </div>

          {/* Location Filter */}
          <LocationFilter onSelectionChange={setLocationSelection} />

          {/* Category Selector */}
          <CategorySelector locationSelection={locationSelection} onCategoryChange={handleCategoryChange} />

          {/* Inquiry Form Toggle */}
          {locationSelection.state && locationSelection.city && (
            <div className="text-center">
              <Button
                size={isMobile ? "default" : "lg"}
                onClick={() => setShowInquiryForm(!showInquiryForm)}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <FileText className="h-4 md:h-5 w-4 md:w-5" />
                {showInquiryForm ? "Hide Inquiry Form" : "Submit Service Inquiry"}
              </Button>
            </div>
          )}

          {/* Inquiry Form */}
          {showInquiryForm && (
            <InquiryForm
              locationSelection={locationSelection}
              selectedCategory={selectedCategory as any}
              onSubmit={handleInquirySubmit}
            />
          )}

          {/* Selection Summary */}
          {locationSelection.state && (
            <Card className="bg-muted/50">
              <CardContent className="p-4 md:p-6">
                <h4 className="font-semibold mb-3 text-sm md:text-base">Your Location Selection</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm">
                  <div className="flex flex-col md:block">
                    <span className="font-medium">State:</span>
                    <span className="md:ml-1">{locationSelection.state}</span>
                  </div>
                  <div className="flex flex-col md:block">
                    <span className="font-medium">City:</span>
                    <span className="md:ml-1">{locationSelection.city || "Not selected"}</span>
                  </div>
                  <div className="flex flex-col md:block">
                    <span className="font-medium">Areas:</span>{" "}
                    <span className="md:ml-1">
                      {locationSelection.areas.length > 0
                        ? `${locationSelection.areas.length} selected`
                        : "None selected"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <VisionSection />
      <MissionSection />
      <AboutUsSection />
    </main>
  )
}
