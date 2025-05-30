export const mockTasks = [
  {
    id: "1",
    title: "Design a Modern Landing Page for SaaS Product",
    description:
      "Looking for a talented UI/UX designer to create a modern, conversion-focused landing page for our new SaaS product. Must be responsive and follow current design trends.",
    category: "Design",
    reward: 500,
    currency: "XDC",
    deadline: "in 5 days",
    location: "Remote",
    client: {
      name: "TechCorp Inc.",
      avatar: "/placeholder-user.jpg",
      rating: 4.8,
    },
    applicants: 12,
    tags: ["UI/UX", "Figma", "Web Design", "Landing Page"],
  },
  // Add more mock tasks as needed
]

export const mockNotifications = [
  {
    id: "1",
    type: "task_update",
    title: "Task Approved",
    message: 'Your submission for "Design Mobile App Interface" has been approved.',
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: 'You received 800 XDC for completing "Build React Dashboard".',
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "TechCorp Inc. sent you a message about your proposal.",
    timestamp: "3 hours ago",
    read: true,
  },
]
