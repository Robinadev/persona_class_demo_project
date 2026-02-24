'use client'

import { useEffect, useState } from 'react'
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserProfile } from '@/lib/hooks/useUserProfile'
import { updateProfile } from '@/lib/api-services'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { profile, isLoading, mutate } = useUserProfile()
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    avatar_url: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  // Sync form data with profile data when it loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        avatar_url: profile.avatar_url || '',
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const result = await updateProfile(formData)
      if (result.success) {
        toast.success('Profile updated successfully')
        mutate()
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-12">
          <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-primary">Your Profile</h1>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Manage your account information and preferences
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
              <CardTitle className="text-primary">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading profile...</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="+251 XXXXXXXXX"
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="border-primary/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
                    size="lg"
                  >
                    {isSaving ? 'Saving...' : 'Update Profile'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
