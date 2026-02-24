import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const settings = [
  { name: "Email Notifications", description: "Receive email updates about your account" },
  { name: "SMS Notifications", description: "Receive SMS alerts for important updates" },
  { name: "Two-Factor Authentication", description: "Add an extra layer of security to your account" },
]

export default function SettingsPage() {
  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Settings</h1>
        <Card className="max-w-md mx-auto border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-[#038E7D]">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`setting-${index}`} className="text-[#038E7D] font-medium">
                    {setting.name}
                  </Label>
                  <p className="text-sm text-[#025E52]">{setting.description}</p>
                </div>
                <Switch id={`setting-${index}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
