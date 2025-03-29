"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  CalendarIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  CalendarDays,
  FileText,
  Clipboard,
  Save,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Types
type Task = {
  id: string
  title: string
  description: string
  status: "not-started" | "in-progress" | "completed" | "delayed"
  dueDate: Date | null
  assignedTo: string
  notes: string
}

type Note = {
  id: string
  title: string
  content: string
  createdAt: Date
  category: string
}

type Material = {
  id: string
  name: string
  quantity: number
  unit: string
  ordered: boolean
  received: boolean
}

type Project = {
  id?: string
  name: string
  clientName: string
  location: string
  description: string
  budget: number
  startDate: Date | null
  endDate: Date | null
  tasks: Task[]
  materials: Material[]
  notes: Note[]
}

export function ProjectPlanner({ existingProject }: { existingProject?: Project }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Project Details State
  const [projectName, setProjectName] = useState<string>(existingProject?.name || "")
  const [clientName, setClientName] = useState<string>(existingProject?.clientName || "")
  const [location, setLocation] = useState<string>(existingProject?.location || "")
  const [startDate, setStartDate] = useState<Date | null>(existingProject?.startDate || new Date())
  const [endDate, setEndDate] = useState<Date | null>(existingProject?.endDate || null)
  const [projectDescription, setProjectDescription] = useState<string>(existingProject?.description || "")
  const [budget, setBudget] = useState<string>(existingProject?.budget ? existingProject.budget.toString() : "")

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(
    existingProject?.tasks || [
      {
        id: "temp-1",
        title: "Site preparation",
        description: "Clear the site and prepare for construction",
        status: "not-started",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        assignedTo: "John",
        notes: "",
      },
    ],
  )

  // Notes State
  const [notes, setNotes] = useState<Note[]>(
    existingProject?.notes || [
      {
        id: "temp-1",
        title: "Initial client meeting",
        content:
          "Client prefers natural materials and a modern design. Budget is flexible but prefers to stay under initial estimate.",
        createdAt: new Date(),
        category: "client",
      },
    ],
  )

  // Materials State
  const [materials, setMaterials] = useState<Material[]>(
    existingProject?.materials || [
      {
        id: "temp-1",
        name: "Timber framing",
        quantity: 120,
        unit: "meters",
        ordered: true,
        received: false,
      },
      {
        id: "temp-2",
        name: "Concrete",
        quantity: 4,
        unit: "cubic meters",
        ordered: false,
        received: false,
      },
    ],
  )

  // UI State
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "not-started",
    dueDate: null,
    assignedTo: "",
    notes: "",
  })
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    category: "general",
  })
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    name: "",
    quantity: 0,
    unit: "units",
    ordered: false,
    received: false,
  })
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<string | null>(null)

  // Handlers
  const addTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: `temp-${Date.now()}`,
        title: newTask.title || "",
        description: newTask.description || "",
        status: (newTask.status as "not-started" | "in-progress" | "completed" | "delayed") || "not-started",
        dueDate: newTask.dueDate,
        assignedTo: newTask.assignedTo || "",
        notes: newTask.notes || "",
      }

      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        status: "not-started",
        dueDate: null,
        assignedTo: "",
        notes: "",
      })
    }
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: `temp-${Date.now()}`,
        title: newNote.title || "",
        content: newNote.content || "",
        createdAt: new Date(),
        category: newNote.category || "general",
      }

      setNotes([...notes, note])
      setNewNote({
        title: "",
        content: "",
        category: "general",
      })
    }
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updates } : note)))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const addMaterial = () => {
    if (newMaterial.name && newMaterial.quantity) {
      const material: Material = {
        id: `temp-${Date.now()}`,
        name: newMaterial.name || "",
        quantity: newMaterial.quantity || 0,
        unit: newMaterial.unit || "units",
        ordered: newMaterial.ordered || false,
        received: newMaterial.received || false,
      }

      setMaterials([...materials, material])
      setNewMaterial({
        name: "",
        quantity: 0,
        unit: "units",
        ordered: false,
        received: false,
      })
    }
  }

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(materials.map((material) => (material.id === id ? { ...material, ...updates } : material)))
  }

  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter((material) => material.id !== id))
  }

  // Save project to database
  const saveProject = async () => {
    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", projectName)
      formData.append("clientName", clientName)
      formData.append("location", location)
      formData.append("description", projectDescription)
      formData.append("budget", budget)

      if (startDate) {
        formData.append("startDate", startDate.toISOString())
      }

      if (endDate) {
        formData.append("endDate", endDate.toISOString())
      }

      // Create or update project
      let projectId = existingProject?.id
      let response

      if (projectId) {
        // Update existing project
        response = await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          body: formData,
        })
      } else {
        // Create new project
        response = await fetch("/api/projects", {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      const data = await response.json()
      projectId = data.project.id

      // Save tasks, materials, and notes
      await Promise.all([
        // Save tasks
        ...tasks.map((task) => {
          const taskFormData = new FormData()
          taskFormData.append("title", task.title)
          taskFormData.append("description", task.description || "")
          taskFormData.append("status", task.status)
          taskFormData.append("assignedTo", task.assignedTo || "")
          taskFormData.append("notes", task.notes || "")

          if (task.dueDate) {
            taskFormData.append("dueDate", task.dueDate.toISOString())
          }

          if (task.id.startsWith("temp-")) {
            // Create new task
            return fetch(`/api/projects/${projectId}/tasks`, {
              method: "POST",
              body: taskFormData,
            })
          } else {
            // Update existing task
            return fetch(`/api/tasks/${task.id}`, {
              method: "PUT",
              body: taskFormData,
            })
          }
        }),

        // Save materials
        ...materials.map((material) => {
          const materialFormData = new FormData()
          materialFormData.append("name", material.name)
          materialFormData.append("quantity", material.quantity.toString())
          materialFormData.append("unit", material.unit)
          materialFormData.append("ordered", material.ordered.toString())
          materialFormData.append("received", material.received.toString())

          if (material.id.startsWith("temp-")) {
            // Create new material
            return fetch(`/api/projects/${projectId}/materials`, {
              method: "POST",
              body: materialFormData,
            })
          } else {
            // Update existing material
            return fetch(`/api/materials/${material.id}`, {
              method: "PUT",
              body: materialFormData,
            })
          }
        }),

        // Save notes
        ...notes.map((note) => {
          const noteFormData = new FormData()
          noteFormData.append("title", note.title)
          noteFormData.append("content", note.content)
          noteFormData.append("category", note.category)

          if (note.id.startsWith("temp-")) {
            // Create new note
            return fetch(`/api/projects/${projectId}/notes`, {
              method: "POST",
              body: noteFormData,
            })
          } else {
            // Update existing note
            return fetch(`/api/notes/${note.id}`, {
              method: "PUT",
              body: noteFormData,
            })
          }
        }),
      ])

      toast({
        title: "Success",
        description: "Project saved successfully",
      })

      // Redirect to projects page
      router.push("/projects")
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        )
      case "delayed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Delayed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Not Started
          </Badge>
        )
    }
  }

  const calculateProgress = () => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((task) => task.status === "completed").length
    return Math.round((completed / tasks.length) * 100)
  }

  const calculateDaysRemaining = () => {
    if (!endDate) return "No end date set"
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} days remaining` : "Past due date"
  }

  return (
    <Card className="glass-card max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Project Planner</CardTitle>
        <CardDescription>Plan and manage your construction projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Clipboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="materials">
              <Clipboard className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="bg-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    className="bg-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter project location"
                    className="bg-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter project budget"
                    className="bg-white/20"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/20",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate || undefined}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/20",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate || undefined}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => (startDate ? date < startDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Enter project description"
                    className="bg-white/20 min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* Project Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{calculateProgress()}%</span>
                    <span className="text-sm text-muted-foreground">
                      {tasks.filter((t) => t.status === "completed").length} of {tasks.length} tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Start:</span>
                      <span>{startDate ? format(startDate, "PP") : "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">End:</span>
                      <span>{endDate ? format(endDate, "PP") : "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-primary font-medium">{calculateDaysRemaining()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${budget || "0"}</span>
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">Materials:</span>
                    <span>$0 (0%)</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <Card className="bg-white/20">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-start gap-2">
                        {getStatusIcon(task.status)}
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.dueDate ? `Due: ${format(task.dueDate, "PP")}` : "No due date"} • Assigned to:{" "}
                            {task.assignedTo || "Unassigned"}
                          </p>
                        </div>
                      </div>
                    ))}

                    {tasks.length === 0 && <p className="text-muted-foreground">No tasks added yet</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tasks</h3>
              <Button onClick={() => setActiveTab("add-task")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-white/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          {task.title}
                        </CardTitle>
                        <CardDescription>
                          {task.dueDate ? `Due: ${format(task.dueDate, "PP")}` : "No due date"} • Assigned to:{" "}
                          {task.assignedTo || "Unassigned"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingTask(task.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{task.description}</p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">{getStatusBadge(task.status)}</div>

                      <Select
                        value={task.status}
                        onValueChange={(value) =>
                          updateTask(task.id, {
                            status: value as "not-started" | "in-progress" | "completed" | "delayed",
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px] bg-white/20">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {editingTask === task.id && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`task-notes-${task.id}`}>Task Notes</Label>
                          <Textarea
                            id={`task-notes-${task.id}`}
                            value={task.notes}
                            onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                            placeholder="Add notes for this task"
                            className="bg-white/30 min-h-[100px]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" onClick={() => setEditingTask(null)}>
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {tasks.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No tasks added yet</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("add-task")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Add/Edit Task Tab */}
          <TabsContent value="add-task" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Task</h3>
              <Button variant="outline" onClick={() => setActiveTab("tasks")}>
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="bg-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-assigned">Assigned To</Label>
                  <Input
                    id="task-assigned"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    placeholder="Who is responsible for this task"
                    className="bg-white/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/20",
                          !newTask.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTask.dueDate || undefined}
                        onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-status">Status</Label>
                  <Select
                    value={newTask.status as string}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        status: value as "not-started" | "in-progress" | "completed" | "delayed",
                      })
                    }
                  >
                    <SelectTrigger id="task-status" className="bg-white/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe what needs to be done"
                  className="bg-white/20 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-notes">Notes</Label>
                <Textarea
                  id="task-notes"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="Add any additional notes"
                  className="bg-white/20 min-h-[100px]"
                />
              </div>

              <Button
                onClick={() => {
                  addTask()
                  setActiveTab("tasks")
                }}
                className="w-full"
                disabled={!newTask.title}
              >
                Add Task
              </Button>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Materials</h3>
              <Button onClick={() => setActiveTab("add-material")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>
                      {material.quantity} {material.unit}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={material.ordered}
                        onCheckedChange={(checked) => updateMaterial(material.id, { ordered: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={material.received}
                        onCheckedChange={(checked) => updateMaterial(material.id, { received: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteMaterial(material.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {materials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No materials added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Add Material Tab */}
          <TabsContent value="add-material" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Material</h3>
              <Button variant="outline" onClick={() => setActiveTab("materials")}>
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material-name">Material Name</Label>
                <Input
                  id="material-name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  placeholder="Enter material name"
                  className="bg-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material-quantity">Quantity</Label>
                  <Input
                    id="material-quantity"
                    type="number"
                    value={newMaterial.quantity?.toString() || ""}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, quantity: Number.parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Enter quantity"
                    className="bg-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-unit">Unit</Label>
                  <Select
                    value={newMaterial.unit}
                    onValueChange={(value) => setNewMaterial({ ...newMaterial, unit: value })}
                  >
                    <SelectTrigger id="material-unit" className="bg-white/20">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="units">Units</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="cubic meters">Cubic Meters</SelectItem>
                      <SelectItem value="square meters">Square Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="material-ordered"
                  checked={newMaterial.ordered}
                  onCheckedChange={(checked) => setNewMaterial({ ...newMaterial, ordered: checked as boolean })}
                />
                <Label htmlFor="material-ordered">Already ordered</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="material-received"
                  checked={newMaterial.received}
                  onCheckedChange={(checked) => setNewMaterial({ ...newMaterial, received: checked as boolean })}
                />
                <Label htmlFor="material-received">Already received</Label>
              </div>

              <Button
                onClick={() => {
                  addMaterial()
                  setActiveTab("materials")
                }}
                className="w-full"
                disabled={!newMaterial.name || !newMaterial.quantity}
              >
                Add Material
              </Button>
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Project Notes</h3>
              <Button onClick={() => setActiveTab("add-note")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="bg-white/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(note.createdAt), "PP")} •
                          <Badge variant="outline" className="ml-2">
                            {note.category}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingNote(note.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{note.content}</p>

                    {editingNote === note.id && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`note-content-${note.id}`}>Edit Note</Label>
                          <Textarea
                            id={`note-content-${note.id}`}
                            value={note.content}
                            onChange={(e) => updateNote(note.id, { content: e.target.value })}
                            className="bg-white/30 min-h-[100px]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" onClick={() => setEditingNote(null)}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {notes.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-lg col-span-2">
                  <p className="text-muted-foreground">No notes added yet</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("add-note")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Note
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Add Note Tab */}
          <TabsContent value="add-note" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Note</h3>
              <Button variant="outline" onClick={() => setActiveTab("notes")}>
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Note Title</Label>
                <Input
                  id="note-title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Enter note title"
                  className="bg-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-category">Category</Label>
                <Select value={newNote.category} onValueChange={(value) => setNewNote({ ...newNote, category: value })}>
                  <SelectTrigger id="note-category" className="bg-white/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Enter note content"
                  className="bg-white/20 min-h-[200px]"
                />
              </div>

              <Button
                onClick={() => {
                  addNote()
                  setActiveTab("notes")
                }}
                className="w-full"
                disabled={!newNote.title || !newNote.content}
              >
                Add Note
              </Button>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Project Timeline</h3>

            <div className="relative">
              {/* Timeline header */}
              <div className="flex border-b pb-2 mb-4">
                <div className="w-1/4 font-medium">Date</div>
                <div className="w-1/4 font-medium">Task</div>
                <div className="w-1/4 font-medium">Assigned To</div>
                <div className="w-1/4 font-medium">Status</div>
              </div>

              {/* Timeline items */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.dueDate)
                    .sort((a, b) => {
                      if (!a.dueDate || !b.dueDate) return 0
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    })
                    .map((task) => (
                      <div key={task.id} className="flex items-center py-2 border-b border-dashed">
                        <div className="w-1/4">{task.dueDate ? format(new Date(task.dueDate), "PP") : "No date"}</div>
                        <div className="w-1/4 font-medium">{task.title}</div>
                        <div className="w-1/4">{task.assignedTo || "Unassigned"}</div>
                        <div className="w-1/4">{getStatusBadge(task.status)}</div>
                      </div>
                    ))}

                  {tasks.filter((task) => task.dueDate).length === 0 && (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No tasks with due dates</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end mt-4">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Export Timeline
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={saveProject} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

