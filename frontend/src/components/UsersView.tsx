import React, { useState } from 'react';
import { User } from '../types';
import { 
  UserPlus, 
  Search, 
  ShieldAlert, 
  UserCheck, 
  X, 
  Mail, 
  Phone, 
  Lock, 
  Calendar,
  Zap,
  Power,
  Users
} from 'lucide-react';

interface UsersViewProps {
  users: User[];
  onInviteUser: (user: Omit<User, 'id' | 'joinedDate'>) => void;
  onToggleUserStatus: (id: string) => void;
}

export default function UsersView({
  users,
  onInviteUser,
  onToggleUserStatus
}: UsersViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);

  // New admin layout states
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [invitePhone, setInvitePhone] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<'Super Admin' | 'Manager' | 'Reviewer' | 'Finance' | 'Support' | 'Customer'>('Manager');

  const filteredUsers = users.filter(u => {
    const searchMatch = !searchTerm || 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const roleMatch = !filterRole || u.role === filterRole;
    return searchMatch && roleMatch;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      alert('Invitees must have a legal name and designated email address.');
      return;
    }

    onInviteUser({
      name: inviteName,
      email: inviteEmail,
      phone: invitePhone,
      role: inviteRole,
      status: 'Active'
    });

    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteRole('Manager');
    setIsInviteOpen(false);
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-900 font-black';
      case 'Manager': return 'bg-sky-100 text-sky-850';
      case 'Reviewer': return 'bg-amber-100 text-amber-900';
      case 'Finance': return 'bg-emerald-100 text-emerald-900';
      case 'Support': return 'bg-slate-100 text-slate-700';
      case 'Customer': return 'bg-zinc-50 text-slate-500 font-medium border border-slate-150';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Platform Users</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Audit administrative staff clearances and customer status indices</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full px-5 py-2.5 flex items-center gap-1.5 shadow-sm transition-transform hover:-translate-y-0.5 self-start sm:self-center animate-pulse"
        >
          <UserPlus className="w-4.5 h-4.5" /> Invite Staff Member
        </button>
      </div>

      {/* Grid of quick stat monitors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center shadow-2xs">
          <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Global platform users</span>
          <span className="text-xl font-serif font-bold text-slate-800 block mt-1">
            {users.length} Users
          </span>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center shadow-2xs">
          <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Active Staff Admins</span>
          <span className="text-xl font-serif font-bold text-emerald-800 block mt-1">
            {users.filter(u => u.role !== 'Customer' && u.status === 'Active').length} staff
          </span>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center shadow-2xs">
          <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">General consumer accounts</span>
          <span className="text-xl font-serif font-bold text-slate-800 block mt-1">
            {users.filter(u => u.role === 'Customer').length} Clients
          </span>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center border-rose-100 shadow-2xs">
          <span className="block text-[8.5px] font-bold text-rose-500 uppercase tracking-widest">Suspended Accounts</span>
          <span className="text-xl font-serif font-bold text-rose-650 block mt-1">
            {users.filter(u => u.status === 'Suspended').length} Suspended
          </span>
        </div>
      </div>

      {/* Constraints and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search accounts catalog by owner name, email address, phone contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 text-emerald-950 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-2xs min-w-44"
        >
          <option value="">Filter Role: All</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Manager">Manager</option>
          <option value="Reviewer">Reviewer</option>
          <option value="Finance">Finance</option>
          <option value="Support">Support</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      {/* Grid displays users cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div 
              key={u.id} 
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all focus-within:ring-2 flex flex-col justify-between ${
                u.status === 'Suspended' ? 'border-rose-150 bg-rose-50/10' : 'border-emerald-100 hover:shadow-md'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-950 font-serif font-black text-sm flex items-center justify-center border-2 border-slate-200">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{u.name}</h4>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Joined on {new Date(u.joinedDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className={`p-1 px-2 text-[8px] font-black tracking-widest uppercase rounded-full ${
                    u.status === 'Active' ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-850' : 
                    u.status === 'Away' ? 'bg-amber-150 text-amber-850' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {u.status}
                  </div>
                </div>

                {/* Role tags layout */}
                <div className="flex items-center gap-1.5 flex-wrap border-t border-slate-50 pt-2.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getRoleBadge(u.role)}`}>
                    {u.role}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono lowercase">
                    {u.id}
                  </span>
                </div>

                {/* Sub-details fields */}
                <div className="space-y-1.5 text-xs text-slate-500 font-semibold pt-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+855 {u.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Account administrative interventions */}
              <div className="mt-4 border-t border-slate-100 pt-3 flex gap-2">
                <button 
                  onClick={() => onToggleUserStatus(u.id)}
                  className={`flex-grow py-1.5 text-2xs font-serif font-bold rounded-lg flex items-center justify-center gap-1 border transition-colors ${
                    u.status === 'Suspended' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-transparent' 
                      : 'bg-rose-50 border-rose-100 text-rose-850 hover:bg-rose-600 hover:text-white hover:border-transparent'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" /> {u.status === 'Suspended' ? 'Activate Account' : 'Suspend Account'}
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-slate-400">
            No matching accounts discovered under conditions.
          </div>
        )}
      </div>

      {/* STAFF INVITE MODAL POPUP */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-155 flex items-center justify-between">
              <h3 className="text-xs font-serif font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                <Lock className="w-4.5 h-4.5" /> Invite Staff Access Clearances
              </h3>
              <button 
                onClick={() => setIsInviteOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Legal full name</label>
                <input 
                  type="text" 
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Sok Phalla"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CLEARANCE ROLES ACCESS</label>
                  <select 
                    value={inviteRole}
                    onChange={(e: any) => setInviteRole(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none"
                  >
                    <option value="Manager">Manager (Global Inventories)</option>
                    <option value="Reviewer">Reviewer (Applicants Audit)</option>
                    <option value="Finance">Finance (Payout releasing)</option>
                    <option value="Support">Support (Helpdesk &amp; Forums)</option>
                    <option value="Super Admin">Super Admin (System Rules)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Staff Corporate Email</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. phalla@moutanak.kh"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Contact (Optional)</label>
                <input 
                  type="text" 
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="e.g. 012445566"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2 text-xs font-serif font-bold">
                <button 
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs"
                >
                  Issue Clearance Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
