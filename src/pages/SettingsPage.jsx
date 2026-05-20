import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Save } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setSubjects(user.subjects?.join(', ') || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await api.auth.updateMe({
      bio,
      subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
    });
    toast.success('Settings saved');
    setSaving(false);
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SectionHeader title="Settings" />

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="font-heading font-semibold mb-6">Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-heading font-semibold">{user?.full_name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{user?.role || 'student'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Bio</Label>
            <Textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Subjects (comma separated)</Label>
            <Input
              value={subjects}
              onChange={e => setSubjects(e.target.value)}
              placeholder="Mathematics, Physics, Chemistry"
              className="mt-1"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}