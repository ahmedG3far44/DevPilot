import React, { useState } from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useRepos } from "@/context/ReposContext";
import { Navigate, useParams } from "react-router-dom";

interface EnvVar {
  id: string;
  key: string;
  value: string;
}

interface ProjectFormData {
  packageManager: string;
  runScript: string;
  buildScript: string;
  entryFile: string;
  entryDirectory: string;
  envVars: EnvVar[];
  hasBuildScript: boolean;
}

const PACKAGE_MANAGERS = [
  {
    value: "npm",
    label: "npm",
    runCmd: "npm start",
    buildCmd: "npm run build",
    installCmd: "npm install",
  },
  {
    value: "yarn",
    label: "Yarn",
    runCmd: "yarn start",
    buildCmd: "yarn build",
    installCmd: "yarn install",
  },
  {
    value: "pnpm",
    label: "pnpm",
    runCmd: "pnpm start",
    buildCmd: "pnpm build",
    installCmd: "pnpm install",
  },
  {
    value: "bun",
    label: "Bun",
    runCmd: "bun start",
    buildCmd: "bun run build",
    installCmd: "bun install",
  },
];

const DeploymentProjectForm: React.FC = () => {
  const { repos } = useRepos();
  const { deployedProjectName } = useParams();

  if (!deployedProjectName) return <Navigate to={"/"} />;

  const deployedProject = repos.find(
    (project) => project.name === deployedProjectName
  );

  if (!deployedProject) return <Navigate to={"/"} />;

  const [formData, setFormData] = useState<ProjectFormData>({
    packageManager: "npm",
    runScript: "npm start",
    buildScript: "npm run build",
    entryFile: "index.js",
    entryDirectory: "./src",
    envVars: [],
    hasBuildScript: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePackageManagerChange = (packageManager: string) => {
    const pm = PACKAGE_MANAGERS.find((p) => p.value === packageManager);
    if (pm) {
      setFormData((prev) => ({
        ...prev,
        packageManager,
        runScript: pm.runCmd,
        buildScript: pm.buildCmd,
      }));
    }
  };

  const canAddEnvVar = () => {
    if (formData.envVars.length === 0) return true;
    const lastEnvVar = formData.envVars[formData.envVars.length - 1];
    return lastEnvVar.key.trim() !== "" && lastEnvVar.value.trim() !== "";
  };

  const addEnvVar = () => {
    if (!canAddEnvVar()) return;

    const newEnvVar: EnvVar = {
      id: Date.now().toString(),
      key: "",
      value: "",
    };
    setFormData((prev) => ({
      ...prev,
      envVars: [...prev.envVars, newEnvVar],
    }));
  };

  const updateEnvVar = (id: string, field: "key" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      envVars: prev.envVars.map((env) =>
        env.id === id ? { ...env, [field]: value } : env
      ),
    }));
  };

  const removeEnvVar = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      envVars: prev.envVars.filter((env) => env.id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.runScript.trim()) {
      newErrors.runScript = "Run script is required";
    }

    if (formData.hasBuildScript && !formData.buildScript.trim()) {
      newErrors.buildScript = "Build script is required when enabled";
    }

    if (!formData.entryFile.trim()) {
      newErrors.entryFile = "Entry file is required";
    }

    if (!formData.entryDirectory.trim()) {
      newErrors.entryDirectory = "Entry directory is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const cleanedData = {
        name: deployedProject.name,
        cloneUrl: deployedProject.clone_url,
        description: deployedProject.description,
        runScript: formData.runScript,
        buildScript: formData.hasBuildScript ? formData.buildScript : null,
        entryFile: formData.entryFile,
        entryDirectory: formData.entryDirectory,
        envVars: formData.envVars.filter(
          (env) => env.key.trim() && env.value.trim()
        ),
      };

      console.log("Form submitted:", cleanedData);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Deploy New Project
            </h1>
            <p className="text-slate-600">Configure your deployment settings</p>
          </div>

          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">
                Project configured successfully!
              </span>
            </div>
          )}
          <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Info size={20} />
              Repository Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Project Name
                </label>
                <p className="text-slate-900 font-medium">
                  {deployedProject.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Clone URL
                </label>
                <p className="text-slate-900 font-mono text-sm break-all">
                  {deployedProject.clone_url}
                </p>
              </div>
              {deployedProject.description && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Description
                  </label>
                  <p className="text-slate-900">
                    {deployedProject.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Package Manager <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.packageManager}
                onChange={(e) => handlePackageManagerChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                {PACKAGE_MANAGERS.map((pm) => (
                  <option key={pm.value} value={pm.value}>
                    {pm.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                Scripts will be automatically updated based on your selection
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Run Script <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.runScript}
                onChange={(e) => handleInputChange("runScript", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.runScript
                    ? "border-red-300 bg-red-50"
                    : "border-slate-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                placeholder="npm start"
              />
              {errors.runScript && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.runScript}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 py-4 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="hasBuildScript"
                checked={formData.hasBuildScript}
                onChange={(e) =>
                  handleInputChange("hasBuildScript", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="hasBuildScript"
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                This project requires a build step
              </label>
            </div>

            {formData.hasBuildScript && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Build Script <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buildScript}
                  onChange={(e) =>
                    handleInputChange("buildScript", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.buildScript
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="npm run build"
                />
                {errors.buildScript && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.buildScript}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Entry Directory <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.entryDirectory}
                  onChange={(e) =>
                    handleInputChange("entryDirectory", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.entryDirectory
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="./src"
                />
                {errors.entryDirectory && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.entryDirectory}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Entry File <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.entryFile}
                  onChange={(e) =>
                    handleInputChange("entryFile", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.entryFile
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="index.js"
                />
                {errors.entryFile && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.entryFile}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Environment Variables
                </label>
                <button
                  type="button"
                  onClick={addEnvVar}
                  disabled={!canAddEnvVar()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer font-medium rounded-lg transition ${
                    canAddEnvVar()
                      ? "text-blue-600 hover:bg-blue-50"
                      : "text-slate-400 bg-slate-100 cursor-not-allowed"
                  }`}
                  title={
                    !canAddEnvVar()
                      ? "Fill in the current environment variable before adding a new one"
                      : ""
                  }
                >
                  <Plus size={16} />
                  Add Variable
                </button>
              </div>

              {formData.envVars.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-slate-500 text-sm">
                    No environment variables added yet
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Click "Add Variable" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.envVars.map((env) => (
                    <div key={env.id} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={env.key}
                        onChange={(e) =>
                          updateEnvVar(env.id, "key", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="KEY"
                      />
                      <input
                        type="text"
                        value={env.value}
                        onChange={(e) =>
                          updateEnvVar(env.id, "value", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="value"
                      />
                      <button
                        type="button"
                        onClick={() => removeEnvVar(env.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 cursor-pointer rounded-lg transition"
                        title="Remove variable"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.envVars.length > 0 && !canAddEnvVar() && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Fill in both key and value to add another environment variable
                </p>
              )}
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 cursor-pointer"
              >
                Deploy Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeploymentProjectForm;
