import { Button } from "@mui/material"
import { Rocket, Zap, CheckCircle, TrendingUp, FolderPlus } from "lucide-react"


export default function WelcomePage() {
  return (
    <div className="min-h-screen dark:bg-[#66b3ff00] backdrop-blur-xl    bg-[#66b3ff0e] text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-12">
        <div className="relative w-50 h-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-card/50 rounded-3xl shadow-blue-300 shadow-md backdrop-blur-xl  border dark:border-gray-700 border-gray-300" />
          <div className="relative z-10">
            <Rocket className="w-25 h-25 text-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-5 dark:bg-black/10   bg-white/40 backkdrop-blur-lg -right-5 z-100 w-13 h-13 rounded-2xl border border-border/50 flex items-center justify-center">
            <Zap className="w-7 h-7 text-[#66b3ff]" />
          </div>
          <div className="absolute -bottom-6 -left-5 z-100 w-13 h-13  dark:bg-black/10 bg-white/40 rounded-2xl border border-border/50 flex items-center justify-center">
            <CheckCircle className="w-7 h-7   text-green-400" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl md:text-3xl font-bold text-balance leading-tight">
            Welcome! Create your first project
            <br />
            to get started
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl text-balance leading-relaxed">
            It looks like you haven't created any projects yet. Organize your tasks, collaborate with your team, and
            track progress all in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="contained"
            size="lg"
            className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
          >
            <FolderPlus className="w-5 h-5 mr-2" />
            Create Project
          </Button> 
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
          <div className="p-6 rounded-2xl bg-card border border-border/50 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderPlus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">1. Create Project</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Set up your workspace and invite team members.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold">2. Add Tasks</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Break down your work into manageable items.</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">3. Track Progress</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualize your team's velocity and celebrate wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
