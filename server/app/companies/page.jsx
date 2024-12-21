'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddCompanyModal from './addCompanyModal'
import { set } from "date-fns"


export default function Companies() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for companies
  const [companies, setCompanies] = useState([])
  useEffect(() => {
    fetch('/api/companies')
      .then(response => response.json())
      .then(data => setCompanies(processCompanies(data)) )
  }, [])

  const processCompanies = (data) => {
    if( !data || data.length === 0 ) {
      return []
    }
    return data.map( (company) => {
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
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Company</Button>
      </div>
      <Input
        type="text"
        placeholder="Search companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-4">
        {filteredCompanies.map(company => (
          <Card key={company.id}>
            <CardContent className="p-6">
              <Link href={`/companies/${company.id}`} className="block hover:underline">
                <CardTitle className="text-xl mb-2">{company.name}</CardTitle>
              </Link>
              <p className="text-blue-600 dark:text-blue-400">{company.website}</p>
              <p className="text-muted-foreground mt-2">{company.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddCompanyModal 
        isAddModalOpen={isAddModalOpen} 
        setIsAddModalOpen={setIsAddModalOpen} />
    </div>
  )
}

