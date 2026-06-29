export default function DashboardFooter() {
  return (
    <footer className="mt-auto px-4 py-4 md:py-4 md:px-8 border-t border-gray-100 text-xs sm:text-sm text-gray-500 text-center bg-white pb-24 md:pb-4">
      © {new Date().getFullYear()} School Portal • All rights reserved
    </footer>
  )
}