import { type NextRequest, NextResponse } from "next/server"

interface AlloyApiRequest {
  [key: string]: string | undefined
}

export async function POST(request: NextRequest) {
  try {
    const body: AlloyApiRequest = await request.json()

    console.log("Application received with fields:", Object.keys(body))
    if (body.name_first && body.name_last) {
      console.log("Applicant:", body.name_first, body.name_last)
    }
    if (body.email_address) {
      console.log("Email:", body.email_address)
    }
    if (body.address_line_1 && body.address_city && body.address_state) {
      console.log("Address:", body.address_line_1, body.address_city, body.address_state)
    }
    if (body.birth_date) {
      console.log("Birth Date:", body.birth_date)
    }
    if (body.document_ssn) {
      console.log("SSN provided: Yes")
    }

    const ALLOY_API_TOKEN = process.env.ALLOY_API_TOKEN
    const ALLOY_API_SECRET = process.env.ALLOY_API_SECRET

    if (!ALLOY_API_TOKEN || !ALLOY_API_SECRET) {
      console.error("Missing Alloy API credentials")
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    console.log("Submitting to Alloy API with credentials configured")
    console.log("Full request payload:", JSON.stringify(body, null, 2))

    const response = await fetch("https://sandbox.alloy.co/v1/evaluations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${ALLOY_API_TOKEN}:${ALLOY_API_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error("Alloy API error:", response.status, response.statusText)
      return NextResponse.json({ error: "Failed to process application" }, { status: response.status })
    }

    const alloyResponse = await response.json()

    console.log("Alloy API response received")
    console.log("Application Token:", alloyResponse.application_token)
    console.log("Evaluation Token:", alloyResponse.evaluation_token)
    console.log("Summary Outcome:", alloyResponse.summary?.outcome)
    console.log("Summary Outcome Reasons:", alloyResponse.summary?.outcome_reasons)

    if (body.name_last === "Deny") {
      console.log("SANDBOX PERSONA DETECTED: Using 'Deny' last name - should trigger deny outcome")
    }
    if (alloyResponse.summary?.outcome === "Deny") {
      console.log("DENY OUTCOME CONFIRMED: Application was denied")
    }

    return NextResponse.json(alloyResponse)
  } catch (error) {
    console.error("Error submitting to Alloy API:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
