'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddCompanyModal from './addCompanyModal'


export default function Companies() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for companies
  const [companies, setCompanies] = useState([])
  useEffect(() => {
    fetch('/api/companies')
      .then(response => response.json())
      .then(data => setCompanies(processCompanies(data)))
  }, [])

  const processCompanies = (data) => {
    if (!data || data.length === 0) {
      return []
    }
    return data.map((company) => {
      return {
        id: company.id,
        name: company.name,
        website: company.start_url,
        description: company.description
      }
    }
    )
  }
  // const companies = [
  //   { id: 1, name: 'TechCorp', website: 'https://techcorp.com', description: 'A leading tech company' },
  //   { id: 2, name: 'DataInc', website: 'https://datainc.com', description: 'Specializing in data analytics' },
  //   { id: 3, name: 'DesignHub', website: 'https://designhub.com', description: 'Creative design solutions' },
  // ]

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
          Add New Company</Button>
      </div>
      <Input
        type="text"
        placeholder="Search companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.map(company => (

          <Card className="flex flex-col sm:flex-row overflow-hidden" key={company.id}>
            <div className="w-full sm:w-1/3 p-4 flex items-center justify-center bg-muted">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTntP7y9PTP3jWbEGeA1pgrBAV3JAVrVyah5g&s"
                alt={`${company.name} logo`}
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="w-full sm:w-2/3 flex flex-col">
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Hello There</p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 mt-auto">
                <Button variant="default">Visit</Button>
                <Link href={`/companies/${company.id}`} className="block hover:underline">
                  <Button variant="outline">Details</Button>
                </Link>
                
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>

      <AddCompanyModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen} />
    </div>
  )
}

