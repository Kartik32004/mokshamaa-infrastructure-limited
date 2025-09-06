"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Filter, Share2, Printer, Plus, Minus } from "lucide-react"
import { states, getDistrictsForState, sampleAreas, type StateName } from "@/lib/location-data"

interface LocationFilterProps {
  onSelectionChange?: (selection: LocationSelection) => void
}

export interface LocationSelection {
  state: string
  city: string
  areas: string[]
}

const cityCoordinates: Record<string, { x: number; y: number }> = {
  // Maharashtra
  Mumbai: { x: 25, y: 70 },
  "Mumbai Suburban": { x: 28, y: 72 },
  Pune: { x: 45, y: 60 },
  Nagpur: { x: 70, y: 30 },
  Thane: { x: 30, y: 68 },
  Nashik: { x: 50, y: 40 },
  Aurangabad: { x: 60, y: 50 },
  Solapur: { x: 55, y: 75 },
  Kolhapur: { x: 35, y: 80 },
  Sangli: { x: 40, y: 78 },

  // Delhi
  "New Delhi": { x: 50, y: 50 },
  "Central Delhi": { x: 52, y: 48 },
  "East Delhi": { x: 58, y: 50 },
  "North Delhi": { x: 50, y: 40 },
  "South Delhi": { x: 50, y: 60 },

  // Karnataka
  Bengaluru: { x: 50, y: 70 },
  Mysuru: { x: 40, y: 80 },
  Hubli: { x: 30, y: 45 },
  Mangaluru: { x: 20, y: 75 },

  // Tamil Nadu
  Chennai: { x: 60, y: 75 },
  Coimbatore: { x: 40, y: 70 },
  Madurai: { x: 45, y: 85 },

  // Gujarat
  Ahmedabad: { x: 40, y: 45 },
  Surat: { x: 35, y: 55 },
  Vadodara: { x: 38, y: 50 },
  Rajkot: { x: 30, y: 40 },

  // Rajasthan
  Jaipur: { x: 50, y: 35 },
  Jodhpur: { x: 40, y: 30 },
  Udaipur: { x: 45, y: 40 },

  // West Bengal
  Kolkata: { x: 75, y: 55 },
  Howrah: { x: 73, y: 57 },

  // Uttar Pradesh
  Lucknow: { x: 60, y: 35 },
  Kanpur: { x: 58, y: 38 },
  Agra: { x: 55, y: 40 },
  Varanasi: { x: 65, y: 40 },

  // Haryana
  Gurgaon: { x: 52, y: 32 },
  Faridabad: { x: 54, y: 34 },

  // Punjab
  Chandigarh: { x: 48, y: 25 },
  Ludhiana: { x: 45, y: 28 },
  Amritsar: { x: 40, y: 22 },
}

