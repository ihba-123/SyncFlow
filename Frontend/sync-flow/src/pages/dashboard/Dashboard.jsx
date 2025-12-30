import { Plus, FolderOpen, Clock, TrendingUp, Globe, Smartphone, Check, MessageSquare } from "lucide-react"
import {  useNavigate } from "react-router-dom"


export default function Dashboard() {
const navigate = useNavigate();
const handleClick = () => {
  setTimeout(() => {
    navigate("/dashboard/create-project");
  }, 500);
}

  return (
    <div className="min-h-screen w-full bg-[#f6f7f8] dark:bg-[#101a22] text-slate-900 dark:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-1 text-slate-900 dark:text-white">
              Welcome back, Alex
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Here is what's happening in your workspace today.
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <button onClick={handleClick} className="flex items-center gap-2 bg-[#1392ec] hover:bg-[#1392ec]/90 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold shadow-lg shadow-[#1392ec]/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap text-sm md:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Projects */}
          <div className="bg-white dark:bg-[#1c252e] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FolderOpen className="w-16 h-16 text-[#1392ec]" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium z-10">Active Projects</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white z-10">12</p>
          </div>
          {/* Tasks Due Soon */}
          <div className="bg-white dark:bg-[#1c252e] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-16 h-16 text-orange-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium z-10">Tasks Due Soon</p>
            <div className="flex items-end gap-2 z-10">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">5</p>
              <span className="text-sm font-medium text-orange-500 mb-1.5 flex items-center">Urgent</span>
            </div>
          </div>
          {/* Team Velocity */}
          <div className="bg-white dark:bg-[#1c252e] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16 text-emerald-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium z-10">Team Velocity</p>
            <div className="flex items-end gap-2 z-10">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">+24%</p>
              <span className="text-sm font-medium text-emerald-500 mb-1.5">+4% vs last week</span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects (Left 2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Projects</h3>
              <a className="text-sm font-medium text-[#1392ec] hover:text-[#1392ec]/80" href="#">
                View all
              </a>
            </div>
            <div className="flex flex-col gap-4">
              {/* Project Card 1 */}
              <div className="bg-white dark:bg-[#1c252e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#1392ec]/50 transition-colors group cursor-pointer">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#1392ec] transition-colors">
                        Website Redesign
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Marketing Team</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold border border-blue-500/20">
                    In Progress
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-[#1392ec] h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1c252e] bg-slate-200 overflow-hidden"
                      >
                        <img
                          src={`/generic-fantasy-character.png?height=32&width=32&query=avatar-${i}`}
                          alt="Team member"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1c252e] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-300">
                      +2
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Due in 2 days</span>
                  </div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="bg-white dark:bg-[#1c252e] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#1392ec]/50 transition-colors group cursor-pointer">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#1392ec] transition-colors">
                        Mobile App Launch
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Product Team</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold border border-orange-500/20">
                    Review
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4">
                  <div className="flex -space-x-2">
                    {[4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1c252e] bg-slate-200 overflow-hidden"
                      >
                        <img
                          src={`/generic-fantasy-character.png?height=32&width=32&query=avatar-${i}`}
                          alt="Team member"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Due Tomorrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity (Right 1/3) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="bg-white dark:bg-[#1c252e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-full">
              <ul className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                <li className="ml-6 relative">
                  <span className="absolute -left-[37px] flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white dark:ring-[#1c252e] dark:bg-blue-900 overflow-hidden">
                    <img src="/abstract-geometric-shapes.png" alt="User" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      James updated <span className="text-[#1392ec] hover:underline cursor-pointer">Homepage Hero</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Added new assets and copy.</p>
                    <span className="text-xs text-slate-400 dark:text-slate-500">2 mins ago</span>
                  </div>
                </li>
                <li className="ml-6 relative">
                  <span className="absolute -left-[37px] flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-4 ring-white dark:ring-[#1c252e] dark:bg-green-900">
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Task Completed</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sarah finished{" "}
                      <span className="text-[#1392ec] hover:underline cursor-pointer">API Integration</span>
                    </p>
                    <span className="text-xs text-slate-400 dark:text-slate-500">1 hour ago</span>
                  </div>
                </li>
                <li className="ml-6 relative">
                  <span className="absolute -left-[37px] flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full ring-4 ring-white dark:ring-[#1c252e] dark:bg-purple-900">
                    <MessageSquare className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">New Comment</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      "Should we use the new brand colors for the..."
                    </p>
                    <span className="text-xs text-slate-400 dark:text-slate-500">3 hours ago</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
