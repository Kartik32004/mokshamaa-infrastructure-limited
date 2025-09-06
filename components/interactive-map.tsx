"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"
import { MapPinIcon } from "lucide-react" // Renamed to avoid redeclaration

interface MapPin {
  id: string
  name: string
  lat: number
  lng: number
  isActive: boolean
}

interface InteractiveMapProps {
  selectedState: string
  selectedCity: string
  onPinAllInState?: () => void
}

// Sample coordinates for major Indian cities (in reality, you'd have a comprehensive database)
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Maharashtra cities
  Mumbai: { lat: 19.076, lng: 72.8777 },
  "Mumbai Suburban": { lat: 19.0896, lng: 72.8656 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
  Thane: { lat: 19.2183, lng: 72.9781 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Aurangabad: { lat: 18.8311, lng: 75.3981 },
  Solapur: { lat: 17.6599, lng: 75.9064 },
  Kolhapur: { lat: 16.705, lng: 74.2433 },
  Sangli: { lat: 16.8524, lng: 74.5815 },
  Ahmednagar: { lat: 19.0948, lng: 74.748 },
  Satara: { lat: 17.6805, lng: 74.0183 },
  Raigad: { lat: 18.2367, lng: 73.1305 },
  Ratnagiri: { lat: 16.9902, lng: 73.312 },
  Sindhudurg: { lat: 16.0667, lng: 73.6667 },
  // Add more cities as needed
}

const stateCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
  Maharashtra: { lat: 19.7515, lng: 75.7139, zoom: 7 },
  Karnataka: { lat: 15.3173, lng: 75.7139, zoom: 7 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569, zoom: 7 },
  // Add more states as needed
}

export function InteractiveMap({ selectedState, selectedCity, onPinAllInState }: InteractiveMapProps) {
  const [mapPins, setMapPins] = useState<MapPin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }) // India center
  const [zoomLevel, setZoomLevel] = useState(5)

  // Generate pins based on selected state
  useEffect(() => {
    if (selectedState && !selectedCity) {
      // Show all cities in the selected state
      const stateCities = Object.keys(cityCoordinates).filter((city) => {
        // In a real app, you'd have a proper state-city mapping
        if (selectedState === "Maharashtra") {
          return [
            "Mumbai",
            "Mumbai Suburban",
            "Pune",
            "Nagpur",
            "Thane",
            "Nashik",
            "Aurangabad",
            "Solapur",
            "Kolhapur",
            "Sangli",
            "Ahmednagar",
            "Satara",
            "Raigad",
            "Ratnagiri",
            "Sindhudurg",
          ].includes(city)
        }
        return false
      })

      const pins: MapPin[] = stateCities.map((city, index) => ({
        id: `${city}-${index}`,
        name: city,
        lat: cityCoordinates[city].lat,
        lng: cityCoordinates[city].lng,
        isActive: false,
      }))

      setMapPins(pins)

      // Center map on state
      if (stateCoordinates[selectedState]) {
        setMapCenter({
          lat: stateCoordinates[selectedState].lat,
          lng: stateCoordinates[selectedState].lng,
        })
        setZoomLevel(stateCoordinates[selectedState].zoom)
      }
    } else if (selectedState && selectedCity) {
      // Show only the selected city as active
      const cityCoord = cityCoordinates[selectedCity]
      if (cityCoord) {
        const pins: MapPin[] = [
          {
            id: selectedCity,
            name: selectedCity,
            lat: cityCoord.lat,
            lng: cityCoord.lng,
            isActive: true,
          },
        ]
        setMapPins(pins)
        setMapCenter(cityCoord)
        setZoomLevel(10)
      }
    } else {
      setMapPins([])
      setMapCenter({ lat: 20.5937, lng: 78.9629 })
      setZoomLevel(5)
    }
  }, [selectedState, selectedCity])

  const handlePinAllInState = () => {
    if (selectedState && onPinAllInState) {
      onPinAllInState()
      // Activate all pins in the state
      setMapPins((prev) => prev.map((pin) => ({ ...pin, isActive: true })))
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 15))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 3))
  }

  // Convert lat/lng to pixel coordinates (simplified for demo)
  const getPixelPosition = (lat: number, lng: number) => {
    const mapWidth = 600
    const mapHeight = 400

    // Simple mercator projection (not accurate, just for demo)
    const x = ((lng + 180) / 360) * mapWidth
    const y = ((90 - lat) / 180) * mapHeight

    return { x: Math.max(20, Math.min(x, mapWidth - 20)), y: Math.max(20, Math.min(y, mapHeight - 20)) }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg">Find and Pin Your City</CardTitle>
          {selectedState && !selectedCity && (
            <Button onClick={handlePinAllInState} className="bg-orange-500 hover:bg-orange-600 text-white">
              Pin all in {selectedState}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={`Type a city name for quick match (e.g., "mumbai") or a state to pin all its cities (e.g., "${selectedState || "maharashtra"}")`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Map Container */}
          <div
            className="relative w-full h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-200"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e0e7ff' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Pins */}
            {mapPins.map((pin) => {
              const position = getPixelPosition(pin.lat, pin.lng)
              return (
                <div
                  key={pin.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                  }}
                >
                  <div className="relative">
                    <MapPinIcon
                      className={`h-6 w-6 transition-all duration-200 ${
                        pin.isActive
                          ? "text-orange-500 scale-125 drop-shadow-lg"
                          : "text-blue-500 hover:text-blue-600 hover:scale-110"
                      }`}
                      fill="currentColor"
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                      {pin.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* State/Region Overlay */}
            {selectedState && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <div className="text-sm font-medium text-gray-900">{selectedState}</div>
                <div className="text-xs text-gray-600">
                  {mapPins.length} cities {selectedCity ? `• ${selectedCity} selected` : "available"}
                </div>
              </div>
            )}

            {/* No Selection State */}
            {!selectedState && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPinIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a state to view cities on map</p>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-blue-500" fill="currentColor" />
              <span>Available Cities</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-orange-500 scale-125" fill="currentColor" />
              <span>Selected City</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