function InteractiveMap({
  markers,
  onPinClick,
  selectedState,
  searchQuery,
}: {
  markers: Array<{ id: string; name: string; x: number; y: number; isActive: boolean }>
  onPinClick: (cityName: string) => void
  selectedState: string
  searchQuery: string
}) {
  const [zoom, setZoom] = useState(1)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 2.5))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.8))

  const filteredMarkers = markers.filter((marker) => marker.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 border border-gray-200">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-white rounded-lg shadow-lg p-1">
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 border-0 hover:bg-orange-100 bg-transparent"
          onClick={handleZoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 border-0 hover:bg-orange-100 bg-transparent"
          onClick={handleZoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border">
        <div className="text-sm font-semibold text-orange-600">{selectedState}</div>
        <div className="text-xs text-gray-600">{filteredMarkers.length} cities shown</div>
      </div>

      <div
        className="relative w-full h-full transition-transform duration-500 ease-out origin-center"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="absolute inset-8 border-2 border-dashed border-orange-300 rounded-2xl bg-white/20 backdrop-blur-sm">
          <div className="absolute top-2 left-4 text-xs font-medium text-orange-700 bg-white/80 px-2 py-1 rounded">
            {selectedState} State
          </div>
        </div>

        {filteredMarkers.map((pin) => (
          <div
            key={pin.id}
            className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 z-10 ${
              pin.isActive ? "scale-150 z-20" : hoveredPin === pin.id ? "scale-125 z-15" : "scale-100"
            }`}
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
            }}
            onClick={() => onPinClick(pin.name)}
            onMouseEnter={() => setHoveredPin(pin.id)}
            onMouseLeave={() => setHoveredPin(null)}
          >
            <div className={`relative w-8 h-8 transition-all duration-200 ${pin.isActive ? "animate-pulse" : ""}`}>
              <div
                className={`w-full h-full rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-colors duration-200 ${
                  pin.isActive
                    ? "bg-orange-500 shadow-orange-300 shadow-lg"
                    : hoveredPin === pin.id
                      ? "bg-blue-600 shadow-blue-300"
                      : "bg-blue-500 shadow-blue-200"
                }`}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
            </div>

            <div
              className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-200 ${
                hoveredPin === pin.id || pin.isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div
                className={`text-xs font-semibold px-3 py-1 rounded-full shadow-lg whitespace-nowrap border ${
                  pin.isActive ? "bg-orange-500 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {pin.name}
              </div>
            </div>
          </div>
        ))}

        {markers.some((m) => m.isActive) && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            📍 {markers.find((m) => m.isActive)?.name} Selected
          </div>
        )}
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded border">
        © Mokshamaa Infrastructure
      </div>
    </div>
  )
}

export function LocationFilter({ onSelectionChange }: LocationFilterProps) {
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableAreas, setAvailableAreas] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isAreasExpanded, setIsAreasExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (selectedState) {
      const cities = getDistrictsForState(selectedState as StateName)
      setAvailableCities(cities)
      setSelectedCity("")
      setSelectedAreas([])
      setAvailableAreas([])
    } else {
      setAvailableCities([])
      setSelectedCity("")
      setSelectedAreas([])
      setAvailableAreas([])
    }
  }, [selectedState])

  useEffect(() => {
    if (selectedCity) {
      const areas = sampleAreas[selectedCity] || [
        `${selectedCity} Central`,
        `${selectedCity} East`,
        `${selectedCity} West`,
        `${selectedCity} North`,
        `${selectedCity} South`,
      ]
      setAvailableAreas(areas)
      setSelectedAreas([])
      if (isMobile) {
        setIsAreasExpanded(true)
      }
    } else {
      setAvailableAreas([])
      setSelectedAreas([])
      setIsAreasExpanded(false)
    }
  }, [selectedCity, isMobile])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        state: selectedState,
        city: selectedCity,
        areas: selectedAreas,
      })
    }
  }, [selectedState, selectedCity, selectedAreas, onSelectionChange])

  const handleAreaToggle = (area: string) => {
    setSelectedAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleShare = async () => {
    const params = new URLSearchParams()
    if (selectedState) params.set("state", selectedState)
    if (selectedCity) params.set("city", selectedCity)
    if (selectedAreas.length > 0) params.set("areas", selectedAreas.join(","))

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`

    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: "Mokshamaa Infrastructure - Location Selection",
          text: `Selected: ${selectedState}, ${selectedCity}`,
          url: url,
        })
      } catch (error) {
        navigator.clipboard.writeText(url)
      }
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  const handlePrint = () => {
    const printContent = `
      Location Selection:
      State: ${selectedState || "Not selected"}
      City: ${selectedCity || "Not selected"}
      Areas: ${selectedAreas.length > 0 ? selectedAreas.join(", ") : "None selected"}
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Location Selection</title></head>
          <body>
            <h1>Mokshamaa Infrastructure - Location Selection</h1>
            <pre>${printContent}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const resetSelection = () => {
    setSelectedState("")
    setSelectedCity("")
    setSelectedAreas([])
    setIsAreasExpanded(false)
    setSearchQuery("")
  }

  const getMapMarkers = () => {
    if (!selectedState) return []

    if (selectedCity) {
      const coords = cityCoordinates[selectedCity]
      if (coords) {
        return [
          {
            id: selectedCity,
            name: selectedCity,
            x: coords.x,
            y: coords.y,
            isActive: true,
          },
        ]
      }
    } else {
      return availableCities
        .map((city) => {
          const coords = cityCoordinates[city]
          if (coords) {
            return {
              id: city,
              name: city,
              x: coords.x,
              y: coords.y,
              isActive: false,
            }
          }
          return null
        })
        .filter(Boolean) as Array<{ id: string; name: string; x: number; y: number; isActive: boolean }>
    }

    return []
  }

  const handlePinClick = (cityName: string) => {
    if (!selectedCity) {
      setSelectedCity(cityName)
    }
  }

  const handlePinAllInState = () => {
    setSelectedCity("")
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      {(selectedState || selectedCity || selectedAreas.length > 0) && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-orange-700">Current Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {selectedState && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-16">State:</span>
                <Badge variant="default" className="bg-orange-500 text-white hover:bg-orange-600">
                  {selectedState}
                </Badge>
              </div>
            )}
            {selectedCity && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-16">City:</span>
                <Badge variant="default" className="bg-orange-600 text-white hover:bg-orange-700">
                  {selectedCity}
                </Badge>
              </div>
            )}
            {selectedAreas.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium min-w-16">Areas:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAreas.map((area) => (
                    <Badge key={area} variant="outline" className="text-xs border-orange-300 text-orange-700">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">Step 1: Select State</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Choose State" />
              </SelectTrigger>
              <SelectContent className={isMobile ? "max-h-60" : ""}>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">Step 2: Select City</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
              <SelectTrigger className="w-full border-orange-200 focus:border-orange-400">
                <SelectValue placeholder={selectedState ? "Choose City" : "Select State First"} />
              </SelectTrigger>
              <SelectContent className={isMobile ? "max-h-60" : ""}>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedState && <p className="text-xs text-orange-600 mt-2">{availableCities.length} cities available</p>}
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">Step 3: Select Areas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!selectedCity ? (
              <p className="text-sm text-orange-600/70">Select city first</p>
            ) : (
              <>
                <div className={`space-y-3 ${isMobile ? "max-h-40" : "max-h-48"} overflow-y-auto`}>
                  {availableAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={selectedAreas.includes(area)}
                        onCheckedChange={() => handleAreaToggle(area)}
                        className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <label
                        htmlFor={area}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 hover:text-orange-600 transition-colors"
                      >
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  {selectedAreas.length} of {availableAreas.length} areas selected
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center gap-2 bg-white hover:bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-700"
        >
          <Share2 className="h-4 w-4" />
          Share Selection
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white hover:bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-700"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          variant="outline"
          onClick={resetSelection}
          className="flex items-center gap-2 bg-white hover:bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-700"
        >
          <Filter className="h-4 w-4" />
          Reset All
        </Button>
      </div>
    </div>
  )
}
