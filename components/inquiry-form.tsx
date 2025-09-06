"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Phone, Mail, MapPin, User, Save, Send } from "lucide-react"
import type { LocationSelection } from "@/components/location-filter"
import type { ServiceCategory } from "@/components/category-selector"

interface InquiryFormProps {
  locationSelection: LocationSelection
  selectedCategory?: ServiceCategory
  onSubmit?: (formData: any) => void
}

interface FormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  alternatePhone: string

  // Location
  address: string
  pincode: string

  // Service Details
  category: ServiceCategory | ""
  subcategory: string
  requirements: string
  budget: string
  timeline: string

  // Additional Information
  familySize: string
  specialRequirements: string
  documents: File[]

  // Preferences
  contactPreference: string[]
  visitPreference: string
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  address: "",
  pincode: "",
  category: "",
  subcategory: "",
  requirements: "",
  budget: "",
  timeline: "",
  familySize: "",
  specialRequirements: "",
  documents: [],
  contactPreference: [],
  visitPreference: "",
}

export function InquiryForm({ locationSelection, selectedCategory, onSubmit }: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedProgress, setSavedProgress] = useState(false)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  // Load saved form data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mokshamaa-inquiry-form")
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setFormData(parsedData)
        setSavedProgress(true)
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }, [])

  // Auto-save form data
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("mokshamaa-inquiry-form", JSON.stringify(formData))
    }, 1000)

    return () => clearTimeout(timer)
  }, [formData])

  // Pre-fill location and category if provided
  useEffect(() => {
    if (selectedCategory && formData.category !== selectedCategory) {
      setFormData((prev) => ({ ...prev, category: selectedCategory }))
    }
  }, [selectedCategory, formData.category])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setFormData((prev) => ({ ...prev, documents: [...prev.documents, ...fileArray] }))
    }
  }

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const submissionData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: locationSelection.state,
        city: locationSelection.city,
        area: locationSelection.areas.join(", ") || null,
        category: formData.category,
        subcategory: formData.subcategory || null,
        budget_range: formData.budget || null,
        timeline: formData.timeline || null,
        description: formData.requirements,
        special_requirements: formData.specialRequirements || null,
        documents: [], // TODO: Implement file upload to storage
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit inquiry")
      }

      localStorage.removeItem("mokshamaa-inquiry-form")

      setFormData(initialFormData)
      setCurrentStep(1)

      alert(
        `Inquiry submitted successfully! Your inquiry ID is ${result.inquiry.id}. We will contact you within 24 hours.`,
      )

      if (onSubmit) {
        onSubmit(result.inquiry)
      }
    } catch (error) {
      console.error("Submission error:", error)
      alert(`Error submitting inquiry: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone
      case 2:
        return formData.address && formData.pincode && locationSelection.state && locationSelection.city
      case 3:
        return formData.category && formData.requirements
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Service Inquiry Form
          </CardTitle>
          {savedProgress && (
            <Badge variant="secondary" className="text-xs">
              <Save className="h-3 w-3 mr-1" />
              Progress Saved
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => updateFormData("alternatePhone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="House/Flat No., Street, Locality"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={locationSelection.state || "Not selected"} disabled />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={locationSelection.city || "Not selected"} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateFormData("pincode", e.target.value)}
                    placeholder="400001"
                  />
                </div>
              </div>

              {locationSelection.areas.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Areas</Label>
                  <div className="flex flex-wrap gap-2">
                    {locationSelection.areas.map((area) => (
                      <Badge key={area} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Service Requirements */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Religious">Religious</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5-lakh">Under ₹5 Lakh</SelectItem>
                    <SelectItem value="5-10-lakh">₹5-10 Lakh</SelectItem>
                    <SelectItem value="10-25-lakh">₹10-25 Lakh</SelectItem>
                    <SelectItem value="25-50-lakh">₹25-50 Lakh</SelectItem>
                    <SelectItem value="50-lakh-plus">₹50 Lakh+</SelectItem>
                    <SelectItem value="discuss">Prefer to Discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => updateFormData("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (Within 1 month)</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="6-months">Within 6 months</SelectItem>
                    <SelectItem value="1-year">Within 1 year</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familySize">Family Size</Label>
                <Select value={formData.familySize} onValueChange={(value) => updateFormData("familySize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Number of family members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 members</SelectItem>
                    <SelectItem value="3-4">3-4 members</SelectItem>
                    <SelectItem value="5-6">5-6 members</SelectItem>
                    <SelectItem value="7-plus">7+ members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Detailed Requirements *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => updateFormData("requirements", e.target.value)}
                placeholder="Please describe your specific requirements, preferences, and any special needs..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => updateFormData("specialRequirements", e.target.value)}
                placeholder="Any specific Jain requirements, accessibility needs, or other special considerations..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 4: Documents & Preferences */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Documents & Contact Preferences</h3>

            {/* Document Upload */}
            <div className="space-y-4">
              <Label>Supporting Documents (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload any relevant documents (ID proof, income certificate, etc.)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                  Choose Files
                </Button>
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Preferences */}
            <div className="space-y-4">
              <Label>Preferred Contact Methods</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "phone", label: "Phone Call", icon: Phone },
                  { id: "email", label: "Email", icon: Mail },
                  { id: "whatsapp", label: "WhatsApp", icon: Phone },
                  { id: "visit", label: "Site Visit", icon: MapPin },
                ].map(({ id, label, icon: Icon }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={formData.contactPreference.includes(id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("contactPreference", [...formData.contactPreference, id])
                        } else {
                          updateFormData(
                            "contactPreference",
                            formData.contactPreference.filter((p) => p !== id),
                          )
                        }
                      }}
                    />
                    <label htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Icon className="h-4 w-4" />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitPreference">Best Time for Site Visit</Label>
              <Select
                value={formData.visitPreference}
                onValueChange={(value) => updateFormData("visitPreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                  <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                  <SelectItem value="weekend">Weekends Only</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Inquiry
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
