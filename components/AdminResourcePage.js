'use client';

import { useEffect, useMemo, useState } from 'react';
import { RESOURCE_CONFIG } from '@/lib/constants';

const numberFields = new Set(['sessionYear', 'levelOrder', 'requiredPassedExams', 'passMark', 'examNumber', 'finalScore', 'totalPersons', 'firstTimers', 'children', 'men', 'women', 'numberReached', 'numberSaved', 'supernaturalsRecorded', 'jointPrayers']);
const checkboxFields = new Set(['active', 'isEntryLevel', 'certificateRequired']);
const textAreaFields = new Set(['description', 'notes', 'testimonies', 'curriculumNotes', 'sermonLinks']);
const referenceFields = {
  branchId: 'branches',
  familyId: 'families',
  memberId: 'members',
  trainingTypeId: 'trainingTypes',
  trainingLevelId: 'trainingLevels',
  trainingSetId: 'trainingSets',
  studentRecordId: 'students'
};
const choiceFields = {
  role: 'roles',
  gender: 'genders',
  status: 'statuses',
  membershipStatus: 'membershipStatuses',
  maritalStatus: 'maritalStatuses',
  shortCode: 'trainingCodes',
  reportType: 'outreachTypes'
};

function label(field) {
  return field.replace(/Id$/, '').replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function inputType(field) {
  if (field.toLowerCase().includes('date')) return 'date';
  if (numberFields.has(field)) return 'number';
  if (checkboxFields.has(field)) return 'checkbox';
  if (field.toLowerCase().includes('email')) return 'email';
  if (field.toLowerCase().includes('url')) return 'url';
  return 'text';
}

function visible(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    if (value.name) return value.name;
    if (value.fullName) return value.fullName;
    if (value.title) return value.title;
    if (value.studentCode) return value.studentCode;
    if (value.email) return value.email;
    return '';
  }
  return String(value).slice(0, 80);
}

function reportName(resource) {
  return ({
    members: 'branch-membership',
    families: 'family',
    'training-sets': 'training-set',
    students: 'student-performance',
    outreach: 'evangelism',
    certificates: 'certificate-completion',
    branches: 'branch-comparison'
  })[resource] || resource;
}

function optionFilter(field, form) {
  return option => {
    if (field === 'familyId' && form.branchId && option.branchId !== form.branchId) return false;
    if (field === 'memberId') {
      if (form.branchId && option.branchId !== form.branchId) return false;
      if (form.familyId && option.familyId !== form.familyId) return false;
    }
    if (field === 'trainingLevelId' && form.trainingTypeId && option.trainingTypeId !== form.trainingTypeId) return false;
    if (field === 'trainingSetId') {
      if (form.branchId && option.branchId !== form.branchId) return false;
      if (form.trainingTypeId && option.trainingTypeId !== form.trainingTypeId) return false;
      if (form.trainingLevelId && option.trainingLevelId !== form.trainingLevelId) return false;
    }
    return true;
  };
}

function exportUrl(report, format) {
  return `/api/reports/export?report=${encodeURIComponent(report)}&format=${encodeURIComponent(format)}`;
}

function defaultForm(fields, resource) {
  const defaults = {};
  if (fields.includes('active')) defaults.active = true;
  if (fields.includes('status')) defaults.status = resource === 'curriculum' ? 'DRAFT' : 'ACTIVE';
  if (fields.includes('gender')) defaults.gender = 'OTHER';
  if (fields.includes('membershipStatus')) defaults.membershipStatus = 'Member';
  if (fields.includes('certificateRequired')) defaults.certificateRequired = true;
  if (fields.includes('passMark')) defaults.passMark = 60;
  if (fields.includes('requiredPassedExams')) defaults.requiredPassedExams = 1;
  if (fields.includes('sessionYear')) defaults.sessionYear = new Date().getFullYear();
  return defaults;
}

