"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Lock, Bell, FileText, Trash2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">System Settings</h2>
        <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Security Settings</CardTitle>
              <Lock className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Password Policy</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Minimum Password Length</span>
                  <Input type="number" defaultValue="8" className="w-20" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Require Uppercase Characters</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Require Special Characters</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Session Timeout (minutes)</span>
                  <Input type="number" defaultValue="30" className="w-20" />
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">Save Security Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-green-50 border-b border-yellow-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Notification Settings</CardTitle>
              <Bell className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Email Notifications</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Transaction Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Daily Reports</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">System Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Weekly Summary</span>
                  <Switch />
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800">Save Notification Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">API Configuration</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">API Keys</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-gray-700">Live API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" type="password" value="sk_live_****************************" readOnly className="flex-1" />
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-key" className="text-gray-700">Test API Key</Label>
                  <div className="flex gap-2">
                    <Input id="test-key" type="password" value="sk_test_****************************" readOnly className="flex-1" />
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">Regenerate API Keys</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Delete All Data</h3>
              <p className="text-sm text-red-700 mb-4">This action will permanently delete all data from the system. This cannot be undone.</p>
              <Button variant="destructive" className="w-full">Delete All Data</Button>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Reset System</h3>
              <p className="text-sm text-red-700 mb-4">This will reset all configurations to their default values.</p>
              <Button variant="destructive" className="w-full">Reset System</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
