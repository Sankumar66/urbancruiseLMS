import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LeadsChartProps {
  data: { name: string; leads: number }[]
}

export function LeadsChart({ data }: LeadsChartProps) {
  return null; // Component logic moved to page.tsx for better control
}