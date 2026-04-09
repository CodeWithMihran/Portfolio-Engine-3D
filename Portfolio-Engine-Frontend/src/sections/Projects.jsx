import { useEffect, useState } from "react";
import API from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section id="projects" className="min-h-screen text-white p-10">
      <h2 className="text-3xl font-bold mb-10">Projects</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-900 p-5 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="rounded-lg mb-4"
            />

            <h3 className="text-xl font-semibold">{project.title}</h3>

            <p className="text-gray-400 text-sm mt-2">
              {project.shortDescription}
            </p>

            <div className="flex gap-3 mt-4">
              <a
                href={project.githubLink}
                target="_blank"
                className="text-blue-400"
              >
                GitHub
              </a>
              <a
                href={project.liveLink}
                target="_blank"
                className="text-green-400"
              >
                Live
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;