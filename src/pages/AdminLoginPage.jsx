import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object({
  username: Yup.string()
    .min(3, "Login kamida 3 ta belgidan iborat bo'lishi kerak")
    .max(50, "Login 50 ta belgidan oshmasligi kerak")
    .required("Login majburiy"),
  password: Yup.string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    .required("Parol majburiy"),
});

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const success = await login(values.username, values.password);
    setSubmitting(false);

    if (success) {
      navigate("/admin");
    } else {
      setFieldError("password", "Login yoki parol noto'g'ri");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-500 mt-2">
            Kirish uchun ma'lumotlaringizni kiriting
          </p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login
                </label>
                <Field
                  name="username"
                  type="text"
                  placeholder="admin"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                    touched.username && errors.username
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parol
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                    touched.password && errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isSubmitting ? "Kirilmoqda..." : "Kirish"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-500">
          <p className="font-medium mb-2">Demo ma'lumotlar:</p>
          <p>Login: admin</p>
          <p>Parol: admin123</p>
        </div>
      </div>
    </div>
  );
}
