'use client';

import { useState } from 'react';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (token: string, name: string) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.adminLogin(username, password);
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminName', response.data.name);
                onLoginSuccess(response.data.token, response.data.name);
            } else {
                setError(response.data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-cream w-full max-w-md mx-4 p-8 shadow-2xl animate-fade-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-primary/50 hover:text-primary transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-display text-2xl text-primary">Admin Access</h2>
                    <p className="text-primary/50 text-sm mt-2">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-primary/20 bg-cream-light text-primary focus:outline-none focus:border-secondary"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 border border-primary/20 bg-cream-light text-primary focus:outline-none focus:border-secondary"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-cream font-medium uppercase tracking-widest hover:bg-primary-light transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
