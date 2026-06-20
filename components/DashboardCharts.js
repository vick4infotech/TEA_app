'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
export default function DashboardCharts({ byType, attTrend, passRate }){
 return <section className="grid gap-4 xl:grid-cols-3">
  <div className="card"><h3 className="font-bold text-teaPurple-900">Students by Training Type</h3><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={byType}><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="value" fill="#68158d" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>
  <div className="card"><h3 className="font-bold text-teaPurple-900">Attendance Trend</h3><div className="mt-4 h-64"><ResponsiveContainer><LineChart data={attTrend}><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Line dataKey="value" stroke="#ad7604" strokeWidth={3}/></LineChart></ResponsiveContainer></div></div>
  <div className="card"><h3 className="font-bold text-teaPurple-900">Training Pass Rate</h3><div className="mt-4 flex h-64 items-center justify-center"><div className="relative h-48 w-48"><ResponsiveContainer><PieChart><Pie data={[{name:'Passed',value:passRate},{name:'Remaining',value:100-passRate}]} innerRadius={60} outerRadius={90} dataKey="value"><Cell fill="#ad7604"/><Cell fill="#eadcff"/></Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-teaPurple-900">{passRate}%</div></div></div></div>
 </section>
}
