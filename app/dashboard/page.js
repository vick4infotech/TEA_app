import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/db';
import { requirePageUser, branchWhere } from '@/lib/auth';
import { format } from 'date-fns';
import DashboardCharts from '@/components/DashboardCharts';

function dobFilter(kind){ const now=new Date(); const month=now.getMonth()+1; const day=now.getDate(); if(kind==='today') return { equals:`${month}-${day}` }; return null; }
function sameMonthDay(date, offsetDays=0){ const d=new Date(); d.setDate(d.getDate()+offsetDays); return `${d.getMonth()+1}-${d.getDate()}`; }

export default async function DashboardPage(){
 const user=await requirePageUser(); const bWhere=branchWhere(user);
 const [branches,families,members,students,attendance,outreach,certificates,sets] = await Promise.all([
  prisma.branch.count({ where:user.role.startsWith('SUPER')?{}:{id:user.branchId} }),
  prisma.family.count({ where:bWhere }), prisma.member.findMany({ where:{...bWhere, active:true}, include:{family:true,branch:true}, take:500 }),
  prisma.studentTrainingRecord.findMany({ where:bWhere, include:{trainingType:true,trainingLevel:true} }),
  prisma.attendance.findMany({ where:bWhere, orderBy:{attendanceDate:'desc'}, take:8, include:{branch:true} }),
  prisma.outreachReport.findMany({ where:bWhere, orderBy:{startDate:'desc'}, take:8 }),
  prisma.certificate.count({ where:bWhere }), prisma.trainingSet.count({ where:{...bWhere, status:'ACTIVE'} })
 ]);
 const todayKey=sameMonthDay(new Date()); const todayBirthdays=members.filter(m=>`${m.dateOfBirth.getMonth()+1}-${m.dateOfBirth.getDate()}`===todayKey);
 const weekKeys=Array.from({length:7},(_,i)=>sameMonthDay(new Date(),i)); const weekBirthdays=members.filter(m=>weekKeys.includes(`${m.dateOfBirth.getMonth()+1}-${m.dateOfBirth.getDate()}`));
 const monthBirthdays=members.filter(m=>m.dateOfBirth.getMonth()===new Date().getMonth());
 const newMembersThisMonth=members.filter(m=>m.createdAt.getMonth()===new Date().getMonth() && m.createdAt.getFullYear()===new Date().getFullYear()).length;
 const passed=students.filter(s=>s.eligibleForPromotion || s.currentStatus==='COMPLETED' || s.currentStatus==='PROMOTED' || s.currentStatus==='WORKER').length;
 const cards=[['Total Branches',branches],['Total Families',families],['Total Members',members.length],['New Members This Month',newMembersThisMonth],['Birthdays Today',todayBirthdays.length],['Upcoming Birthdays',weekBirthdays.length],['Students in Training',students.length],['Active Training Sets',sets],['Certificates Generated',certificates]];
 const byType=Object.values(students.reduce((a,s)=>{ const k=s.trainingType.shortCode; a[k]=a[k]||{name:k,value:0}; a[k].value++; return a; },{}));
 const attTrend=attendance.slice().reverse().map(a=>({name:format(a.attendanceDate,'MMM d'), value:a.totalPersons}));
 return <AppShell user={user}><div className="space-y-6"><div><h2 className="text-3xl font-bold text-teaPurple-900">Dashboard</h2><p className="text-gray-600">Operational view for membership, training, birthdays, attendance, evangelism, and certificates.</p></div>
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value])=><div key={label} className="card"><div className="text-sm text-gray-500">{label}</div><div className="mt-2 text-3xl font-bold text-teaPurple-900">{value}</div><div className="mt-3 h-1.5 rounded-full bg-teaGold-200"><div className="h-1.5 w-2/3 rounded-full bg-teaGold-500" /></div></div>)}</div>
 <DashboardCharts byType={byType} attTrend={attTrend} passRate={students.length?Math.round((passed/students.length)*100):0} />
 <section className="grid gap-4 xl:grid-cols-3"><BirthdayCard title="Today’s Birthdays" people={todayBirthdays}/><BirthdayCard title="Upcoming Birthdays This Week" people={weekBirthdays}/><BirthdayCard title="Birthdays This Month" people={monthBirthdays}/></section>
 <section className="grid gap-4 lg:grid-cols-2"><Recent title="Recent Attendance" rows={attendance.map(a=>[format(a.attendanceDate,'MMM d, yyyy'),a.title,a.totalPersons])}/><Recent title="Recent Outreach" rows={outreach.map(o=>[format(o.startDate,'MMM d, yyyy'),o.title,o.numberReached])}/></section>
 </div></AppShell>;
}
function BirthdayCard({title,people}){ return <div className="card"><h3 className="font-bold text-teaPurple-900">{title}</h3><div className="mt-4 space-y-3">{people.slice(0,8).map(p=><div key={p.id} className="rounded-xl bg-purple-50 p-3 text-sm"><div className="font-semibold">{p.fullName}</div><div className="text-gray-600">{p.family?.name} · {p.phone} · {p.branch?.name}</div></div>)}{!people.length&&<p className="text-sm text-gray-500">No records available.</p>}</div></div> }
function Recent({title,rows}){ return <div className="card"><h3 className="font-bold text-teaPurple-900">{title}</h3><table className="table mt-4"><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}{!rows.length&&<tr><td>No records available.</td></tr>}</tbody></table></div> }
