import { NextResponse } from "next/server"

export async function GET() {
  console.log("Fetching Alloy parameters...")

  const token = process.env.ALLOY_API_TOKEN
  const secret = process.env.ALLOY_API_SECRET

  if (!token || !secret) {
    console.log("Missing API credentials")
    return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
  }

  try {
    const credentials = Buffer.from(`${token}:${secret}`).toString("base64")

    const response = await fetch("https://sandbox.alloy.co/v1/parameters/", {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.log("Parameters API error:", response.status, response.statusText)
      throw new Error(`Parameters API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Parameters fetched successfully:", Object.keys(data).length, "parameters")

    return NextResponse.json(data)
  } catch (error) {
    console.log("Error fetching parameters:", error)
    return NextResponse.json({ error: "Failed to fetch parameters" }, { status: 500 })
  }
}
