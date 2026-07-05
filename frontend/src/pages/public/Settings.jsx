import { useState, useEffect } from "react";
import { User, Lock, Mail, MapPin, DollarSign, FileText, Camera, Loader2 } from "lucide-react";
import { getMe, updateMe, changePassword } from "../../api/users";
import useAuthStore from "../../store/authStore";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setFullName(data.fullName || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setHourlyRate(data.hourlyRate?.toString() || "");
        setAvatarUrl(data.avatarUrl || "");
      })
      .catch(() => toast.error("Failed to load user info"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateMe({
        fullName,
        bio,
        location,
        hourlyRate: user?.role === "EXPERT" && hourlyRate ? parseFloat(hourlyRate) : null,
        avatarUrl: avatarUrl || null,
      });
      setUser({ ...user, ...updated });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn text-[#1a1a3c]">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Account Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account profile and password.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Left tabs */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === "profile" ? "bg-orange-500 text-white shadow-md shadow-orange-100" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            <User size={18} />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === "password" ? "bg-orange-500 text-white shadow-md shadow-orange-100" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            <Lock size={18} />
            Security & Password
          </button>
        </div>

        {/* Right side form */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {activeTab === "profile" ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-lg font-bold text-[#15153d] border-b border-gray-50 pb-3">Edit Profile</h3>
              
              {/* Profile Avatar Input */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-gray-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Avatar URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full mt-1 p-3 border border-gray-200 bg-gray-50 text-gray-400 rounded-xl text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full mt-1 pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                      placeholder="e.g. Hanoi, Vietnam"
                    />
                  </div>
                </div>

                {user?.role === "EXPERT" && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Hourly Rate ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full mt-1 pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <Button type="submit" variant="primary" disabled={saving} className="px-6">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <h3 className="text-lg font-bold text-[#15153d] border-b border-gray-50 pb-3">Update Password</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                    placeholder="Enter your new password"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" disabled={passwordLoading} className="px-6">
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
