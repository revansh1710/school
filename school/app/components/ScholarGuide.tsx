"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type GuideConfig = {
  selector: string
  message: string
}

const routeConfigs: Record<string, GuideConfig[]> = {
  "/admissions": [
    { selector: ".adm-hero", message: "Hi! Welcome to Admissions! Our journey together starts here." },
    { selector: ".adm-overview", message: "Here's a quick overview of our campus and student life." },
    { selector: ".adm-eligibility-grid", message: "Wondering if you qualify? Check our eligibility requirements here." },
    { selector: ".adm-process-steps", message: "These are the steps for our admission process. It's simple!" },
    { selector: ".adm-docs-grid", message: "Don't forget your documents! Keep this checklist handy." },
    { selector: ".adm-cta", message: "Ready to take the next step?" },
    { selector: ".enq-wrap", message: "Got questions? Fill out this enquiry form and we'll be in touch." }
  ],
  "/dashboard": [
    { selector: "button", message: "Click the letter to view your latest admission status!" }
  ],
  "/dashboard/documents":[
    { selector: "button", message: "Hello! This is where you can upload the documents for admissions.The documents required are curated according to the grade you have selected during the enquiry" }
  ],
  "/": [
    { selector: "[id='about']", message: "Learn about our vision and mission!" },
    { selector: ".principal-layout", message: "Here is a message from our beloved principal." },
    { selector: "[id='academics']", message: "Discover our academic excellence and grading systems." },
    { selector: "[id='contact']", message: "Have questions? Feel free to reach out to us here." }
  ],
  "/gallery": [
    { selector: ".g-header", message: "Welcome to our gallery! Look at these amazing moments captured over the years." },
    { selector: ".g-grid", message: "Click any picture to see it in full size." }
  ],
  "/credits": [
    { selector: "h1", message: "Here's to the incredible creators who made this possible." },
    { selector: "h2", message: "These are the resources we used. We're very thankful!" }
  ]
}

export default function ScholarGuide() {
  const pathname = usePathname()
  const [currentMessage, setCurrentMessage] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isBubbleOpen, setIsBubbleOpen] = useState(true)
  
  useEffect(() => {
    // Only show guide on configured routes
    const config = routeConfigs[pathname]
    if (!config || config.length === 0) {
      setIsVisible(false)
      setCurrentMessage("")
      return
    }

    setIsVisible(true)
    
    // Set initial message
    setCurrentMessage("I'm your Scholar Guide. Let's look around!")

    const observer = new IntersectionObserver((entries) => {
      // Find the most visible intersecting element
      const visibleEntries = entries.filter((e) => e.isIntersecting)
      if (visibleEntries.length > 0) {
        // Sort by how much is visible
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const targetElement = visibleEntries[0].target
        
        // Find matching message
        const matchedStep = config.find(c => targetElement.matches(c.selector) || targetElement.closest(c.selector))
        if (matchedStep) {
          setCurrentMessage(matchedStep.message)
        }
      }
    }, {
      root: null,
      threshold: 0.3 // Trigger when 30% visible
    })

    // Small delay to allow DOM to render
    const timeout = setTimeout(() => {
      config.forEach((step) => {
        const elements = document.querySelectorAll(step.selector)
        elements.forEach((el) => observer.observe(el))
      })
    }, 500)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [pathname])

  if (!isVisible) return null

  return (
    <>
      <style>{`
        .guide-container {
          position: fixed;
          bottom: 2.5rem;
          right: 2.5rem;
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          gap: 1.25rem;
          pointer-events: none;
        }

        .guide-bubble {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          color: #1a1a18;
          padding: 1.25rem 1.5rem;
          border-radius: 16px 16px 0px 16px;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -8px rgba(0, 0, 0, 0.1);
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          max-width: 280px;
          line-height: 1.5;
          animation: popBubble 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          border: 1px solid rgba(184, 151, 90, 0.3);
          pointer-events: auto;
          position: relative;
          transform-origin: bottom right;
        }

        .guide-bubble::after {
          content: '';
          position: absolute;
          bottom: -1px;
          right: -12px;
          border-width: 12px 12px 0 0;
          border-style: solid;
          border-color: rgba(255, 255, 255, 0.95) transparent transparent transparent;
          filter: drop-shadow(0 4px 3px rgba(0,0,0,0.05));
        }

        .guide-avatar {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #fceda1 0%, #d4a017 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          box-shadow: 0 8px 25px rgba(212, 160, 23, 0.4);
          border: 4px solid white;
          animation: bounceFloat 3.5s ease-in-out infinite;
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .guide-avatar:hover {
          transform: scale(1.15) rotate(8deg);
          animation-play-state: paused;
        }

        @keyframes popBubble {
          0% { opacity: 0; transform: scale(0.6) translateY(20px); filter: blur(4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }

        @keyframes bounceFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
        }
        
        /* Entrance animation */
        .guide-entrance {
          animation: slideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        @keyframes slideInRight {
          0% { transform: translateX(150px) rotate(10deg); opacity: 0; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        
        @media (max-width: 640px) {
            .guide-container {
                bottom: 1.5rem;
                right: 1.5rem;
                flex-direction: column;
                align-items: flex-end;
            }
            .guide-bubble {
                border-radius: 14px 14px 0px 14px;
                margin-bottom: 5px;
            }
            .guide-avatar {
                width: 60px;
                height: 60px;
                font-size: 2rem;
            }
        }
      `}</style>
      
      <div className="guide-container guide-entrance">
        {currentMessage && isBubbleOpen && (
          <div key={currentMessage} className="guide-bubble" onClick={() => setIsBubbleOpen(false)}>
            {currentMessage}
          </div>
        )}
        <div 
          className="guide-avatar" 
          aria-label="Scholar Guide Mascot"
          onClick={() => setIsBubbleOpen(!isBubbleOpen)}
        >
          🦄
        </div>
      </div>
    </>
  )
}
