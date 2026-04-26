"use client"
import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

export default function InterviewScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true)
      setSelectedSlot(null)
      fetch(`/api/admissions/available-slots?date=${selectedDate.toISOString()}`)
        .then(res => res.json())
        .then(data => {
          if (data.availableSlots) {
            setAvailableSlots(data.availableSlots)
          }
        })
        .finally(() => setLoadingSlots(false))
    }
  }, [selectedDate])

  const handleBookSlot = async () => {
    if (!selectedSlot) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/admissions/request-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewDate: selectedSlot })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        alert(data.error || "Failed to book slot")
      }
    } catch(err) {
      console.error(err)
      alert("Error booking slot")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-8 bg-linear-to-br from-green-50 to-green-100 rounded-xl border border-green-200 mt-8 shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200 shadow-inner">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="text-green-800 font-bold text-2xl mb-2 tracking-tight">Request Sent Successfully!</h3>
        <p className="text-green-700 max-w-md mx-auto leading-relaxed">
          Your interview at <strong className="text-green-900">{format(new Date(selectedSlot!), "PPP 'at' p")}</strong> has been requested. We will review it and notify you via email shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col md:flex-row gap-10 mt-8 max-w-5xl mx-auto">
       <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-amber-600">1.</span> Select a Date
          </h3>
          <div className="p-4 bg-black rounded-xl border border-gray-100 flex justify-center shadow-inner">
            <DayPicker 
              mode="single" 
              selected={selectedDate} 
              onSelect={setSelectedDate}
              disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]} 
              modifiersClassNames={{
                selected: 'bg-amber-600 hover:bg-amber-700 text-white rounded-lg',
                today: 'font-bold text-amber-700'
              }}
              styles={{
                day: { margin: '2px', borderRadius: '8px' }
              }}
            />
          </div>
       </div>

       <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-amber-600">2.</span> Available Times
          </h3>
          
          <div className="flex-1 bg-black rounded-xl border border-gray-100 p-6 shadow-inner">
            {!selectedDate ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Please select a date from the calendar first.</p>
              </div>
            ) : loadingSlots ? (
              <div className="h-full flex items-center justify-center text-amber-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No available slots on this date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 border \${
                      selectedSlot === slot 
                        ? 'bg-amber-600  border-amber-600 shadow-md transform scale-[1.02]' 
                        : 'bg-white text-gray-700 hover:border-amber-400 hover:text-amber-700 hover:shadow shadow-sm'
                    }`}
                  >
                    {format(new Date(slot), 'h:mm a')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`mt-6 pt-6 border-t border-gray-100 transition-all duration-300 \${selectedSlot ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            {selectedSlot && (
              <>
                <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-100">
                  <p className="text-amber-800 text-sm">
                    You have selected <strong>{format(new Date(selectedSlot), "PPp")}</strong>.
                  </p>
                </div>
                <button 
                  onClick={handleBookSlot}
                  disabled={submitting}
                  className="w-full bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                       Processing...
                    </span>
                  ) : 'Confirm Interview Request'}
                </button>
              </>
            )}
          </div>
       </div>
    </div>
  )
}
  
