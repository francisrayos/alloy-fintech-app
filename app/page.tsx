"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Shield, Users, TrendingUp, Clock } from "lucide-react"
import Image from "next/image"

interface ParameterField {
  name: string
  type: string
  required: boolean
  description?: string
  validation?: {
    pattern?: string
    min_length?: number
    max_length?: number
  }
}

interface Parameters {
  [key: string]: ParameterField
}

interface FormData {
  [key: string]: string
}

interface ApiResponse {
  summary: {
    outcome: string
    outcome_reasons: string[]
  }
  application_token: string
}

const FALLBACK_FIELDS: Parameters = {
  name_first: {
    name: "name_first",
    type: "string",
    required: false,
    description: "First Name",
    validation: { min_length: 1, max_length: 50 },
  },
  name_last: {
    name: "name_last",
    type: "string",
    required: false,
    description: "Last Name",
    validation: { min_length: 1, max_length: 50 },
  },
  document_ssn: {
    name: "document_ssn",
    type: "string",
    required: false,
    description: "Social Security Number",
    validation: { min_length: 9, max_length: 9, pattern: "^[0-9]{9}$" },
  },
  birth_date: {
    name: "birth_date",
    type: "string",
    required: false,
    description: "Date of Birth",
    validation: { pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
  },
  address_line_1: {
    name: "address_line_1",
    type: "string",
    required: false,
    description: "Address Line 1",
    validation: { min_length: 1, max_length: 100 },
  },
  address_line_2: {
    name: "address_line_2",
    type: "string",
    required: false,
    description: "Address Line 2",
    validation: { min_length: 0, max_length: 100 },
  },
  address_city: {
    name: "address_city",
    type: "string",
    required: false,
    description: "City",
    validation: { min_length: 1, max_length: 50 },
  },
  address_state: {
    name: "address_state",
    type: "string",
    required: false,
    description: "State",
    validation: { min_length: 2, max_length: 2 },
  },
  address_postal_code: {
    name: "address_postal_code",
    type: "string",
    required: false,
    description: "ZIP Code",
    validation: { min_length: 5, max_length: 10 },
  },
  address_country_code: {
    name: "address_country_code",
    type: "string",
    required: false,
    description: "Country",
    validation: { min_length: 2, max_length: 2 },
  },
  email_address: {
    name: "email_address",
    type: "string",
    required: false,
    description: "Email Address",
    validation: { pattern: "^[^@]+@[^@]+\\.[^@]+$" },
  },
}

export default function HomePage() {
  const [parameters, setParameters] = useState<Parameters>(FALLBACK_FIELDS) // Initialize with fallback fields
  const [formData, setFormData] = useState<FormData>({})
  const [isLoadingParameters, setIsLoadingParameters] = useState(true)
  const [parametersError, setParametersError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch("/api/parameters")
        if (!response.ok) {
          throw new Error("Failed to fetch parameters")
        }
        const params: Parameters = await response.json()

        if (Object.keys(params).length > 0 && Object.values(params).some((field) => field.description)) {
          setParameters(params)
        } else {
          console.log("Using fallback fields due to insufficient parameter data")
          setParameters(FALLBACK_FIELDS)
        }

        // Initialize form data with empty values for all parameters
        const initialFormData: FormData = {}
        const fieldsToUse = Object.keys(params).length > 0 ? params : FALLBACK_FIELDS
        Object.keys(fieldsToUse).forEach((key) => {
          initialFormData[key] = ""
        })
        // Set default country to US if address_country exists
        if (fieldsToUse.address_country_code || fieldsToUse.address_country) {
          initialFormData.address_country_code = "US"
          initialFormData.address_country = "US"
        }
        setFormData(initialFormData)
      } catch (err) {
        console.log("Parameters API failed, using fallback fields:", err)
        setParameters(FALLBACK_FIELDS)
        const initialFormData: FormData = {}
        Object.keys(FALLBACK_FIELDS).forEach((key) => {
          initialFormData[key] = ""
        })
        initialFormData.address_country_code = "US"
        setFormData(initialFormData)
      } finally {
        setIsLoadingParameters(false)
      }
    }

    fetchParameters()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): string | null => {
    for (const [fieldName, fieldConfig] of Object.entries(parameters)) {
      const value = formData[fieldName] || ""

      // Check date format for birth_date or date fields
      if ((fieldName.includes("birth_date") || fieldName.includes("date")) && value) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        if (!datePattern.test(value)) {
          return "DOB format must be YYYY-MM-DD"
        }
      }
    }

    return null
  }

  const renderFormField = (fieldName: string, fieldConfig: ParameterField) => {
    const value = formData[fieldName] || ""
    const isRequired = fieldConfig.required
    const label = fieldConfig.description || fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

    let inputType = "text"
    let placeholder = `Enter ${label.toLowerCase()}`
    let maxLength: number | undefined

    // Determine input type and constraints based on field name and config
    if (fieldName.includes("email")) {
      inputType = "email"
      placeholder = "your.email@example.com"
    } else if (fieldName.includes("birth_date") || fieldName.includes("date")) {
      inputType = "text"
      placeholder = "YYYY-MM-DD"
    } else if (fieldName.includes("ssn")) {
      placeholder = "123456789 (9 digits, no dashes)"
      maxLength = 9
    } else if (fieldName.includes("state") && fieldConfig.validation?.max_length === 2) {
      placeholder = "NY"
      maxLength = 2
    } else if (fieldName.includes("country")) {
      placeholder = "US"
      maxLength = 2
    }

    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName} className="text-gray-700 font-medium">
          {label}
        </Label>
        <Input
          id={fieldName}
          type={inputType}
          value={value}
          onChange={(e) => {
            let newValue = e.target.value
            // Special handling for SSN - remove non-digits
            if (fieldName.includes("ssn")) {
              newValue = newValue.replace(/\D/g, "")
            }
            // Special handling for state/country - uppercase
            if (fieldName.includes("state") || fieldName.includes("country")) {
              newValue = newValue.toUpperCase()
            }
            handleInputChange(fieldName, newValue)
          }}
          placeholder={placeholder}
          maxLength={maxLength}
          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          required={false}
        />
      </div>
    )
  }

  const groupFields = () => {
    const nameFields = Object.entries(parameters).filter(([name]) => name.includes("name"))
    const addressFields = Object.entries(parameters).filter(([name]) => name.includes("address"))
    const personalFields = Object.entries(parameters).filter(
      ([name]) => !name.includes("name") && !name.includes("address"),
    )

    return { nameFields, addressFields, personalFields }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)
    setResponse(null)

    try {
      const apiResponse = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!apiResponse.ok) {
        throw new Error("Failed to submit application")
      }

      const result: ApiResponse = await apiResponse.json()

      console.log("Frontend received outcome:", result.summary?.outcome)
      if (result.summary?.outcome === "Deny") {
        console.log("DENY OUTCOME RECEIVED: Should show deny message")
      }

      setResponse(result)
    } catch (err) {
      setError("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderOutcomeScreen = (outcome: string, applicationToken: string) => {
    const normalizedOutcome = outcome?.toLowerCase()

    switch (normalizedOutcome) {
      case "approved":
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-green-700 mb-4">Success!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Congratulations! You have successfully created an account with our service.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Application Token:</strong> {applicationToken}
              </p>
            </div>
            <Button onClick={() => setResponse(null)} className="bg-green-600 hover:bg-green-700">
              Submit Another Application
            </Button>
          </div>
        )

      case "manual review":
        return (
          <div className="text-center py-8">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-yellow-700 mb-4">Under Review</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Thanks for submitting your application! We'll be in touch shortly with next steps.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Application Token:</strong> {applicationToken}
              </p>
              <p className="text-sm text-yellow-800 mt-2">
                Please save this token for your records. Our team will contact you within 1-2 business days.
              </p>
            </div>
            <Button onClick={() => setResponse(null)} variant="outline">
              Submit Another Application
            </Button>
          </div>
        )

      case "deny":
      case "denied":
        return (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-red-700 mb-4">Application Not Approved</h2>
            <p className="text-lg text-muted-foreground mb-6">Sorry, your application was not successful.</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Application Token:</strong> {applicationToken}
              </p>
              <p className="text-sm text-red-800 mt-2">
                If you believe this decision was made in error, please contact our support team.
              </p>
            </div>
            <Button onClick={() => setResponse(null)} variant="outline">
              Try Again
            </Button>
          </div>
        )

      default:
        console.log("Unknown outcome received:", outcome)
        return (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground mb-6">Application processed. Outcome: {outcome}</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-800">
                <strong>Application Token:</strong> {applicationToken}
              </p>
            </div>
            <Button onClick={() => setResponse(null)} variant="outline">
              Submit Another Application
            </Button>
          </div>
        )
    }
  }

  if (isLoadingParameters) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    )
  }

  const { nameFields, addressFields, personalFields } = groupFields()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-600 to-coral-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/alloy-logo.png"
              alt="Alloy"
              width={600}
              height={180}
              className="h-36 w-auto filter brightness-0 invert"
            />
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
            Experience fast, secure identity verification powered by Alloy's advanced fraud prevention technology
          </p>
          <div className="flex justify-center space-x-8 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-white" />
              <span>Trusted by 700+ institutions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-white" />
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-white" />
              <span>Real-time decisions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form or Result Screen */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-xl border-0 overflow-hidden">
            {response ? (
              <CardContent className="pt-6">
                {renderOutcomeScreen(response.summary.outcome, response.application_token)}
              </CardContent>
            ) : (
              <>
                <CardHeader className="bg-gray-50 text-gray-900 border-b">
                  <CardTitle className="text-2xl font-serif text-gray-900 font-bold">Financial Application</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Please provide your information for identity verification and fraud prevention screening
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {nameFields.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nameFields.map(([fieldName, fieldConfig]) => renderFormField(fieldName, fieldConfig))}
                      </div>
                    )}

                    {addressFields.length > 0 && (
                      <div className="space-y-4">
                        {addressFields.map(([fieldName, fieldConfig]) => {
                          // Special layout for city, state, zip
                          if (
                            fieldName.includes("city") ||
                            fieldName.includes("state") ||
                            fieldName.includes("postal")
                          ) {
                            return null // Handle these in a group below
                          }
                          return renderFormField(fieldName, fieldConfig)
                        })}

                        {/* City, State, Zip in a row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {addressFields
                            .filter(
                              ([name]) => name.includes("city") || name.includes("state") || name.includes("postal"),
                            )
                            .map(([fieldName, fieldConfig]) => renderFormField(fieldName, fieldConfig))}
                        </div>
                      </div>
                    )}

                    {personalFields.length > 0 && (
                      <div className="space-y-4">
                        {personalFields.map(([fieldName, fieldConfig]) => renderFormField(fieldName, fieldConfig))}
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing Application..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}