export default function AdminResourcePage({ resource }) {
  const cfg = RESOURCE_CONFIG[resource];
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(null);
  const [options, setOptions] = useState({});
  const fields = cfg?.fields || [];

  async function load() {
    if (!cfg) return;
    const response = await fetch(`/api/resources/${resource}`);
    if (response.status === 401) {
      location.href = '/login';
      return;
    }
    const data = await response.json();
    setRows(Array.isArray(data) ? data : []);
  }

  async function loadOptions() {
    const response = await fetch('/api/options');
    if (response.status === 401) {
      location.href = '/login';
      return;
    }
    if (response.ok) setOptions(await response.json());
  }

  useEffect(() => {
    load();
    loadOptions();
  }, [resource]);

  function defaultValue(field) {
    if (field === 'active' || field === 'certificateRequired') return true;
    if (field === 'status') return 'ACTIVE';
    if (field === 'passMark') return 60;
    if (field === 'requiredPassedExams' || field === 'levelOrder') return 1;
    if (field === 'sessionYear') return new Date().getFullYear();
    return '';
  }

  function openCreate() {
    setMsg('');
    const initial = {};
    fields.forEach(field => {
      const value = defaultValue(field);
      if (value !== '') initial[field] = value;
    });
    setForm(initial);
    setOpen(true);
  }

  async function submit(event) {
    event.preventDefault();
    setMsg('');
    const payload = { ...form };
    fields.forEach(field => {
      if (inputType(field) === 'checkbox') payload[field] = Boolean(payload[field]);
    });
    const response = await fetch(`/api/resources/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setMsg(data.error || 'Action failed');
      return;
    }
    setForm({});
    setOpen(false);
    setMsg('Saved successfully.');
    await load();
    await loadOptions();
  }

  async function uploadFile(kind) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/api/upload/${kind}`, { method: 'POST', body: formData });
    setUpload(await response.json());
    await load();
    await loadOptions();
  }

  async function generateCertificate(id) {
    const response = await fetch('/api/certificates/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentRecordId: id })
    });
    if (!response.ok) {
      const data = await response.json();
      setMsg(data.error || 'Certificate could not be generated');
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'completion-letter.pdf';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function fieldOptions(field) {
    const key = referenceFields[field] || choiceFields[field];
    const list = key ? options[key] || [] : [];
    return referenceFields[field] ? list.filter(optionFilter(field, form)) : list;
  }

  function renderField(field) {
    const type = inputType(field);
    const opts = fieldOptions(field);
    if (opts.length) {
      return <label key={field} className="text-sm font-semibold">
        {label(field)}
        <select className="input mt-2" value={form[field] || ''} onChange={event => setForm({ ...form, [field]: event.target.value })}>
          <option value="">Select {label(field)}</option>
          {opts.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </label>;
    }
    if (type === 'checkbox') {
      return <label key={field} className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={Boolean(form[field])} onChange={event => setForm({ ...form, [field]: event.target.checked })} />
        {label(field)}
      </label>;
    }
    if (textAreaFields.has(field)) {
      return <label key={field} className="text-sm font-semibold md:col-span-2">
        {label(field)}
        <textarea className="input mt-2 min-h-24" value={form[field] || ''} onChange={event => setForm({ ...form, [field]: event.target.value })} />
      </label>;
    }
    return <label key={field} className="text-sm font-semibold">
      {label(field)}
      <input className="input mt-2" type={type} value={form[field] || ''} onChange={event => setForm({ ...form, [field]: event.target.value })} />
    </label>;
  }

  const columns = useMemo(
    () => rows[0] ? Object.keys(rows[0]).filter(key => !['passwordHash'].includes(key)).slice(0, 7) : fields.slice(0, 7),
    [rows, fields]
  );

  if (resource === 'promotion') return <div className="space-y-6"><div><h2 className="text-3xl font-bold text-teaPurple-900">Promotion Management</h2></div><div className="card"><h3 className="font-bold text-teaPurple-900">Promotion Rules</h3><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-purple-50 p-4">BT and DT students must complete the configured required exams before promotion.</div><div className="rounded-xl bg-purple-50 p-4">Completed BT or DT students may move to WIT or SOD.</div><div className="rounded-xl bg-purple-50 p-4">WIT and SOD can progress through multiple levels or phases.</div><div className="rounded-xl bg-purple-50 p-4">Every promotion stores the prior and new training set relationship.</div></div></div></div>;
  if (resource === 'analytics') return <div className="space-y-6"><div><h2 className="text-3xl font-bold text-teaPurple-900">Analytics</h2></div><div className="card"><a className="btn-primary" href="/dashboard">Open Dashboard Analytics</a></div></div>;
  if (resource === 'reports') return <div className="space-y-6"><div><h2 className="text-3xl font-bold text-teaPurple-900">Reports and Exports</h2></div><div className="card grid gap-3 md:grid-cols-3">{['branch-membership','birthday','family','training-set','student-performance','pass-rate','scores','attendance','evangelism','certificate-completion','worker-list','branch-comparison','users','training-types','training-levels','curriculum','sermons'].map(report => <div key={report} className="rounded-2xl bg-purple-50 p-4"><div className="font-bold capitalize text-teaPurple-900">{report.replaceAll('-', ' ')}</div><div className="mt-3 flex flex-wrap gap-2"><a className="btn-gold" href={exportUrl(report, 'pdf')}>PDF</a><a className="btn-gold" href={exportUrl(report, 'xlsx')}>Excel</a><a className="btn-gold" href={exportUrl(report, 'csv')}>CSV</a></div></div>)}</div></div>;
  if (resource === 'settings') return <div className="space-y-6"><div><h2 className="text-3xl font-bold text-teaPurple-900">Settings</h2></div><div className="card"><h3 className="font-bold text-teaPurple-900">Global Settings</h3></div></div>;
  if (!cfg) return <div className="card">Page not found.</div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-3xl font-bold text-teaPurple-900">{cfg.title}</h2></div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={openCreate}>{cfg.create}</button>
        {resource === 'members' && <button className="btn-gold" onClick={() => document.getElementById('memberUpload').showModal()}>Bulk Upload Members</button>}
        {resource === 'students' && <button className="btn-gold" onClick={() => document.getElementById('studentUpload').showModal()}>Bulk Upload Students</button>}
      </div>
    </div>

    {msg && <div className="rounded-xl bg-teaGold-50 p-3 text-sm font-semibold text-teaGold-900">{msg}</div>}

    <div className="card">
      <div className="mb-4 flex flex-wrap gap-2">
        <a className="btn-gold" href={exportUrl(reportName(resource), 'pdf')}>Export Report PDF</a>
        <a className="btn-gold" href={exportUrl(reportName(resource), 'xlsx')}>Export Excel</a>
        <a className="btn-gold" href={exportUrl(reportName(resource), 'csv')}>Export CSV</a>
      </div>
      <div className="overflow-x-auto"><table className="table"><thead><tr>{columns.map(column => <th key={column}>{label(column)}</th>)}{resource === 'students' && <th>Actions</th>}</tr></thead><tbody>{rows.map(row => <tr key={row.id}>{columns.map(column => <td key={column}>{visible(row[column])}</td>)}{resource === 'students' && <td><button className="btn-primary" onClick={() => generateCertificate(row.id)}>Generate Certificate</button></td>}</tr>)}{!rows.length && <tr><td colSpan="8">No records available.</td></tr>}</tbody></table></div>
    </div>

    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><form onSubmit={submit} className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto"><div className="flex items-center justify-between"><h3 className="text-xl font-bold text-teaPurple-900">{cfg.create}</h3><button type="button" onClick={() => setOpen(false)} className="text-2xl">x</button></div><div className="mt-5 grid gap-4 md:grid-cols-2">{fields.map(renderField)}{resource === 'users' && <label className="text-sm font-semibold">Password<input className="input mt-2" type="password" value={form.password || ''} onChange={event => setForm({ ...form, password: event.target.value })} /></label>}</div><button className="btn-primary mt-6 w-full">Save Record</button></form></div>}

    <dialog id="memberUpload" className="rounded-2xl p-0"><div className="card w-[min(92vw,560px)]"><h3 className="text-xl font-bold text-teaPurple-900">Bulk Upload Members</h3><p className="mt-1 text-sm text-gray-600">Upload CSV or Excel with the required member columns.</p><input className="input mt-4" type="file" accept=".csv,.xlsx,.xls" onChange={event => setFile(event.target.files[0])} /><button className="btn-primary mt-4" onClick={() => uploadFile('members')}>Upload Members</button><button className="btn-gold ml-2" onClick={() => document.getElementById('memberUpload').close()}>Close</button>{upload && <pre className="mt-4 max-h-56 overflow-auto rounded-xl bg-purple-50 p-3 text-xs">{JSON.stringify(upload, null, 2)}</pre>}</div></dialog>
    <dialog id="studentUpload" className="rounded-2xl p-0"><div className="card w-[min(92vw,560px)]"><h3 className="text-xl font-bold text-teaPurple-900">Bulk Upload Students</h3><p className="mt-1 text-sm text-gray-600">Every row must reference an existing member by phone number or member ID.</p><input className="input mt-4" type="file" accept=".csv,.xlsx,.xls" onChange={event => setFile(event.target.files[0])} /><button className="btn-primary mt-4" onClick={() => uploadFile('students')}>Upload Students</button><button className="btn-gold ml-2" onClick={() => document.getElementById('studentUpload').close()}>Close</button>{upload && <pre className="mt-4 max-h-56 overflow-auto rounded-xl bg-purple-50 p-3 text-xs">{JSON.stringify(upload, null, 2)}</pre>}</div></dialog>
  </div>;
}
