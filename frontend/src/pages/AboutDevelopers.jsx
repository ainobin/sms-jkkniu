import { FaLinkedin, FaGithub, FaFacebook, FaEnvelope } from "react-icons/fa";
import UserContext from "../context/UserContext";
import { useContext } from "react";

const developers = [
    {
        name: "Md Ashraful Islam Nobin",
        role: "Student of Computer Science and Engineering, JKKNIU",
        session: "Session: 2021-22",
        linkedin: "https://linkedin.com/in/ashraful",
        github: "https://github.com/ashraful",
        facebook: "https://facebook.com/ashraful",
        image: "https://avatars.githubusercontent.com/u/133261184?v=4",
    },
    {
        name: "Md Abu Omayer Babu",
        role: "Student of Computer Science and Engineering, JKKNIU",
        session: "Session: 2021-22",
        linkedin: "https://bd.linkedin.com/in/md-abu-omayer-babu-800b1729a?trk=public_post_feed-actor-name",
        github: "https://github.com/Md-Abu-Omayer-Babu",
        facebook: "https://www.facebook.com/people/Md-Abu-Omayer-Babu/pfbid02j4q8HCTvHW3xFaCCCSiP1rcDqUSFpsug8xhSkbMgi3Vq2g1GKk5w2ARYPU7o6rcAl/",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuCHJQAGq2cR7Pkf9iOsyOIUfdRbj4nYze-w&s",
    },
];
const projectManager = {
    name: "Prof. Dr. A.H.M. Kamal",
    role: "Professor, Computer Science and Engineering, JKKNIU",
    email: "kamal@jkkniu.edu.bd",
    linkedin: "https://linkedin.com/in/kamal",
    image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ04CfZiFRLxUV0OYKqhIHgvBCM2VbiN5XZOw&s",
};


const AboutDevelopers = () => {
    const { user } = useContext(UserContext);
    // console.log("context: ",user);
    
    return (
        <div className="py-30 min-h-screen flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-bold text-green-700 mb-8">Meet the Team: {user?.fullName} </h2>

            {/* Project Manager Section */}
            <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Project Manager</h3>
                <div className="bg-white/80 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                    <img
                        src={projectManager.image}
                        alt={projectManager.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-500"
                    />
                    <h3 className="text-2xl font-semibold text-gray-900">{projectManager.name}</h3>
                    <p className="text-gray-700">{projectManager.role}</p>
                    <p className="text-gray-600">{projectManager.email}</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href={projectManager.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-blue-700 text-2xl hover:scale-110 transition-transform" />
                        </a>
                        <a href={`mailto:${projectManager.email}`}>
                            <FaEnvelope className="text-red-600 text-2xl hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Developers Section */}
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Developers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {developers.map((dev, index) => (
                    <div key={index} className="bg-white/80 p-6 rounded-lg shadow-lg text-center max-w-md">
                        <img
                            src={dev.image}
                            alt={dev.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
                        />
                        <h3 className="text-2xl font-semibold text-gray-900">{dev.name}</h3>
                        <p className="text-gray-700">{dev.role}</p>
                        <p className="text-gray-600">{dev.session}</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="text-blue-700 text-2xl hover:scale-110 transition-transform" />
                            </a>
                            <a href={dev.github} target="_blank" rel="noopener noreferrer">
                                <FaGithub className="text-gray-800 text-2xl hover:scale-110 transition-transform" />
                            </a>
                            <a href={dev.facebook} target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="text-blue-600 text-2xl hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutDevelopers;
