import { useState } from 'react'
import { Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function DialingPad() {
  const [number, setNumber] = useState('')

  const handleNumberClick = (digit: string) => {
    setNumber(prev => prev + digit)
  }

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1))
  }

  const handleCall = () => {
    console.log('Calling:', number)
    // Implement call functionality here
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="mb-4 p-2 bg-white rounded-md shadow text-center">
        <span className="text-2xl font-bold text-[#038E7D]">{number || 'Enter number'}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
          <Button
            key={digit}
            onClick={() => handleNumberClick(digit.toString())}
            className="bg-[#F0FFF9] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
          >
            {digit}
          </Button>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <Button onClick={handleDelete} className="bg-[#F0FFF9] text-[#038E7D] hover:bg-[#038E7D] hover:text-white">
          Delete
        </Button>
        <Button onClick={handleCall} className="bg-[#038E7D] text-white hover:bg-[#025E52]">
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
      </div>
    </div>
  )
}
