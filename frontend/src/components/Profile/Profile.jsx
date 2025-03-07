import { useContext, useState } from "react";
import  UserContext from "../../context/UserContext";
import Button from "../ui/Button";
import Input from "../ui/Input"; // Adjust imports based on your UI components
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeSignature, setChangeSignature] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "", 
    email: user?.email || "",
  });

  const [signature, setSignature] = useState(null);
  const [preview, setPreview] = useState(user?.signature || ""); 

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  
  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save name & email changes
  const handleSave = async () => {
    if(!formData.fullName || !formData.email){
      alert("Full Name and Email both Requied!!");
      return;
    }
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/v1/users/change-details",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log("Profile updated successfully", response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile", error);
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
  
    const formData = new FormData();
    formData.append("signature", signature);
  
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/v1/users/change-signature", 
        formData, 
        {
        headers: {"Content-Type": "multipart/form-data",},
        withCredentials: true

      });
      // console.log("Signature uploaded successfully", response.data);
      setChangeSignature(false);
      setPreview(null); // Clear preview after upload
    } catch (error) {
      console.error("Error uploading signature", error);
    }
  };
  // Handle password change (for demonstration, doesn't actually update context)
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if(newPassword.length < 6){
      alert("Passwords is minimum 6 character!");
      return;
    }
    // console.log("Password old:", oldPassword);
    // console.log("Password new:", newPassword);

    try {
      const response = await axios.patch(
        "http://localhost:3000/api/v1/users/change-password",

        {
          "oldPassword" : oldPassword,
          "newPassword" : newPassword
        },
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
      )
      if(response){
        alert("password changed successfully")
        // console.log("Response: ", response);
      }
    } catch (error) {
      alert("Password change failed");
      // console.log("failed: ", error);
    }

  };

  return (
    (user == null)? (
      <h3 className="text-center">Loading...</h3>
    ) : (
      <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#008337] mb-4">Profile</h2>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <p className="text-gray-600">Full Name</p>
          {editMode ? (
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          ) : (
            <p className="text-lg">{user.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <p className="text-gray-600">Email</p>
          {editMode ? (
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          ) : (
            <p className="text-lg">{user.email}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <p className="text-gray-600">Department</p>
          <p className="text-lg">{user.department}</p>
        </div>

        {/* Designation */}
        <div>
          <p className="text-gray-600">Designation</p>
          <p className="text-lg">{user.designation}</p>
        </div>

        {/* Role */}
        <div>
          <p className="text-gray-600">Role</p>
          <p className="text-lg">{user.role}</p>
        </div>

        {/* Signature */}
        <div>
          <p className="text-gray-600">Signature</p>
          <img src={user.signature} alt="Signature" className="w-32 h-20 border rounded" />
        </div>
      </div>

      {/* Edit Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        {/* Edit Name & Email */}
        {!editMode ? (
          <Button onClick={() => setEditMode(true)} className="bg-[#008337] text-white">
            Edit Name & Email
          </Button>
        ) : (
          <>
            <Button onClick={handleSave} className="bg-[#008337] text-white">
              Save Changes
            </Button>
            <Button onClick={() => setEditMode(false)} className="bg-gray-500 text-white">
              Cancel
            </Button>
          </>
        )}

        {/* Change Password */}
        <Button onClick={() => setChangePassword(true)} className="bg-blue-500 text-white">
          Change Password
        </Button>

        {/* Change Signature */}
        <Button onClick={() => setChangeSignature(true)} className="bg-purple-500 text-white">
          Change Signature
        </Button>
      </div>

      {/* Change Password Modal */}
      {changePassword && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <Input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2 mb-5"
          />
          <h3 className="text-lg font-semibold">Change Password</h3>
          <Input
            type="text"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2"
          />
          <Input
            type="text"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2"
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={handleChangePassword} className="bg-blue-500 text-white">
              Save Password
            </Button>
            <Button onClick={() => setChangePassword(false)} className="bg-gray-500 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Change Signature Modal */}
      {changeSignature && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Change Signature</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* Use preview URL instead of directly calling createObjectURL */}
          {preview && <img src={preview} alt="New Signature Preview" className="w-32 h-20 mt-2 border rounded" />}

          <div className="mt-4 flex gap-2">
            <Button onClick={handleSaveSignature} className="bg-purple-500 text-white">
              Save Signature
            </Button>
            <Button onClick={() => setChangeSignature(false)} className="bg-gray-500 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}

    </div>
    )
  );
};

export default Profile;
