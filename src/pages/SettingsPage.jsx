import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Key } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, checkUserAuth } = useAuth();
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setSubjects(user.subjects?.join(', ') || '');
      setApiKey(localStorage.getItem('VITE_GEMINI_API_KEY') || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.auth.updateMe({
        bio,
        subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
      });
      localStorage.setItem('VITE_GEMINI_API_KEY', apiKey.trim());
      if (checkUserAuth) {
        await checkUserAuth();
      }
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
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

          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <Label className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-primary animate-pulse" />
                Gemini API Key
              </Label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline font-medium"
              >
                Get a free key →
              </a>
            </div>
            <Input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="font-mono mt-1"
            />
            <p className="text-xs text-muted-foreground">
              Your key is saved locally in your browser and never sent to our servers.
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}