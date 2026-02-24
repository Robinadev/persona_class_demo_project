import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-primary">Your Profile</h1>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Manage your account information and preferences
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-primary">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" defaultValue="USR12345" className="border-[#038E7D]/20 bg-gray-100" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 XXXXXXXXXX" className="border-primary/10" />
              </div>
              <Button className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white" size="lg">
                Update Information
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
