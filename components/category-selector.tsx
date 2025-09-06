"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Home, Store, GraduationCap, Heart, Users, ChevronRight, Filter } from "lucide-react"
import type { LocationSelection } from "@/components/location-filter"

interface CategorySelectorProps {
  locationSelection: LocationSelection
  onCategoryChange?: (category: string, subcategory: string, options: any) => void
}

export type ServiceCategory = "Religious" | "Residential" | "Commercial" | "Education" | "Medical" | "Social"

const categoryIcons = {
  Religious: Building2,
  Residential: Home,
  Commercial: Store,
  Education: GraduationCap,
  Medical: Heart,
  Social: Users,
}

const categoryData = {
  Religious: {
    description: "Jain religious facilities and spiritual centers",
    subcategories: {
      "Jain Sect": {
        type: "select",
        options: ["Shwetambar", "Digambar", "Sthanakvasi", "Terapanth"],
      },
      "Building Type": {
        type: "select",
        options: ["Jain Temple", "Jain Upashray", "Jain Sthanak"],
      },
    },
  },
  Residential: {
    description: "Housing solutions for Jain families",
    subcategories: {
      "Property Type": {
        type: "select",
        options: ["2BHK (540 sqft)", "3BHK (720 sqft)"],
      },
      Facilities: {
        type: "checkbox",
        options: ["Furnished", "Electronics", "Utensils", "Ration/Kirana", "Other Amenities"],
      },
    },
  },
  Commercial: {
    description: "Business and commercial spaces",
    subcategories: {
      "Space Type": {
        type: "select",
        options: ["Shop (300 sqft)", "Office (500 sqft)", "Showroom (1000 sqft)"],
      },
    },
  },
  Education: {
    description: "Educational institutions and services",
    subcategories: {
      "Institution Type": {
        type: "select",
        options: ["University", "College", "School", "Training Center"],
      },
      "Special Services": {
        type: "checkbox",
        options: ["Paperless Admission", "Online Classes", "Hostel Facility", "Scholarship Available"],
      },
    },
  },
  Medical: {
    description: "Healthcare services and facilities",
    subcategories: {
      "Treatment Type": {
        type: "checkbox",
        options: ["Ayurvedic", "Homeopathic", "Allopathic", "Panchakarma", "Yoga"],
      },
    },
  },
  Social: {
    description: "Community and social services",
    subcategories: {
      "Facility Type": {
        type: "select",
        options: ["Animal Hospital", "Social Hall", "Community Center", "Event Space"],
      },
    },
  },
}

export function CategorySelector({ locationSelection, onCategoryChange }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
  const [categorySelections, setCategorySelections] = useState<Record<string, any>>({})

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category)
    // Reset selections when switching categories
    setCategorySelections({})
  }

  const handleSubcategoryChange = (subcategory: string, value: any) => {
    const newSelections = {
      ...categorySelections,
      [subcategory]: value,
    }
    setCategorySelections(newSelections)

    if (onCategoryChange && selectedCategory) {
      onCategoryChange(selectedCategory, subcategory, newSelections)
    }
  }

  const handleCheckboxChange = (subcategory: string, option: string, checked: boolean) => {
    const currentValues = categorySelections[subcategory] || []
    const newValues = checked ? [...currentValues, option] : currentValues.filter((v: string) => v !== option)

    handleSubcategoryChange(subcategory, newValues)
  }

  const isLocationSelected = locationSelection.state && locationSelection.city

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif font-bold">Service Categories</h3>
        <p className="text-muted-foreground">
          {isLocationSelected
            ? `Select a category to explore services in ${locationSelection.city}, ${locationSelection.state}`
            : "Please select your location first to view available services"}
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(Object.keys(categoryData) as ServiceCategory[]).map((category) => {
          const Icon = categoryIcons[category]
          const isSelected = selectedCategory === category
          const isDisabled = !isLocationSelected

          return (
            <Card
              key={category}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md hover:scale-105"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isDisabled && handleCategorySelect(category)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div
                  className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">{category}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{categoryData[category].description}</p>
                </div>
                {isSelected && (
                  <Badge variant="default" className="text-xs">
                    Selected
                  </Badge>
                )}
                {!isDisabled && !isSelected && <ChevronRight className="h-4 w-4 mx-auto text-muted-foreground" />}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Details */}
      {selectedCategory && isLocationSelected && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = categoryIcons[selectedCategory]
                return <Icon className="h-5 w-5" />
              })()}
              {selectedCategory} Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(categoryData[selectedCategory].subcategories).map(([subcategory, config]) => (
              <div key={subcategory} className="space-y-3">
                <h5 className="font-medium text-sm">{subcategory}</h5>

                {config.type === "select" && (
                  <Select
                    value={categorySelections[subcategory] || ""}
                    onValueChange={(value) => handleSubcategoryChange(subcategory, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Choose ${subcategory}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {config.type === "checkbox" && (
                  <div className="grid grid-cols-2 gap-3">
                    {config.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${subcategory}-${option}`}
                          checked={(categorySelections[subcategory] || []).includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange(subcategory, option, checked as boolean)}
                        />
                        <label
                          htmlFor={`${subcategory}-${option}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Selection Summary */}
            {Object.keys(categorySelections).length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h6 className="font-medium text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Your {selectedCategory} Selection
                </h6>
                {Object.entries(categorySelections).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{key}:</span>{" "}
                    {Array.isArray(value)
                      ? value.length > 0
                        ? value.join(", ")
                        : "None selected"
                      : value || "Not selected"}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1">Find {selectedCategory} Services</Button>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {!isLocationSelected && (
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Select your state and city above to explore available services in your area. Our services are tailored
              specifically for Jain communities across India.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
