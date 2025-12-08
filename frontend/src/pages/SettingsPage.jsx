import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Smartphone, ShieldCheck, Lock, CreditCard,
    Zap, Key, Bell, Link as LinkIcon, Eye, EyeOff, Camera,
    Upload, CheckCircle, AlertTriangle, LogOut, Trash2, Download, ArrowLeft
} from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);

    // Mock Data (Indian Context)
    const [user, setUser] = useState({
        fullName: "Rajesh Kumar",
        username: "rajesh_crypto_king",
        dob: "1990-05-15",
        country: "India",
        address: "123, Tech Park Road, Whitefield, Bengaluru, Karnataka - 560066",
        email: "rajesh.kumar@example.com",
        backupEmail: "rajesh.recovery@gmail.com",
        mobile: "+91 98765 43210",
        kycStatus: "Verified",
        plan: "Pro Trader",
        upiId: "rajesh@okhdfcbank",
        bankAccount: "HDFC0001234 •••••6789",
        wallet: "0x71C...9A23"
    });

    const sections = [
        { id: 'personal', label: 'Personal Information', icon: User },
        { id: 'email', label: 'Email Management', icon: Mail },
        { id: 'mobile', label: 'Mobile Number', icon: Smartphone },
        { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
        { id: 'security', label: 'Security Settings', icon: Lock },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
        { id: 'subscription', label: 'Subscription Plan', icon: Zap },
        { id: 'api', label: 'API Management', icon: Key },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'connected', label: 'Connected Accounts', icon: LinkIcon },
        { id: 'privacy', label: 'Privacy Settings', icon: Eye }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return <PersonalSection user={user} isEditing={isEditing} setIsEditing={setIsEditing} />;
            case 'email':
                return <EmailSection user={user} />;
            case 'mobile':
                return <MobileSection user={user} />;
            case 'kyc':
                return <KYCSection user={user} />;
            case 'security':
                return <SecuritySection />;
            case 'payment':
                return <PaymentSection user={user} />;
            case 'subscription':
                return <SubscriptionSection user={user} />;
            case 'api':
                return <APISection />;
            case 'notifications':
                return <NotificationSection />;
            case 'connected':
                return <ConnectedAccountsSection />;
            case 'privacy':
                return <PrivacySection />;
            default:
                return <PersonalSection user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Account Settings</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all border-l-4 ${activeSection === section.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <section.icon className="w-5 h-5" />
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 min-h-[600px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const SectionHeader = ({ title, desc }) => (
    <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
    </div>
);

const PersonalSection = ({ user, isEditing, setIsEditing }) => (
    <div>
        <div className="flex justify-between items-start">
            <SectionHeader title="Personal Information" desc="Manage your personal details and public profile." />
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
        </div>

        <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                </button>
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user.fullName}</h3>
                <p className="text-slate-500 text-sm">@{user.username}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" value={user.fullName} disabled={!isEditing} />
            <InputField label="Username" value={user.username} disabled={true} />
            <InputField label="Date of Birth" value={user.dob} type="date" disabled={!isEditing} />
            <InputField label="Country/Region" value={user.country} disabled={!isEditing} />
            <div className="md:col-span-2">
                <InputField label="Address" value={user.address} disabled={!isEditing} />
            </div>
        </div>
    </div>
);

const EmailSection = ({ user }) => (
    <div>
        <SectionHeader title="Email Management" desc="Manage your primary and backup email addresses." />
        <div className="space-y-6">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Primary Email</p>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 dark:text-white">{user.email}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                    </div>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline">Change</button>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Backup Email</p>
                    <span className="font-medium text-slate-800 dark:text-white">{user.backupEmail}</span>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline">Change</button>
            </div>
        </div>
    </div>
);

const MobileSection = ({ user }) => (
    <div>
        <SectionHeader title="Mobile Number" desc="Manage your phone number for 2FA and alerts." />
        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                        <Smartphone className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">{user.mobile}</p>
                        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3" /> Verified via OTP
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                        Remove
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Change Number
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const KYCSection = ({ user }) => (
    <div>
        <SectionHeader title="KYC Verification" desc="Verify your identity to unlock all features." />

        <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
                <h3 className="font-bold text-green-800 dark:text-green-300">KYC Verified</h3>
                <p className="text-sm text-green-700 dark:text-green-400">Your identity has been verified. You have full access.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4">Government ID</h4>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                        AADHAAR
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">Aadhaar Card</p>
                        <p className="text-xs text-slate-500">XXXX-XXXX-1234</p>
                    </div>
                    <span className="ml-auto text-green-600 text-xs font-bold">Verified</span>
                </div>
            </div>
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4">PAN Card</h4>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                        PAN
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">Permanent Account Number</p>
                        <p className="text-xs text-slate-500">ABCDE1234F</p>
                    </div>
                    <span className="ml-auto text-green-600 text-xs font-bold">Verified</span>
                </div>
            </div>
        </div>
    </div>
);

const SecuritySection = () => (
    <div>
        <SectionHeader title="Security Settings" desc="Protect your account with 2FA and device management." />

        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-slate-500">Secure your account with Google Authenticator.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Change Password</h4>
                    <p className="text-sm text-slate-500">Last changed 3 months ago.</p>
                </div>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                    Update
                </button>
            </div>

            <div className="mt-8">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4">Active Devices</h4>
                <div className="space-y-3">
                    <DeviceItem name="Windows PC - Chrome" location="Bengaluru, India" time="Active Now" current />
                    <DeviceItem name="iPhone 14 Pro" location="Mumbai, India" time="2 hours ago" />
                </div>
            </div>
        </div>
    </div>
);

const DeviceItem = ({ name, location, time, current }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-slate-700 rounded-full">
                <Smartphone className="w-4 h-4 text-slate-500" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {name} {current && <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded ml-2">Current</span>}
                </p>
                <p className="text-xs text-slate-500">{location} • {time}</p>
            </div>
        </div>
        {!current && (
            <button className="text-red-500 hover:text-red-600 p-2">
                <Trash2 className="w-4 h-4" />
            </button>
        )}
    </div>
);

const PaymentSection = ({ user }) => (
    <div>
        <SectionHeader title="Payment Methods" desc="Manage your bank accounts and crypto wallets." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentCard icon={CreditCard} title="Bank Account" value={user.bankAccount} sub="HDFC Bank" />
            <PaymentCard icon={Zap} title="UPI ID" value={user.upiId} sub="Verified" />
            <PaymentCard icon={Lock} title="Crypto Wallet" value={user.wallet} sub="MetaMask" />

            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-800">
                    <span className="text-2xl text-slate-400 group-hover:text-blue-600">+</span>
                </div>
                <span className="text-sm font-medium text-slate-500 group-hover:text-blue-600">Add New Method</span>
            </button>
        </div>
    </div>
);

const PaymentCard = ({ icon: Icon, title, value, sub }) => (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl relative group hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Icon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <button className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
        <h4 className="font-bold text-slate-800 dark:text-white">{value}</h4>
        <p className="text-sm text-slate-500 mt-1">{title} • {sub}</p>
    </div>
);

const SubscriptionSection = ({ user }) => (
    <div>
        <SectionHeader title="Subscription Plan" desc="Manage your billing and plan details." />

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-blue-100 font-medium mb-1">Current Plan</p>
                        <h3 className="text-3xl font-bold">{user.plan}</h3>
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold">Active</span>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                        Upgrade Plan
                    </button>
                    <button className="px-6 py-2 bg-transparent border border-white/30 rounded-lg font-bold hover:bg-white/10 transition-colors">
                        Manage Billing
                    </button>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>

        <h4 className="font-bold text-slate-800 dark:text-white mb-4">Billing History</h4>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Invoice</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                        <td className="p-4 text-slate-800 dark:text-white">Nov 01, 2025</td>
                        <td className="p-4 text-slate-800 dark:text-white">₹999.00</td>
                        <td className="p-4"><span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">Paid</span></td>
                        <td className="p-4"><button className="text-blue-600 hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button></td>
                    </tr>
                    <tr>
                        <td className="p-4 text-slate-800 dark:text-white">Oct 01, 2025</td>
                        <td className="p-4 text-slate-800 dark:text-white">₹999.00</td>
                        <td className="p-4"><span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">Paid</span></td>
                        <td className="p-4"><button className="text-blue-600 hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const APISection = () => (
    <div>
        <SectionHeader title="API Management" desc="Manage API keys for external integrations." />
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Active API Keys</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Create an API key to access the UltronFX market data programmatically.</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Generate New Key
            </button>
        </div>
    </div>
);

const NotificationSection = () => (
    <div>
        <SectionHeader title="Notifications" desc="Manage your alert preferences." />
        <div className="space-y-4">
            <ToggleItem title="Price Alerts" desc="Get notified when coins hit your target price." />
            <ToggleItem title="Trading Signals" desc="Receive AI-generated buy/sell signals." />
            <ToggleItem title="Security Alerts" desc="Login attempts and password changes." defaultChecked />
            <ToggleItem title="Marketing Emails" desc="News, updates, and special offers." />
        </div>
    </div>
);

const ConnectedAccountsSection = () => (
    <div>
        <SectionHeader title="Connected Accounts" desc="Manage social logins and linked accounts." />
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Google</h4>
                        <p className="text-sm text-slate-500">Connected as rajesh.kumar@example.com</p>
                    </div>
                </div>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-red-500">
                    Disconnect
                </button>
            </div>
        </div>
    </div>
);

const PrivacySection = () => (
    <div>
        <SectionHeader title="Privacy Settings" desc="Manage your data and account privacy." />
        <div className="space-y-6">
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Download Your Data</h4>
                <p className="text-sm text-slate-500 mb-4">Get a copy of your personal data, trading history, and preferences.</p>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Request Data Archive
                </button>
            </div>

            <div className="p-6 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Delete Account</h4>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    </div>
);

// --- Helpers ---

const InputField = ({ label, value, type = "text", disabled = false }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
        <input
            type={type}
            defaultValue={value}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-xl border ${disabled ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500'} transition-all`}
        />
    </div>
);

const ToggleItem = ({ title, desc, defaultChecked = false }) => (
    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div>
            <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

export default SettingsPage;
