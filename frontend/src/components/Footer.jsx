import React, { useState } from 'react';
import { Mail, Send, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const Footer = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: 'Query',
        message: ''
    });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('http://127.0.0.1:8000/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', topic: 'Query', message: '' });
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <footer className="w-full mt-20 z-10 relative">
            {/* Feedback Section */}
            <div className="w-full max-w-4xl mx-auto px-4 mb-12">
                <div className="glass-card overflow-hidden transition-all duration-500 border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full p-4 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">Have a Question or Feedback?</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>

                    <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/30 dark:bg-slate-900/30">
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                className="input-field"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                required
                                className="input-field"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <select
                                className="input-field md:col-span-2"
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                            >
                                <option>Query</option>
                                <option>Feedback</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                            </select>
                            <textarea
                                placeholder="Your Message..."
                                required
                                className="input-field md:col-span-2 h-24 resize-none"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className={`btn-primary flex items-center gap-2 ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                >
                                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent Successfully!' : status === 'error' ? 'Failed to Send' : (
                                        <>
                                            Send to Admin <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
                    <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Developed & Designed by UltronFX
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            © 2025 UltronFX. All Rights Reserved.
                        </p>
                    </div>

                    <a
                        href="mailto:sounakrider885@gmail.com"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-200 dark:border-slate-700"
                    >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">Contact: sounakrider885@gmail.com</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
