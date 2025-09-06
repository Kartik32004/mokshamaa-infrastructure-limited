"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  Search,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  state: string
  city: string
  area?: string
  category: string
  subcategory?: string
  budget_range?: string
  timeline?: string
  description: string
  special_requirements?: string
  status: "new" | "contacted" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  assigned_to?: string
  admin_notes?: string
  documents: any[]
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchInquiries = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (priorityFilter !== "all") params.append("priority", priorityFilter)

      const response = await fetch(`/api/inquiries?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch inquiries")
      }

      setInquiries(data.inquiries || [])
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      setError(error instanceof Error ? error.message : "Failed to load inquiries")
    } finally {
      setIsLoading(false)
    }
  }

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    try {
      setIsUpdating(true)

      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update inquiry")
      }

      // Update local state
      setInquiries((prev) => prev.map((inquiry) => (inquiry.id === id ? { ...inquiry, ...data.inquiry } : inquiry)))

      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, ...data.inquiry })
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
      alert(`Error updating inquiry: ${error instanceof Error ? error.message : "Please try again"}`)
    } finally {
      setIsUpdating(false)
    }
  }

  // Load inquiries on component mount and filter changes
  useEffect(() => {
    fetchInquiries()
  }, [statusFilter, categoryFilter, priorityFilter])

  // Filter inquiries based on search term
  useEffect(() => {
    let filtered = inquiries

    if (searchTerm) {
      filtered = filtered.filter(
        (inquiry) =>
          inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.phone.includes(searchTerm) ||
          inquiry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.state.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredInquiries(filtered)
  }, [inquiries, searchTerm])

  const updateInquiryStatus = (id: string, newStatus: Inquiry["status"]) => {
    updateInquiry(id, { status: newStatus })
  }

  const updateInquiryPriority = (id: string, newPriority: Inquiry["priority"]) => {
    updateInquiry(id, { priority: newPriority })
  }

  const updateAdminNotes = (id: string, notes: string) => {
    updateInquiry(id, { admin_notes: notes })
  }

  const getStatusColor = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "contacted":
        return "bg-yellow-500"
      case "in_progress":
        return "bg-orange-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "default"
      case "contacted":
        return "secondary"
      case "in_progress":
        return "outline"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: Inquiry["priority"]) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    inProgress: inquiries.filter((i) => i.status === "in_progress").length,
    completed: inquiries.filter((i) => i.status === "completed").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading inquiries...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchInquiries}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Mokshamaa Infrastructure - Service Inquiries</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchInquiries} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Inquiries</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Religious">Religious</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List View */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inquiries ({filteredInquiries.length})</h3>
            {filteredInquiries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inquiries found</p>
                </CardContent>
              </Card>
            ) : (
              filteredInquiries.map((inquiry) => (
                <Card
                  key={inquiry.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedInquiry?.id === inquiry.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{inquiry.name}</h4>
                        <p className="text-sm text-muted-foreground">{inquiry.id}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                        <span className={`text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {inquiry.category}
                        </Badge>
                        <span className="text-muted-foreground">
                          {inquiry.city}, {inquiry.state}
                        </span>
                      </div>

                      <p className="text-muted-foreground line-clamp-2">{inquiry.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Detail View */}
          <div>
            {selectedInquiry ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Inquiry Details</span>
                    <div className="flex gap-2">
                      <Select
                        value={selectedInquiry.priority}
                        onValueChange={(value) =>
                          updateInquiryPriority(selectedInquiry.id, value as Inquiry["priority"])
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={selectedInquiry.status}
                        onValueChange={(value) => updateInquiryStatus(selectedInquiry.id, value as Inquiry["status"])}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedInquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedInquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedInquiry.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="font-semibold mb-3">Location</h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p>
                          {selectedInquiry.city}, {selectedInquiry.state}
                        </p>
                        {selectedInquiry.area && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {selectedInquiry.area}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h4 className="font-semibold mb-3">Service Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="secondary">{selectedInquiry.category}</Badge>
                      </div>
                      {selectedInquiry.subcategory && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subcategory:</span>
                          <span>{selectedInquiry.subcategory}</span>
                        </div>
                      )}
                      {selectedInquiry.budget_range && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span>{selectedInquiry.budget_range}</span>
                        </div>
                      )}
                      {selectedInquiry.timeline && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timeline:</span>
                          <span>{selectedInquiry.timeline}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold mb-3">Requirements</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedInquiry.description}</p>
                    {selectedInquiry.special_requirements && (
                      <div className="mt-3">
                        <h5 className="font-medium mb-2">Special Requirements:</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedInquiry.special_requirements}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <Label htmlFor="admin-notes" className="font-semibold">
                      Admin Notes
                    </Label>
                    <Textarea
                      id="admin-notes"
                      value={selectedInquiry.admin_notes || ""}
                      onChange={(e) => setSelectedInquiry({ ...selectedInquiry, admin_notes: e.target.value })}
                      placeholder="Add internal notes about this inquiry..."
                      className="mt-2"
                      rows={3}
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => updateAdminNotes(selectedInquiry.id, selectedInquiry.admin_notes || "")}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>

                  {/* Documents */}
                  {selectedInquiry.documents && selectedInquiry.documents.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Documents</h4>
                      <div className="space-y-2">
                        {selectedInquiry.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{doc}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1" onClick={() => window.open(`tel:${selectedInquiry.phone}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => window.open(`mailto:${selectedInquiry.email}`)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an inquiry to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
