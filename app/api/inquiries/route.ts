import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "state", "city", "category", "description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Insert inquiry into database
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        state: body.state,
        city: body.city,
        area: body.area || null,
        category: body.category,
        subcategory: body.subcategory || null,
        budget_range: body.budget_range || null,
        timeline: body.timeline || null,
        description: body.description,
        special_requirements: body.special_requirements || null,
        documents: body.documents || [],
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      inquiry: data,
      message: "Inquiry submitted successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters for filtering
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status)
    }
    if (category && category !== "all") {
      query = query.eq("category", category)
    }
    if (priority && priority !== "all") {
      query = query.eq("priority", priority)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
    }

    return NextResponse.json({
      inquiries: data,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
