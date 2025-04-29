import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config/config.js";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeSignature, setChangeSignature] = useState(false);

  // Add loading states for different operations
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingSignature, setSavingSignature] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const [signature, setSignature] = useState(null);
  const [preview, setPreview] = useState(user?.signature || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Helper function to reset all states
  const resetAllStates = () => {
    setEditMode(false);
    setChangePassword(false);
    setChangeSignature(false);
  };

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save name & email changes
  const handleSave = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Full Name and Email both Required!!");
      return;
    }

    setSavingProfile(true);
    try {
      const response = await axios.patch(
        `${config.serverUrl}/users/change-details`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setEditMode(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignature(file); // Store the file for FormData
      setPreview(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // Save new signature
  const handleSaveSignature = async () => {
    if (!signature) return;

    setSavingSignature(true);
    const formData = new FormData();
    formData.append("signature", signature);

    try {
      const response = await axios.patch(
        `${config.serverUrl}/users/change-signature`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Signature uploaded successfully");
      setChangeSignature(false);
      setPreview(null); // Clear preview after upload
    } catch (error) {
      console.error("Error uploading signature", error);
      toast.error("Failed to upload signature");
    } finally {
      setSavingSignature(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setSavingPassword(true);
    try {
      const response = await axios.patch(
        `${config.serverUrl}/users/change-password`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response) {
        toast.success("Password changed successfully");
        setChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Old password is incorrect");
        return;
      }
      if (error.response?.status === 400) {
        toast.error("old password and new password are required");
        return;
      }
      toast.error("Password change failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return user == null ? (
    <h3 className="text-center">Loading...</h3>
  ) : (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full mx-auto max-w-3xl">
      <h2 className="text-xl sm:text-2xl font-bold text-[#008337] mb-4">Profile</h2>

      {/* Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Full Name */}
        <div className="mb-2 sm:mb-0">
          <p className="text-gray-600 text-sm">Full Name</p>
          {editMode ? (
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-1 text-base"
            />
          ) : (
            <p className="text-base sm:text-lg">{user.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-2 sm:mb-0">
          <p className="text-gray-600 text-sm">Email</p>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2 w-full mt-1 text-base"
            />
          ) : (
            <p className="text-base sm:text-lg break-words">{user.email}</p>
          )}
        </div>

        {/* Department */}
        <div className="mb-2 sm:mb-0">
          <p className="text-gray-600 text-sm">Department</p>
          <p className="text-base sm:text-lg">{user.department}</p>
        </div>

        {/* Designation */}
        <div className="mb-2 sm:mb-0">
          <p className="text-gray-600 text-sm">Designation</p>
          <p className="text-base sm:text-lg">{user.designation}</p>
        </div>

        {/* Role */}
        <div className="mb-2 sm:mb-0">
          <p className="text-gray-600 text-sm">Role</p>
          <p className="text-base sm:text-lg">{user.role === "register" ? "Registrar" : user.role}</p>
        </div>

        {/* Signature */}
        <div className="mb-2 sm:mb-0">
          <p className="text-gray-600 text-sm">Signature</p>
          <img
            src={user.signature}
            alt="Signature"
            className="w-24 h-16 sm:w-32 sm:h-20 border rounded object-contain"
          />
        </div>
      </div>

      {/* Edit Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
        {/* Show buttons only when no edit option is active */}
        {!editMode && !changePassword && !changeSignature ? (
          <>
            <button
              onClick={() => {
                resetAllStates();
                setEditMode(true);
              }}
              className="bg-[#008337] cursor-pointer text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            >
              Edit Name & Email
            </button>

            <button
              onClick={() => {
                resetAllStates();
                setChangePassword(true);
              }}
              className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            >
              Change Password
            </button>

            <button
              onClick={() => {
                resetAllStates();
                setChangeSignature(true);
              }}
              className="bg-purple-500 cursor-pointer text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            >
              Change Signature
            </button>
          </>
        ) : (
          // When in edit mode, only show relevant action buttons
          editMode ? (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleSave}
                disabled={savingProfile}
                className="bg-[#008337] cursor-pointer text-white px-4 py-2 rounded flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
              >
                {savingProfile ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={resetAllStates}
                disabled={savingProfile}
                className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          ) : null
        )}
      </div>

      {/* Change Password Modal */}
      {changePassword && (
        <div className="mt-5 p-3 sm:p-4 border rounded-lg bg-gray-100">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2 mb-4 text-sm sm:text-base"
          />
          <h3 className="text-base sm:text-lg font-semibold">Change Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2 text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2 text-sm sm:text-base"
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
            >
              {savingPassword ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Password"
              )}
            </button>
            <button
              onClick={resetAllStates}
              disabled={savingPassword}
              className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change Signature Modal */}
      {changeSignature && (
        <div className="mt-5 p-3 sm:p-4 border rounded-lg bg-gray-100">
          <h3 className="text-base sm:text-lg font-semibold">Change Signature</h3>
          
          <div className="mt-3">
            <label htmlFor="signature-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Select an image file for your signature
            </label>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label 
                htmlFor="signature-upload" 
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm sm:text-base text-center sm:text-left w-full sm:w-auto"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-500 truncate">
                {signature ? signature.name : "No file selected"}
              </span>
            </div>
            
            <input
              id="signature-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={savingSignature}
              className="hidden"
            />
          </div>
          
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 mb-1">Preview:</p>
              <img
                src={preview}
                alt="New Signature Preview"
                className="w-24 h-16 sm:w-32 sm:h-20 border rounded object-contain bg-white"
              />
            </div>
          )}
          
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveSignature}
              disabled={savingSignature}
              className="bg-purple-500 cursor-pointer text-white px-4 py-2 rounded flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
            >
              {savingSignature ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Signature"
              )}
            </button>
            <button
              onClick={resetAllStates}
              disabled={savingSignature}
              className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;